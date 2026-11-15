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
