import { expect, test, type Locator, type Page } from "@playwright/test";
import data from "../../src/data/data.json";

declare global {
  interface Window {
    carouselTestContexts: WebGL2RenderingContext[];
    carouselTestLoss?: WEBGL_lose_context;
  }
}

const projects = [...data.projects].sort((a, b) => a.order - b.order);
const colors = projects.map((_, i) => [50 + i * 20, 90 + i * 10, 180 - i * 10]);

function poster(index: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="320"><rect width="180" height="320" fill="rgb(${colors[index].join(",")})"/></svg>`;
}

async function prepare(page: Page) {
  await page.addInitScript(() => {
    // Retain contexts to model delayed GC deterministically. Cleanup must release
    // their browser slots, rather than depend on when GC collects old cards.
    window.carouselTestContexts = [];
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      const context = Reflect.apply(original, this, [type, ...args]);
      if (type === "webgl2" && context && !window.carouselTestContexts.includes(context)) {
        window.carouselTestContexts.push(context);
      }
      return context;
    } as typeof original;
  });
  await page.route("https://image.mux.com/**", async route => {
    const index = projects.findIndex(project => route.request().url().includes(project.muxPlaybackId));
    await route.fulfill({
      contentType: "image/svg+xml",
      headers: { "access-control-allow-origin": "*" },
      body: poster(Math.max(0, index)),
    });
  });
  await page.route("**/_next/image?**", route => {
    const index = projects.findIndex(project => route.request().url().includes(project.muxPlaybackId));
    return route.fulfill({ contentType: "image/svg+xml", body: poster(Math.max(0, index)) });
  });
}

async function openCarousel(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const carousel = page.getByRole("region", { name: "Portfolio film carousel" });
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.locator("canvas")).toBeVisible();
  return carousel;
}

async function centerPixel(carousel: Locator) {
  return carousel.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext("webgl2");
    if (!gl || gl.isContextLost()) return [];
    const pixel = new Uint8Array(4);
    gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return Array.from(pixel);
  });
}

async function expectFilm(carousel: Locator, index: number) {
  await expect(carousel.locator('[aria-live="polite"]')).toHaveText(`${projects[index].title}, ${index + 1} of 9`);
  // A visible canvas can still be completely blank. Verify actual rendered
  // media pixels and their identity, including after the animation settles.
  await expect.poll(() => centerPixel(carousel)).toEqual([...colors[index], 255]);
}

async function swipe(page: Page, carousel: Locator, direction: number, cancel = false) {
  const bounds = await carousel.boundingBox();
  if (!bounds) throw new Error("Missing carousel bounds");
  const x = bounds.x + bounds.width * (direction > 0 ? 0.8 : 0.2);
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - direction * 12, y);
  await page.mouse.move(x - direction * bounds.width * 0.55, y, { steps: 2 });
  if (cancel) await carousel.dispatchEvent("pointercancel", { pointerId: 1 });
  await page.mouse.up();
}

test("film selector updates its number and controls immediately", async ({ page }) => {
  await prepare(page);
  const carousel = await openCarousel(page);
  await expectFilm(carousel, 0);
  for (const index of [1, 8, 0, 4]) {
    const selected = await page.getByRole("button", { name: `Go to ${projects[index].title}`, exact: true })
      .evaluate(async button => {
        (button as HTMLButtonElement).click();
        // Flush the discrete React event, without waiting for a carousel frame.
        await Promise.resolve();
        return button.getAttribute("aria-current");
      });
    expect(selected).toBe("true");
  }
  await expectFilm(carousel, 4);
});

test("rapid selections release old contexts and preserve all nine poster identities", async ({ page }) => {
  await prepare(page);
  const warnings: string[] = [];
  const errors: string[] = [];
  page.on("console", message => {
    if (/Too many active WebGL contexts/i.test(message.text())) warnings.push(message.text());
  });
  page.on("pageerror", error => errors.push(error.message));
  const carousel = await openCarousel(page);
  await expectFilm(carousel, 0);

  // Change direction before spring motion finishes, revisit projects, and wrap.
  for (const index of [1, 2, 3, 2, 1, 0, 8, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 8, 7, 6, 5, 4, 3, 2, 1, 0]) {
    await page.getByRole("button", { name: `Go to ${projects[index].title}`, exact: true }).evaluate(button => (button as HTMLButtonElement).click());
    await expect(carousel.locator('[aria-live="polite"]')).toHaveText(`${projects[index].title}, ${index + 1} of 9`);
  }
  await expectFilm(carousel, 0);
  for (let index = 0; index < projects.length; index++) {
    await page.getByRole("button", { name: `Go to ${projects[index].title}`, exact: true }).evaluate(button => (button as HTMLButtonElement).click());
    await expectFilm(carousel, index);
    await expect(page.locator(".active-film-spotlight h3").first()).toHaveText(projects[index].title);
  }
  await expect.poll(() => page.evaluate(() =>
    window.carouselTestContexts.filter(gl => !gl.isContextLost() && !(gl.canvas as HTMLCanvasElement).isConnected).length
  )).toBe(0);
  const spotlight = page.locator(".active-film-spotlight");
  await spotlight.scrollIntoViewIfNeeded();
  await expect.poll(() => spotlight.locator("canvas").evaluate((canvas: HTMLCanvasElement) =>
    canvas.getContext("webgl2")?.isContextLost()
  )).toBe(false);
  await expect(spotlight.getByRole("img", { name: /Film 09/ })).toBeVisible();
  await expect(spotlight.locator(".reflective-project-card > div > div > div")).toHaveCSS("opacity", "1");
  await expect(page.locator("mux-player")).toHaveCount(0);
  expect(warnings).toEqual([]);
  expect(errors).toEqual([]);
});

test("fast swipes, reversals, wraparound and interrupted gestures keep rendering", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  const carousel = await openCarousel(page);
  await expectFilm(carousel, 0);
  for (const direction of [1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1]) {
    await swipe(page, carousel, direction);
  }
  await swipe(page, carousel, -1, true);
  // The final project of an interrupted gesture depends on its timing; verify
  // the selected poster rather than asserting a timing-dependent index.
  await expect.poll(async () => {
    const text = await carousel.locator('[aria-live="polite"]').innerText();
    const index = projects.findIndex(project => text.startsWith(`${project.title},`));
    return JSON.stringify(await centerPixel(carousel)) === JSON.stringify([...colors[index], 255]);
  }).toBe(true);
  await carousel.focus();
  await page.keyboard.press("Home");
  await expectFilm(carousel, 0);
  await page.keyboard.press("ArrowLeft");
  await expectFilm(carousel, 8);
  await page.keyboard.press("ArrowRight");
  await expectFilm(carousel, 0);
});

test("context loss shows the current poster and restores rendering at the current selection", async ({ page }) => {
  await prepare(page);
  const carousel = await openCarousel(page);
  await expectFilm(carousel, 0);
  await carousel.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Context-loss extension unavailable");
    window.carouselTestLoss = extension;
    extension.loseContext();
  });
  const fallback = carousel.locator("[data-carousel-fallback]");
  await expect(fallback).toBeVisible();
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator('[aria-live="polite"]')).toContainText("Film 02, 2 of 9");
  await expect(fallback.locator("img")).toHaveAttribute("alt", /Film 02/);
  await expect.poll(() => fallback.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => window.carouselTestLoss?.restoreContext());
  await expect(fallback).toHaveCount(0);
  await expectFilm(carousel, 1);
});

test("delayed and failed thumbnails recover during navigation with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await prepare(page);
  let releasePoster!: () => void;
  const released = new Promise<void>(resolve => { releasePoster = resolve; });
  await page.route(`https://image.mux.com/${projects[1].muxPlaybackId}/**`, async route => {
    await released;
    await route.fulfill({
      contentType: "image/svg+xml",
      headers: { "access-control-allow-origin": "*" },
      body: poster(1),
    });
  });
  await page.route(`https://image.mux.com/${projects[2].muxPlaybackId}/**`, route => route.abort());
  await page.route("**/images/neutral-frame.svg", route =>
    route.fulfill({ contentType: "image/svg+xml", body: poster(8) })
  );
  const carousel = await openCarousel(page);
  try {
    await carousel.focus();
    await page.keyboard.press("ArrowRight");
    await expect(carousel.locator('[aria-live="polite"]')).toContainText("Film 02");
    await page.keyboard.press("ArrowRight");
    await expect(carousel.locator('[aria-live="polite"]')).toContainText("Film 03");
  } finally {
    releasePoster();
  }
  await expect.poll(() => centerPixel(carousel)).toEqual([...colors[8], 255]);
  await page.keyboard.press("ArrowLeft");
  await expectFilm(carousel, 1);
  await page.keyboard.press("ArrowLeft");
  await expectFilm(carousel, 0);
});

test("playback stays on demand and retries the selected project's failed player", async ({ page }) => {
  await prepare(page);
  // Hold delivery so we can navigate while loading and inject an error without
  // racing the player's initialization against a real network failure.
  await page.route("https://stream.mux.com/**", () => {});
  const carousel = await openCarousel(page);
  await expectFilm(carousel, 0);
  await page.getByRole("button", { name: "Go to Film 03", exact: true }).click();
  await expectFilm(carousel, 2);
  await expect(page.locator("mux-player")).toHaveCount(0);
  await page.getByRole("button", { name: "Watch Film 03", exact: true }).click();
  await page.getByRole("button", { name: "Load player for Film 03" }).click();
  const player = page.locator("mux-player");
  await expect(player).toHaveAttribute("playback-id", projects[2].muxPlaybackId);
  await player.evaluate(element => element.dispatchEvent(new CustomEvent("error")));
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText("This film couldn't be loaded.");
  await page.getByRole("button", { name: /Retry playback/ }).click();
  await expect(player).toHaveAttribute("playback-id", projects[2].muxPlaybackId);
  await page.keyboard.press("Escape");
  await expect(page.locator("mux-player")).toHaveCount(0);
  await carousel.scrollIntoViewIfNeeded();
  await carousel.focus();
  await page.keyboard.press("ArrowLeft");
  await expectFilm(carousel, 1);
  await page.keyboard.press("ArrowRight");
  await expectFilm(carousel, 2);
});
