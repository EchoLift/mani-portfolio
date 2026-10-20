import { test } from "node:test";
import assert from "node:assert/strict";
import { emailHref, publicOrigin, socialHref } from "../src/lib/config";
import { fallbackPoster, muxPoster, safePoster, validPlaybackId } from "../src/lib/media";
import { selectPublishedProjects } from "../src/lib/projects";
import type { Project } from "../src/types/portfolio";

test("contact config rejects absent, malformed, and injected links", () => {
  assert.equal(emailHref(undefined), undefined);
  assert.equal(emailHref("not-an-email"), undefined);
  assert.equal(emailHref("editor@example.com?bcc=someone@example.com"), undefined);
  assert.equal(emailHref("editor@example.com"), "mailto:editor@example.com");
  assert.equal(socialHref("javascript:alert(1)", "instagram"), undefined);
  assert.equal(socialHref("https://instagram.com.evil.test/editor", "instagram"), undefined);
  assert.equal(socialHref("https://www.instagram.com/editor/", "instagram"), "https://www.instagram.com/editor/");
  assert.equal(publicOrigin("not a domain"), undefined);
  assert.equal(publicOrigin("https://portfolio.example/path"), "https://portfolio.example");
});

test("unpublished and invalid projects cannot enter public listing", () => {
  const fixture: Project = { slug: "real-film", title: "Film", category: "Editing", role: "Editing", year: 2026, featured: true, published: true };
  const results = selectPublishedProjects([
    fixture,
    { ...fixture, slug: "private-film", title: "Secret client", published: false },
    { ...fixture, slug: "../invalid" },
    { ...fixture, slug: "missing-title", title: "" },
    { ...fixture },
  ]);
  assert.deepEqual(results, [fixture]);
  assert.equal(JSON.stringify(results).includes("Secret client"), false);
});

test("missing media falls back without constructing broken playback URLs", () => {
  assert.equal(validPlaybackId(undefined), false);
  assert.equal(validPlaybackId("bad/id?"), false);
  assert.equal(muxPoster(undefined), fallbackPoster);
  assert.equal(safePoster("https://unconfigured.example/image.jpg"), undefined);
  assert.equal(safePoster("//untrusted.example/image.jpg"), undefined);
  assert.equal(safePoster("/images/local.jpg"), "/images/local.jpg");
  assert.match(muxPoster("rR8P8mSaKDzz02TsftugTUdI00cQPJX00oy"), /^https:\/\/image\.mux\.com\/.+\/thumbnail\.jpg\?/);
});

test("gallery supports zero, one, and ten distinct published films", () => {
  assert.deepEqual(selectPublishedProjects([]), []);
  const projects = Array.from({ length: 10 }, (_, index): Project => ({
    slug: `film-${index}`, title: `Film ${index}`, category: "Editing", role: "Editing",
    year: 2026, featured: index === 0, published: true,
  }));
  assert.equal(selectPublishedProjects(projects.slice(0, 1)).length, 1);
  assert.equal(selectPublishedProjects(projects).length, 10);
});
