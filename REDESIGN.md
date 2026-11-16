# Illustrated campaign release

Performance follow-up: the old stress measurements below describe this historical redesign release. The subsequent [retained-drawing update](MOBILE-PERFORMANCE.md) improves the matched test from approximately 7.7 to 44.6 submitted FPS without reducing artwork or effects.

Implemented in the separate Web fork. Play: https://afedidastudio.github.io/defense-line-web/ · Map gallery: https://afedidastudio.github.io/defense-line-web/review/

## Maps

All 100 campaign stages and the Yemen bonus now have separate 1280×720 painted compositions. Another 25 images cover route-changing events: 126 distinct PNG hashes altogether. The compositions combine the existing ten approved regional ground paintings and 23 painted props with twenty new landmark dioramas, region-specific scenery, terrain shelves, rivers, ravines and organic roads. These are individually composed scenes, not 126 paintings drawn from scratch. Original route geometry, build pads, navigation obstacles and combat statistics are preserved. Scenery avoids both the initial and event routes.

Compositions are baked offline into a single map texture; individual scenery objects are not redrawn as runtime nodes. Map textures load in the existing lazy sector packs. The separate bilingual gallery provides all 101 maps and event variants without downloading the game engine. Original assets remain untouched; new assets and a sidecar describe the new compositions.

## Build catalog and UI

Clicking a free build pad opens every unit unlocked by campaign progress. The old mandatory 4–6-unit preset no longer restricts purchases. Thirty unit families are available over the campaign, with seven category filters, separate locked-unit previews, prices, target types, benefits, limitations and range previews. Desktop shows six cards per page; phones show three larger cards. Selecting, filtering and paging spend nothing. Explicit confirmation purchases once. Opening the catalog pauses the battle, and closing it resumes only the pause it owns. Existing towers retain a compact upgrade/sell menu.

Painted wood/metal frames, compact life/gold/wave plates, hero bars and illustrated abilities share a visual language. Native touch pages now cover heroes, upgrades, achievements, the unit library, campaign sectors/stages, enemy codex and introduction. Hebrew and English are covered. Phone boss warnings sit below the resource counters; long wave information scrolls. The catalog sits above the HUD and blocks background actions.

Existing saves load normally. Audio remains off. The original game project and the GitHub Pages workflow are unchanged. Consent-gated GA4 configuration is unchanged.

## Verification

- Native redesign suite: **10,133 checks**, no failures; thirty families, 101 maps, twenty-five event transitions, unlocks, spending, pause ownership, both languages, phone text fitting and touch targets.
- Release build: 4,119 campaign checks and 320 UI checks passed; 2,124 protected source-asset hashes matched.
- Full live-combat automated sweep: **101/101 wins**, 4,186 checks, approximately 21.7 minutes. This verifies execution, not human difficulty or balance. Later changes were visual only.
- Browser: all 101 actual map textures loaded at 1280×720; all twenty-five event variants loaded through real game transitions. Catalog purchase/upgrade, filters and bilingual gallery passed with no browser errors.
- Chrome touch emulation: 812×375 landscape and 375×812 portrait. Touch-only entry, guide, building/upgrading, hero ability, air support, reinforcements, native campaign menus, orientation changes and privacy passed. Landscape canvas 666.66×375, the maximum 16:9 fit; touched controls at least 44 CSS pixels. Portrait displays the rotation screen. No tracking requests after declining.
- Original project integrity audit: **12,333 files**, zero added, removed or modified files.

Raw results and selected screenshots are in `docs/redesign/` in the published repository. QA commands are used for exhaustive map/event navigation; this is not a complete human campaign playthrough.

## Measured performance and remaining limits

Two fresh normal-profile runs per version, Chrome 157 on an i7-13620H / Intel UHD / 16 GB Windows computer. Phone emulation at 812×375, DPR 2, **4× CPU slowdown**. Controlled stress scene: 66 stationary high-HP enemies including a boss, eight identical tier-three towers, active combat/animations, five-second warmup and twenty-second sample. Review upgrades were disabled in both versions to keep damage and tower rosters identical. Local HTTP, not mobile network. Other build/test workloads were not run during sampling.

| Metric | Previous deployed build | Illustrated release |
|---|---:|---:|
| Time to main menu, runs | 9.61 / 10.94 s | 13.77 / 12.55 s |
| Mean sampled frame rate, runs | 3.31 / 3.85 FPS | 3.72 / 3.29 FPS |
| Engine draw calls at sample end | 536 / 560 | 436 / 422 |
| Engine texture bytes | 393,855,499 / 394,447,099 | 392,269,900 / 391,875,500 |
| Whole Chrome process-tree working set | 1,409 / 1,429 MiB | 1,427 / 1,421 MiB |
| Renderer working set | 573 / 583 MiB | 592 / 586 MiB |

The severe throttled stress scene remains slow. Fewer draw calls did not produce a demonstrated frame-rate improvement, and startup increased in these two runs. These are noisy diagnostic measurements, not proof of physical-phone performance. No claim of mobile performance completion is made. Physical Android/iOS devices, Safari, human balance testing and a broader performance investigation remain open. The visual release does not introduce speculative performance changes.

Downloads increased because stage compositions are distinct: the base pack is approximately 65.7 MB, and campaign regional packs approximately 8–10 MB (Yemen bonus 4 MB). Gallery images are separate, lazy-loaded and not part of the normal game startup. Exact exported byte sizes and hashes are in `site/manifest.json`.

## Public deployment verification

GitHub Pages deployment of 9ec81e1 succeeded. All 255 published resources matched local SHA-256 hashes and byte sizes, including Wasm MIME. Public-site Chrome checks passed all 101 maps, 25 event transitions, bilingual catalog/gallery and twelve touch/consent checks with no browser errors. The evidence-only follow-up commit does not change site resources.
