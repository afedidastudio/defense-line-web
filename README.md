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

Phones and tablets get a 44px+ touch action panel, ability dock, target cancellation, map zoom and drag mode, safe-area spacing, and portrait/landscape layouts. Landscape is recommended for a larger map. Fullscreen is optional and falls back gracefully. Combat pauses when a touch-device tab is hidden and requires explicit resume. Core gameplay and the desktop UI are retained.

Validated using Chrome touch emulation at 390×844, 667×375, 844×390, and 1024×768, including real touch build/upgrade/sell, hero targeting, air strikes/cancellation, wave start, zoom/pan, and pause/resume. Physical Android/iOS devices and Safari have not been tested.
