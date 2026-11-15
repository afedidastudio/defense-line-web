# Mobile usability V2

## Implemented

- Landscape uses the maximum 16:9 canvas: 666.66×375 at 812×375, previously 552.88×311. Safe areas are respected.
- The fixed HTML dock is replaced by an optional floating Actions button. The drawer never opens automatically and closes after selections. No rotation text or privacy launcher covers the landscape HUD.
- First-time privacy appears alone, before the engine download; declining permits play without Google requests. Later privacy is available in Options/Actions and pauses combat.
- Portrait shows a full-screen rotation request, hides the canvas and pauses combat. Returning to landscape preserves the prior pause state. Hidden tabs require manual resume.
- Fullscreen is offered after a gesture. Fullscreen and orientation locking use browser APIs where supported, with manual rotation fallback.
- Native Godot title, briefing, tutorial, HUD, build and upgrade controls are enlarged. Critical controls in the touch acceptance flow are at least 44 CSS pixels. The build catalog is paginated.
- World build-pad selection happens on touch release, preventing the opening touch from accidentally purchasing a unit beneath the finger.
- The enlarged menu-plate cache is released on entry to combat; active buttons retain their own textures. This targeted change followed a measured texture-memory increase in the first UI build. Rendering, VRAM compression and game balance were not otherwise changed.

## Verification

Chrome 157.0.8103.78, Windows desktop with Intel i7-13620H and Intel UHD D3D11 graphics. Touch emulation at 812×375 and 375×812, device pixel ratio 2. No physical phone or Safari was tested.

The native touch flow passed privacy → title → briefing → all six guide pages → battle, building and upgrading a tower, hero ability, air support, reinforcements, portrait pause/return, manual drawer navigation, English guide and later privacy. No page/console errors or Google requests after declining were observed. Fullscreen rejection fallback was additionally exercised in an HTML test fixture; real mobile fullscreen/orientation permissions remain unverified.

Desktop title, briefing and frozen combat screenshots at 1280×720 match the baseline pixel for pixel. Desktop regression covers all ten enemy codices, Hebrew/English, stage 10→11, Yemen bonus and tower review. The stage transition uses a forced QA victory, not a human playthrough. Native checks passed: 4,119 campaign and 320 UI checks. All 12,333 original project files match their hashes; 2,124 protected source-image/data assets in the Web copy also pass validation.

## Performance: measured before and after

Two fresh browser contexts per build, localhost, 4× CPU slowdown, 5-second warmup and ~20-second frame sampling. The same deterministic QA stress scenario holds 66 enemies and eight tier-3 towers, with attacks/animations active; high enemy HP and zero movement keep the load constant. It is a synthetic stress test, not an actual phone measurement or campaign difficulty test. Values list run 1 / run 2.

| Metric | Before | After |
|---|---|---|
| Time to title (s) | 44.8 / 39.7 | 32.4 / 19.4 |
| Mean FPS, controlled combat | 1.16 / 1.44 | 2.63 / 3.06 |
| P95 frame duration (ms) | 1150 / 1066 | 717 / 534 |
| Godot texture memory (MiB) | 364.5 / 364.8 | 379.8 / 380.2 |
| JavaScript heap (MiB) | 14.5 / 16.6 | 14.7 / 13.8 |
| Browser private committed memory, own Chrome processes (MiB) | 1179 / 1196 | 1168 / 1180 |
| Browser working sets, sum of own processes (MiB) | 1480 / 1499 | 1448 / 1473 |

JavaScript heap excludes much of WASM/GPU memory. Process working-set sums can include shared pages; private committed memory is a different measure. Startup values are local fresh-context results without the human privacy-decision wait, not Internet loading times. Two runs do not establish a reliable speedup. This stress workload remains too slow; no mobile-performance pass is claimed. The initial enlarged UI build used about 452 MiB of texture memory before the targeted cache cleanup; its raw report is retained.

## Remaining work

Physical Android/iOS and Safari testing; real-device fullscreen/orientation and safe-area behavior; representative busy campaign performance and deeper CPU/GPU/memory profiling. Secondary campaign screens need a separate touch-design pass. The proposed richer maps, illustrated HUD and all-unlocked-unit catalog are documented separately and have not been applied by this mobile fix.

Screenshots: [landscape](docs/mobile-v2/landscape.png), [building](docs/mobile-v2/build.png), [upgrade](docs/mobile-v2/upgrade.png), [combat](docs/mobile-v2/battle.png), [portrait](docs/mobile-v2/portrait.png), [English guide](docs/mobile-v2/guide-en.png).
