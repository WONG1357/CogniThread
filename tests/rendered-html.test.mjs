import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the CogniThread project site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CogniThread \| Synchronized cognitive rehabilitation<\/title>/i);
  assert.match(html, /Rehabilitation signals, finally moving together/);
  assert.match(html, /Synchronized context/);
  assert.match(html, /The software keeps every step connected/);
  assert.doesNotMatch(html, /Champion, Best Poster Award/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("removes starter-only preview code and dependency", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", projectRoot)));
});

test("uses the warm visual system and accessible GSAP hero animation", async () => {
  const [css, animation, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/HeroSignalAnimation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(css, /--paper:\s*#f8ead7/i);
  assert.match(css, /--accent:\s*#f2a65a/i);
  assert.doesNotMatch(css, /#c8ff4d|#9dd8d2/i);
  assert.match(animation, /useGSAP/);
  assert.match(animation, /gsap\.matchMedia/);
  assert.match(animation, /prefers-reduced-motion:\s*reduce/);
  assert.match(animation, /behaviour-moving-step/);
  assert.match(animation, /behaviour-step-trace/);
  assert.match(animation, /createEegRenderer/);
  assert.match(animation, /<canvas/);
  assert.match(animation, /headband-photo/);
  assert.match(animation, /\/senzeband-headband\.png/);
  assert.match(css, /\.headband-photo/);
  assert.match(css, /\.emission-wave/);
  assert.match(css, /\.behaviour-step-trace path/);
  assert.doesNotMatch(css, /\.hero::before|\.orbit-ring|\.wave\s*\{/);
  assert.match(packageJson, /"gsap"/);
  assert.match(packageJson, /"@gsap\/react"/);
});

test("removes the requested award strip and missing-link label", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /award-strip|The missing link|hero-foot/i);
});

test("renders the connected software journey with supplied screenshots", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /software-patient-login\.jpg/);
  assert.match(page, /software-device-setup\.jpg/);
  assert.match(page, /software-signal-ready\.jpg/);
  assert.match(page, /software-video-selection\.png/);
  assert.match(page, /Select a video to play/);
  assert.match(page, /selects a video session to play before starting the experiment/);
  await access(new URL("../public/software-video-selection.png", import.meta.url));
  assert.match(page, /The software keeps every step connected/);
  assert.match(css, /\.software-flow-track::before/);
});

test("removes award, team and footer disclaimer while enriching story sections", async () => {
  const [page, motion] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PageMotion.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /award-section|team-section|Research prototype for presentation/);
  assert.match(page, /problem-signal-board/);
  assert.match(page, /system-live-strip/);
  assert.match(page, /capture-grid/);
  assert.match(motion, /useGSAP|IntersectionObserver|prefers-reduced-motion/);
});

test("integrates generated project visuals, facial classification and GSAP motion", async () => {
  const [page, css, motion, heroMotion] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/PageMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/HeroSignalAnimation.tsx", import.meta.url), "utf8"),
  ]);

  for (const asset of [
    "why-rehabilitation-generated.png",
    "system-ecosystem-generated.png",
    "capture-signals-generated.png",
    "facial-classifier-generated.png",
  ]) {
    assert.match(page, new RegExp(asset.replace(".", "\\.")));
    await access(new URL(`../public/${asset}`, import.meta.url));
  }

  assert.match(page, /Facial classifier/);
  assert.match(page, /not used for identity recognition or diagnosis/);
  assert.match(css, /\.facial-classifier-panel/);
  assert.match(css, /\.generated-visual-image\s*\{[^}]*height:\s*auto[^}]*object-fit:\s*contain/s);
  assert.match(page, /sync-data-path-raw/);
  assert.match(page, /sync-data-path-behaviour/);
  assert.match(page, /sync-data-path-output/);
  assert.match(motion, /generated-visual-image/);
  assert.match(motion, /generated-visual-sweep/);
  assert.match(motion, /classifier-confidence/);
  assert.match(motion, /source-wave i/);
  assert.match(motion, /event-sequence i/);
  assert.match(motion, /capture-card-1/);
  assert.match(motion, /capture-card-2/);
  assert.match(motion, /capture-card-3/);
  assert.match(motion, /capture-card-4/);
  assert.match(motion, /system-travel-dot/);
  assert.doesNotMatch(page, /problem-bridge|capture-context-strip|capture-session-card|report-caption/);
  assert.match(heroMotion, /behaviour-step-mask/);
  assert.match(heroMotion, /behaviour-step-gap/);
});
