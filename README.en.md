# Painting to World · 入画
## Turn a painting into a world you can enter.

**1.1 · Complete Chinese / English creative kit · MakerJackie**

Start with `START-HERE.html`, the offline directory for this package. It is not a hosted image-upload generator.

This kit extracts the method and working code behind the successful Café Terrace at Night example: painting analysis, recognition anchors, real 3D geometry, painterly materials, camera choreography, browser review and source delivery. The rejected simplified Starry Night prototype is not included.

## Contents

| Content | Location |
|---|---|
| Self-contained Chinese Skill | `skills/zh-CN/painting-to-world/` |
| Self-contained English Skill | `skills/en/painting-to-world/` |
| Chinese guide, product copy, prompts and development notes | `docs/zh-CN/` |
| English guide, product copy, prompts and development notes | `docs/en/` |
| Café Terrace at Night website and complete source | `examples/cafe-terrace/` |
| The Scream website and complete source, rebuilt this edition | `examples/the-scream/` |
| Release posters and editable HTML in both languages | `marketing/zh-CN/`, `marketing/en/` |
| Current browser screenshots and raw test results | Each example's `qa/` folder |
| Historical AI concept posters and previous Scream screenshots | `marketing/archive-ai-concepts-zh-CN/`, `archive/` |

## Quick start

Open an example's `index.html` for Chinese or `index.en.html` for English. A language switch remains available inside both. Geometry, textures and audio run without network assets; only optional museum-reference links require the internet. Use a WebGL2-capable desktop browser. Some mobile operating systems preview local HTML as a document; a static hosted page is the practical route for mobile visitors.

For a new painting, choose **one** Skill language. Give the entire `painting-to-world` folder to an image-capable coding AI with local file access, together with the reference image. Do not copy only `SKILL.md` and omit its code assets. See the usage guide for installation and a complete invocation.

```text
Use the painting-to-world Skill to turn my uploaded painting into a genuinely walkable 3D website.
Analyze its composition and recognition anchors first. Reuse the café's engineering, not its scene.
Include Chinese and English, a guided tour, free exploration, mobile controls and real PNG export.
Inspect actual browser renders and repair them. Deliver offline HTML, full source and a QA report.
```

## Build locally

From this package's root, with Node.js 18+; no npm install is needed:

```bash
node scripts/build-all.mjs
node scripts/check-package.mjs
```

This rebuilds the supplied examples in both languages. It does not automatically convert a newly uploaded painting.

## Provenance

The café preserves the successful scene, geometry, materials and cameras. This edition adds language entry points, loading/accessibility localization, localized postcard text and relocatable packaging. The exact original HTML and historical QA remain under the example's `archive/`.

Only screenshots of the previous Scream example survived; its source was not recovered. The supplied Scream is a fresh implementation using the café WebGL renderer, not an undisclosed substitute presented as recovered source. Old screenshots are historical records. Release posters use captures from this edition's runnable code. The original artwork and the authored 3D space are separate things.

This Skill is a workflow and code baseline for an AI, not an independent image-to-3D model. New paintings require image-specific authoring, review and iteration. Identical quality from every image in one pass is not promised. Model credits, hosting and finished video exports are not included. See `docs/en/PRODUCT.md` and `docs/en/QA.md` for scope.
