# Mobile combat performance — retained drawing

The separate Web fork now retains fixed drawing geometry and caches animation frame selection. In the final alternating benchmark it improves submitted frame rate from **3.8–4.1 to 13.2–19.5 FPS**, approximately **4.1× on average**, under 4× CPU slowdown. Artwork, animation frames and timing, particle/effect density, render resolution, targeting, damage, paths and wave composition are unchanged. The protected original game project is not edited. No audio was added.

## Diagnosis

Chrome CPU/GL profiling found repeated `createBuffer`, `createVertexArray`, `deleteBuffer` and `deleteVertexArray` work during live enemy animation. Every enemy's custom `_draw()` recreated its fixed elliptical shadow whenever the animated body redrew. This also forced repeated GPU-resource lifetime and synchronization work. The same shadow geometry can be retained for the lifetime of the actor.

In a diagnostic-only run, suppressing GL draw submissions increased frame rate from approximately 5 to 20 FPS. Suppressing the HTML update alone did not yield a stable improvement. These altered-rendering runs locate costs; they are not playable builds and are not included in the before/after gains. Separately hiding ground decoration reduced draw calls from approximately 430 to 238, but noisy short profiling samples did not establish a standalone FPS gain for that change.

The ground/build-pad layer also submitted hundreds of small stones, outlines and contact-shadow primitives on every rendered frame despite changing only after player actions. Additional QA timing found 8.09 seconds cumulatively spent filtering actor frame arrays over 88,572 calls. The final release addresses all three costs:

- Each enemy has a retained shadow canvas item behind the animated body. It uses the exact original ellipse commands, inherits position and death opacity, and does not rebuild geometry on body animation redraws. Bosses, vehicles and aircraft keep their existing shadow sizes and ordering.
- Touch Web clients render the unchanged ground drawing into a **2560×1440** transparent cache, displayed at its original size with premultiplied-alpha blending. This preserves detail through the existing 1.65× zoom. Building, selling, route changes, touch-layout changes and zoom invalidate the cache; its viewport otherwise stops updating. Desktop keeps the original vector drawing.
- Enemy and boss animation selection retains immutable frame groups by actor, state and view, preserving the original authored order, mirroring, looping and one-shot timing. Repeated predicate calls and array allocations disappear. Measured lookup cost per call falls about 85–88%; the final runs record 1.05–1.22 seconds cumulatively over roughly 90,000–98,000 calls.

No enemy, animation, effect or decorative detail is removed. No frame-rate cap, physics-rate change or resolution reduction is used. The cache adds approximately 30 MiB to the engine's reported texture use in the final scene; that is an explicit memory tradeoff, not a memory optimization.

## Comparable final measurements

Frozen baseline: the static game exported in commit `8849ed0` (same game files as `9ec81e1`). Candidate: the final retained-drawing/frame-group build. Two fresh browser contexts per version, alternating **old → new → old → new in one browser**, without concurrent builds or test browsers. Chrome 157, Windows, i7-13620H / Intel UHD D3D11 / 16 GB RAM; touch emulation **812×375**, DPR 2, **4× CPU slowdown**. Local HTTP, normal fresh player profile, no review upgrades. No physical phone was used.

Each run contains the same 66 stationary high-HP enemies including a boss and eight tier-three towers, with combat and animations running. Five-second warmup, twenty-second sample. Enemy counts and the complete tower roster are asserted. In addition to browser RAF, the benchmark counts GL fullscreen-pass submissions; on the new build this also agrees with the engine's cumulative rendered-frame counter within 1%. No diagnostic suppression is active.

| Metric | Before, two runs | After, two runs |
|---|---:|---:|
| Submitted FPS | 3.82 / 4.08 | **19.54 / 13.16** |
| Median submission interval | 248.7 / 240.9 ms | **47.0 / 49.7 ms** |
| 95th-percentile submission interval | 354.4 / 298.2 ms | **78.9 / 174.1 ms** |
| Worst interval | 773.5 / 520.5 ms | 320.5 / 598.2 ms |
| Engine draw calls at sample end | 468 / 445 | **240 / 248** |
| Time to main menu | 11.74 / 10.44 s | 10.50 / 11.65 s |
| Engine texture memory | 374.1 / 374.3 MiB | 404.0 / 403.8 MiB |
| Renderer working set | 604.3 / 604.8 MiB | 628.5 / 583.1 MiB |
| Whole Chrome process-tree working set | 1,443.5 / 1,467.5 MiB | 1,524.2 / 1,519.0 MiB |

Average submitted frame rate improves approximately **4.1×** in the final controlled scenario. End-of-sample draw calls fall approximately 47%. Median submission interval improves roughly fivefold. Startup is essentially unchanged in these runs; process-memory samples remain noisy, and whole-browser memory increased. Long frames remain, including one 598 ms interval in the final run; this is not a claim that all stutter is fixed.

Earlier retained-geometry runs reached 37–45 FPS and a 5.8× improvement, but a later public-site test fell to about 8 FPS. An origin control alternating public → local → local → public reproduced 7.6–8.0 FPS on both origins with identical files, dimensions, visibility and hardware renderer. Host performance was variable, so those higher numbers are historical intermediate results, **not the final release promise**. The extra frame-group optimization and the alternating table above are the final assessment. All raw intermediate, slow-condition and origin-control reports are retained for transparency.

Raw reports, visual comparison evidence and release acceptance results are stored in `docs/performance/` in the static repository. Existing historical performance reports remain unchanged.

## Verification

- Final export: 4,119 campaign checks and 320 UI checks passed; 2,124 protected asset hashes matched.
- Native redesign regression: 10,133 checks passed across thirty tower families, 101 maps and both languages.
- Chrome touch flow: twelve existing acceptance checks passed, including privacy, campaign/guide entry, build/upgrade, hero/air/reinforcement controls, portrait/landscape and English screens. Declining consent sent no Google requests.
- All twenty-five route-changing events passed on the actual touch Web renderer, refreshed the ground cache and loaded the corresponding painted map. Native touch building, selling and zoom also invalidated the cache correctly.
- Fixed-pose vehicle/hero scene at 1280×720 desktop: **zero changed pixels**. At 812×375 touch/DPR 2, 0.058 mean RGB-channel difference out of 255; only thirty of 1,218,000 pixels differed by more than 32. Small supersampled vector-edge differences are expected; art, colors and shadows remain intact. Before/after screenshots are included.
- Original project re-audited: all 12,333 files matched their original SHA-256 hashes, with zero additions, removals or changes.
- Exact rendered comparison against the original animation selector: **16,396 pose/effect cases across 129 sheets, zero pixel-mismatch pages**. Covers authored views plus left mirroring, multiple animation ages, all enemy/boss pose states and boss effects.

The cache requests `UPDATE_ONCE` when invalidated. Godot's SubViewport getter keeps returning the requested mode even after the renderer consumes the one-shot update; it does not prove that the viewport keeps rendering. See the [engine getter implementation](https://github.com/godotengine/godot/blob/master/scene/main/viewport.cpp). Premultiplied-alpha compositing follows the [official viewport-texture guidance](https://docs.godotengine.org/en/4.5/tutorials/shaders/using_viewport_as_texture.html).

## Limits

This is a desktop Chrome emulation measurement, not a physical-device result. Android/iOS hardware, Safari, slow mobile networks and long sessions still need device testing. Neither the average improvement nor the observed FPS is guaranteed on a phone. Existing download sizes and regional loading behavior are preserved. Privacy consent, GA4, save compatibility and the GitHub Pages workflow are unchanged.
