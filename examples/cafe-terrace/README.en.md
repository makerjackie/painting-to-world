# Café Terrace at Night · Complete example source

Preserves the successful original scene; this edition only completes localization and packaging. Original meshes, materials and camera design are unchanged; the original is archived.

Open `index.html` for Chinese or `index.en.html` for English. Both include a language switch.

## Build

```bash
node scripts/build.mjs
```

No npm install is required. Geometry, textures and music are inlined into standalone HTML. A WebGL2-capable browser is required.

## Explore

A 28-second guided tour can be interrupted at any time. Drag to look; WASD moves; F toggles walk/flight; Q descends and E rises; H hides/restores; P saves an actual rendered PNG. Mobile includes a joystick and altitude controls.

Six authored destinations expose real mesh geometry. The world is finite. Walking uses simplified collision; flight bypasses physical-body collision. Music starts after the entry click and can be muted.

## Source map

`src/engine.js`: renderer. `world.js`: scene. `textures.js`: materials. `audio.js`: music. `app.js`: cameras and bilingual interaction. `style.css`: layout. `index.template.html`: template.

Current checks and captures are in `qa/`. See `../../docs/en/QA.md` for verification limits and `../../docs/en/PROVENANCE.md` for origins. The source authors an artistic space, not a scan or a historical survey.
