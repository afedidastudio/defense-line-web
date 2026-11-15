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

The latest acceptance run uses Chrome touch emulation at 812×375 and 375×812: privacy → title → briefing → guide → combat, build/upgrade, hero ability, air support and reinforcements. The landscape canvas is 666.66×375 (maximum 16:9), compared with 552.88×311 previously. Desktop title, briefing and frozen combat screenshots at 1280×720 match the previous build pixel for pixel. Physical Android/iOS devices and Safari have not been tested. See MOBILE-V2.md for measurements and limitations.

## Optional Analytics

GA4 uses the owner-supplied Web stream G-23KW675G31. Google is loaded only after explicit consent; declining does not affect the game. Use Privacy to change the choice. See [ANALYTICS.md](ANALYTICS.md) for events, privacy controls, verification and dashboard instructions.

Enemy vehicle graphics now use smaller family footprints and a constant scale across all eight headings. Combat statistics are unchanged.

The separate [visual redesign proposal](VISUAL-REDESIGN-HE.md) describes richer stage compositions, an illustrated HUD and a build catalog containing all unlocked units. These proposals are not part of the mobile usability change.

## Regional enemy vehicles

West Bank uses a civilian pickup and an improvised armored van. South Lebanon uses an armed pickup and an armored off-road SUV. All four include a fictional enemy gunner and eight headings. Visual family sizes, ground anchors, health bars and codex names are region-specific; HP, damage, armor and wave rosters retain their existing values. Other sectors retain the resized generic vehicles.

Sector pack hashes are embedded in the generated HTML and version persistent asset-cache filenames. Old sector cache files are removed after a current pack is mounted, preventing older clients from retaining a pack that lacks newly added art. No saved player progress is deleted.
