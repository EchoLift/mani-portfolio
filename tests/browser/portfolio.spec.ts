import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage is complete, accessible, and poster-first", async ({ page }) => {
  const errors: string[] = [];
  const mediaRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (request.url().includes("stream.mux.com")) mediaRequests.push(request.url()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("EDITING STORIES.");
  await expect(page.locator("main section[id]")).toHaveCount(4);
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator("mux-player")).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
  await page.getByRole("link", { name: "View Selected Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("project route, poster fallback, 404, and SEO endpoints", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore Featured Film", exact: true }).click();
  await expect(page).toHaveURL(/\/work\/featured-film$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Featured Film");
  await expect(page.locator("mux-player")).toHaveCount(0);
  await expect(page.getByText(/Mux demonstration content/)).toBeVisible();
  expect((await request.get("/work/not-published")).status()).toBe(404);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
  expect((await request.get("/work/featured-film/opengraph-image")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  await page.route("**/_next/image?**", (route) => route.fulfill({ status: 404 }));
  await page.goto("/");
  await expect(page.locator(".hero-backdrop img")).toHaveAttribute("src", "/images/neutral-frame.svg");
});

test("dialog traps focus, closes with Escape, restores focus and unloads video", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Watch featured film", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close video" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Load player for Featured Film" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Load player for Featured Film" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("mux-player")).toHaveCount(0);
});

test("player initializes on intent and exposes a retry state on failure", async ({ page }) => {
  await page.goto("/work/featured-film");
  await page.getByRole("button", { name: "Load player for Featured Film" }).click();
  await expect(page.locator("mux-player")).toHaveCount(1);
  await expect(page.locator("mux-player")).toHaveAttribute("playback-id", "rR8P8mSaKDzz02TsftugTUdI00cQPJX00oy");
  await page.locator("mux-player").evaluate((player) => player.dispatchEvent(new CustomEvent("error")));
  await expect(page.locator(".player-error[role=alert]")).toContainText("This film couldn’t be loaded.");
  await page.getByRole("button", { name: /Retry playback/ }).click();
  await expect(page.locator("mux-player")).toHaveCount(1);
});

test("mobile disclosure works with keyboard and section links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("layouts fit representative viewports, and reduced motion is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator(".headline-word").first().evaluate((element) => getComputedStyle(element).transform)).toBe("none");
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  }
});

test("hero fills the viewport below the navbar without internal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900, rows: 2 },
    { width: 768, height: 800, rows: 2 },
    { width: 390, height: 844, rows: 3 },
    { width: 320, height: 568, rows: 3 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".hero-bg > div > div > div").first()).toBeAttached();
    const geometry = await page.evaluate(() => {
      const header = document.querySelector(".site-header");
      const hero = document.querySelector(".hero");
      const content = document.querySelector(".hero-content");
      const background = document.querySelector(".hero-bg");
      const plane = background?.firstElementChild?.firstElementChild;
      if (!header || !hero || !content || !background || !plane) throw new Error("Hero layout is incomplete");
      const headerRect = header.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const backgroundRect = background.getBoundingClientRect();
      const tileRows = Array.from(plane.children, row =>
        Array.from(row.children, tile => tile.querySelector("img")?.getAttribute("src") ?? "")
      );
      const tileFoci = Array.from(plane.querySelectorAll("img"), image =>
        (image as HTMLImageElement).style.objectPosition
      );
      return {
        viewportHeight: window.innerHeight,
        headerBottom: headerRect.bottom,
        heroTop: heroRect.top,
        heroBottom: heroRect.bottom,
        contentFits: content.scrollHeight <= content.clientHeight + 1,
        backgroundMatchesHero: Math.abs(backgroundRect.height - heroRect.height) <= 1,
        tileRows,
        tileFoci,
      };
    });

    expect(geometry.heroTop).toBeCloseTo(geometry.headerBottom, 0);
    expect(geometry.heroBottom).toBeCloseTo(geometry.viewportHeight, 0);
    expect(geometry.contentFits, `${viewport.width}x${viewport.height}`).toBe(true);
    expect(geometry.backgroundMatchesHero).toBe(true);
    expect(geometry.tileRows).toHaveLength(viewport.rows);
    expect(geometry.tileFoci).toContain("50% 20%");
    await expect(page.getByRole("link", { name: "View Selected Work", exact: true })).toBeVisible();

    for (let row = 0; row < geometry.tileRows.length; row++) {
      for (let column = 0; column < geometry.tileRows[row].length; column++) {
        const source = geometry.tileRows[row][column];
        if (column > 0) expect(source).not.toBe(geometry.tileRows[row][column - 1]);
        if (row > 0) {
          expect(source).not.toBe(geometry.tileRows[row - 1][column]);
          if (column > 0) expect(source).not.toBe(geometry.tileRows[row - 1][column - 1]);
          if (column + 1 < geometry.tileRows[row].length) {
            expect(source).not.toBe(geometry.tileRows[row - 1][column + 1]);
          }
        }
      }
    }
    const repeatedTextAssets = [
      "YxWQuGnBEHal1i1g4KfwoSNuqlfMUsBcbyv4i65h3d4",
      "iD2QAFJ5Y4OOCb02Ct6qN6W6drPoa55NEqnRbAeCgd9c",
      "G00QmYUe8MWY69cvzmD02a9Orcn02XeqmYD02vNEnqZeUZg",
      "jhFLo00LWuraSSH01Bu3UAAQkrTeS5Oaoqy9G02aSSTR7g",
      "m902El8ZXoZ3QkNByvSDXKC00H64I3UGubUUdCC72XGxw/thumbnail.jpg?width=1600&time=16",
      "1Y01e8e8Y02aDeIdXq01Fz2LIDkl434rc01Gld1r6h101C3A/thumbnail.jpg?width=1600&time=16",
    ];
    for (const source of geometry.tileRows.flat()) {
      for (const playbackId of repeatedTextAssets) {
        expect(source).not.toContain(playbackId);
      }
    }
  }
});

test("core text and project navigation remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Explore Featured Film" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Featured Film");
  await context.close();
});
