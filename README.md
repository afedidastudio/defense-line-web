# קו ההגנה / Defense Line — Web

Godot Web Release, without audio. This repository contains the exported static game only.

Play: https://afedidastudio.github.io/defense-line-web/

## Deployment

GitHub Actions publishes `site/` to GitHub Pages on pushes to `main`.
The exported game uses relative URLs and loads sector packs from `packs/` on demand.
The illustrated splash shows real loading progress.

## Updating

Build from the separate `idf-defense-web` Godot project, replace the contents of `site/` with its `web/` export, preserve `.nojekyll`, and push to `main`.
Do not add the original Godot project, its source assets, engine executables, templates, saves, or local test folders here.

## Local preview

Run a static HTTP server in `site/` (serve `.wasm` as `application/wasm`), then open its URL. Do not open `index.html` directly.

## Browser data

Progress is stored in the browser. Clearing site data removes local progress. Saves are separate from the Windows build.

## Initial validation

The detached Web copy passed campaign and campaign UI checks after each conversion phase. Chrome smoke coverage includes Hebrew/English UI, briefing and combat, stage 10→11 transition, all ten enemy codices, the Yemen bonus, and tower review. The stage-10 victory used to exercise the transition was forced by a QA command. A complete human playthrough and mobile/cross-browser coverage have not been performed.

## Touch screens

Touch devices use a full-height landscape canvas with enlarged native Godot HUD, briefing, guide, build and upgrade controls (44 CSS px minimum at the tested phone size). An optional floating Actions button replaces the permanent HTML dock; it never opens automatically and closes after selections. Portrait displays a full-screen rotation request and pauses combat. Privacy appears alone before the initial engine download and is available later from Options/Actions. Fullscreen and landscape locking are attempted on a user gesture with a manual-rotation fallback. Hidden tabs remain paused until explicitly resumed.

The latest acceptance run uses Chrome touch emulation at 812×375 and 375×812: privacy → title → briefing → guide → combat, build/upgrade, hero ability, air support and reinforcements. The landscape canvas is 666.66×375 (maximum 16:9). The illustrated redesign intentionally updates desktop and phone art; the earlier pixel-identical desktop comparison applies only to the preceding mobile fix. Physical Android/iOS devices and Safari have not been tested. See [REDESIGN.md](REDESIGN.md) for current measurements and limitations; MOBILE-V2.md documents the earlier release.

## Optional Analytics

GA4 uses the owner-supplied Web stream G-23KW675G31. Google is loaded only after explicit consent; declining does not affect the game. Use Privacy to change the choice. See [ANALYTICS.md](ANALYTICS.md) for events, privacy controls, verification and dashboard instructions.

Enemy vehicle graphics now use smaller family footprints and a constant scale across all eight headings. Combat statistics are unchanged.

## Illustrated campaign

All 101 stages now have separate painted compositions, with 25 additional route-event variants. Click a build pad to select from every unit unlocked by campaign progress: category filters, illustrated cards, range preview and an explicit purchase confirmation. The catalog pauses combat; the old 4–6-unit preset no longer limits building. Existing towers use a compact upgrade/sell menu.

Illustrated HUD plates, frames and native phone pages cover heroes, upgrades, achievements, unit library, campaign selection and codex in Hebrew and English. Browse the [101-map gallery](https://afedidastudio.github.io/defense-line-web/review/). See [implementation and tests](REDESIGN.md) and the [original design direction](VISUAL-REDESIGN-HE.md). Automated combat passed all 101 stages; this is not a human balance playtest.

## Mobile combat performance

Retaining enemy shadow geometry, caching touch build-pad decoration and caching immutable animation frame groups improves the final alternating 66-enemy stress test from **3.8–4.1 to 13.2–19.5 submitted FPS**, about 4.1× on average, under 4× CPU slowdown in Chrome phone emulation. Earlier runs reached 44 FPS, but host variability reproduced much lower rates on both local and public origins; the final alternating measurements are the conservative assessment. No art, effects, animation frames or render resolution were removed or reduced. Desktop comparison is pixel-identical; touch has minor supersampled edge differences. All 16,396 tested animation/effect poses match the original rendering exactly. The high-resolution ground cache adds about 30 MiB of reported texture memory. Long frames remain; physical phones and Safari remain untested. See [measurements, diagnosis, screenshots and limitations](MOBILE-PERFORMANCE.md).

## Regional enemy vehicles

West Bank uses a civilian pickup and an improvised armored van. South Lebanon uses an armed pickup and an armored off-road SUV. All four include a fictional enemy gunner and eight headings. Visual family sizes, ground anchors, health bars and codex names are region-specific; HP, damage, armor and wave rosters retain their existing values. Other sectors retain the resized generic vehicles.

Sector pack hashes are embedded in the generated HTML and version persistent asset-cache filenames. Old sector cache files are removed after a current pack is mounted, preventing older clients from retaining a pack that lacks newly added art. No saved player progress is deleted.
