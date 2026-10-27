# Development and delivery

## Structure

In each example, `src/engine.js` is a dependency-free WebGL2 renderer; `world.js` defines world-space meshes and collision regions; `textures.js` uses Canvas to generate material maps, **not to draw an entire pseudo-3D scene**. `audio.js` provides Web Audio synthesis. `app.js` controls cameras, input and bilingual copy. `style.css` and `index.template.html` define the interface.

`node scripts/build.mjs` assembles `index.html` (Chinese) and `index.en.html` (English). Paths resolve relative to the script, so projects can be relocated. Both are complete single-file applications, not remote pages or iframe wrappers. The root `scripts/build-all.mjs` builds both examples.

## Editing a new painting

Complete `design/painting-analysis.md` and `design/scene-plan.md` first. Replace scene content rather than merely its title:

| Change | Primary source |
|---|---|
| Subjects, paths, architecture, props, bounds | `src/world.js` |
| Sky, brushwork, palettes, signage | `src/textures.js` |
| Cameras, tour, destinations, copy | `src/app.js` |
| Light, fog, painterly postprocess | Shader sections in `src/engine.js` |
| Notes and musical pacing | `src/audio.js` |
| Layout, touch controls, responsiveness | `src/style.css` |

Do not carry the café's world-coordinate localized warm light into every painting. Change one level at a time, inspect the main composition, and only then add repeated detail. See the Skill's `references/engine-contract.md` for the exact bundled API.

## Validation

```bash
node scripts/check-package.mjs
node skills/en/painting-to-world/scripts/audit.mjs examples/the-scream
```

These are static checks only. Browser testing separately needs Python, Playwright, Pillow and Chromium; their binaries are not distributed. The portable test runner can be invoked from any working directory:

```bash
python tests/smoke.py --browser /path/to/chromium --case the-scream --suite desktop
python tests/smoke.py --browser /path/to/chromium --case cafe-terrace --suite mobile
```

Other suites are `tour` and `fallback`. Headless Linux may require `xvfb-run -a`. The runner loads local HTML text with `set_content` and blocks network requests. This is not file-URL navigation, physical-phone verification or a soundtrack listening test. Inspect current JSON reports in each example's `qa/`; historical reports are retained only for provenance.

## Editing marketing materials

`marketing/{locale}/` contains editable HTML and PNG exports. HTML uses screenshots within the package and system fonts; update copy and recapture it in a browser. PNGs are fixed-size publishing assets. Historical AI posters may contain small-text errors or unsupported claims and must not be treated as current product commitments.

## Hosting and video

The worlds are static sites and can be published through a static host. This package has not performed remote deployment and includes no domain, server or authentication system. Browser recording is possible, but no deterministic MP4 export pipeline or finished video is claimed here.

## Security and asset handling

The code contains no access tokens, background upload, analytics, microphone, camera or payment workflow. Input images stay as analysis material in your working directory. Do not send a private image to an external generation service without authorization. Optional museum-reference links are not runtime dependencies.

Retain author/provenance notes. Decide your own license and support scope before selling. Source availability alone does not establish commercial rights to every reference image.
