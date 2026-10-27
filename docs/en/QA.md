# Current-release QA report

## Result and scope

The two real WebGL2 examples were tested across desktop, mobile viewports, complete tours and missing-WebGL fallbacks: **130 passed / 130 checks**. These are implementation and interaction checks, not an artistic-fidelity score or evidence that arbitrary paintings produce identical quality.

The café renderer, scene, textures, audio and styles are hash-identical to the recovered successful source. Current entry points add language/accessibility copy. The complete untouched original HTML, source and historical reports are retained under `examples/cafe-terrace/archive/`.

The Scream was reauthored and tested in this release. Only images survived from the earlier version. Historical screenshots and AI concept posters are archived separately and are not counted as current test evidence.

## Browser suites

| Example | Desktop | Mobile viewports | Complete tour | WebGL fallback |
|---|---:|---:|---:|---:|
| Café Terrace at Night | 33/33 | 17/17 | 11/11 | 4/4 |
| The Scream, rebuilt edition | 33/33 | 17/17 | 11/11 | 4/4 |

Checks cover: WebGL2/depth rendering, five draw batches and the GL error flag; Chinese/English entry points and switching; actual camera movement, flight altitude and walking bounds; six destinations; complete 28/32-second tours and manual interruption; no audio autoplay on load, user-triggered AudioContext start and mute; interface hide/restore; a real downloaded PNG; 360×800 and 800×360 viewports, joystick and altitude controls; readable missing-WebGL fallback; no unhandled JavaScript errors or runtime external requests.

## Method and limits

Executed on Linux with Chromium 144.0.7559.96, Playwright, Xvfb and SwiftShader. Because navigation is restricted in this environment, the real complete HTML was loaded with `set_content`, with all network requests blocked. **This is not an end-to-end test of double-clicking a file:// page on the user's computer or visiting a hosted URL.** The inlined-resource structure was also statically checked.

Safari, Firefox, physical iPhone/Android devices, multiple GPUs and long-duration sessions were not tested. Software-rendering timings are not hardware performance claims. Audio scheduling and toggling were checked, but no human listening review was performed. Installation in an actual AI client was not exercised. No arbitrary-image conversion generalization test was performed; this kit does not contain such an inference model.

## Builds, languages and promotional assets

Both Skill YAML headers were parsed. Initialization, paths containing spaces, relocation, unchanged reference copying, refusal to overwrite a nonempty directory and rejection of unsupported image formats were executed. Both examples were rebuilt in temporary locations, producing byte-identical Chinese and English HTML. See `qa/current/portability.json`.

Eight new bilingual promotional PNGs use actual WebGL frame captures from this release, without interface overlays, and include editable HTML. Page widths and footer positions were checked; landscape and portrait renderings were visually inspected. No font binaries are distributed. Historical concept-poster copy is not a capability promise; the release documents are authoritative.

## Evidence and reruns

Each example's `qa/test-*.json` contains itemized results. The same directory includes desktop, both mobile locales, reverse/aerial views, full-tour completion and the exported PNG. `qa/current/cafe-baseline-integrity.json` records preservation of the original baseline.

From the extracted package root:

```bash
node scripts/build-all.mjs
node scripts/check-package.mjs
python tests/smoke.py --browser /path/to/chromium --case cafe-terrace --suite desktop
```

The browser test script requires separately installed Python Playwright and Chromium; a Linux software-rendering environment may also require Xvfb. These are not website runtime dependencies. Current static package results are saved in `qa/current/package-static.json`; static checks do not replace browser or visual review.
