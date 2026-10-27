# Quality gates

G0 — Input: reference actually viewed; correct artist/work/version; no invented source; uncertainty recorded.
G1 — First view: landmarks recognizable without relying on the title; correct dominant color relationships; composition evaluated at source ratio and target screens. A score is an internal judgment, not an advertised accuracy percentage.
G2 — Real space: strafe camera and move forward; observe occlusion change; see backs/sides; main objects are meshes; no fixed screen-space trees/flowers disguising missing geometry.
G3 — Close-up: at least two destinations contain inspectable detail; no giant stretched texels, gaps, accidental clipping or runaway emissive blobs.
G4 — Control: tour starts/completes and is interruptible; free mode stays free; movement keys/touch are cleaned up; flight height is not reset every frame; bounds/collision match help text; every location is reachable.
G5 — UI: full Chinese/English copy; 360px touch layout and wide view; no horizontal page overflow; restore button reachable; dialogs keyboard accessible; reduced motion honored.
G6 — Sound/export: no autoplay; toggling does not double schedule; smooth mute; PNG actually contains the rendered scene and no UI. Audio scheduling and listening are different checks.
G7 — Technical: build succeeds from a relocated path, no external runtime requests, JS/GL errors recorded, graceful missing-WebGL message, deterministic source output, no local absolute dependencies.
G8 — Delivery: HTML+source+localized docs+sources+QA+screenshots in ZIP. Distinguish archived screenshots and new captures. Concept posters are explicitly marked; no fake live URL, unsupported price/guarantee or false QA claim.

If no browser is available, G1–G6 remain unverified. Run available static checks, deliver the complete code, and say so. Never replace evidence with an assertion that the prototype was tested.
