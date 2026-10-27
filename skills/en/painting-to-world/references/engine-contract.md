# Bundled engine contract

Files load in this order: `engine.js`, `textures.js`, `world.js`, `audio.js`, `app.js`, in one inline script. `style.css` fills the STYLE slot of `index.template.html`. No ES module imports or runtime network requests are required.

`V` supplies `add`, `sub`, `mul`, `dot`, `cross`, `norm`, `mix`. `M` supplies `identity`, `perspective`, `look`, `mul`. `RNG(seed)` returns a reproducible generator; `rgb`, `tint`, `clamp`, `ease` are globals.

`World` exposes `solid`, `alpha`, `sky`, `labels` batches. Use `box(position,size,color,rotationY=0,emission=0)`, `cylinder(a,b,radiusA,radiusB,color,sides=9,emission=0)`, `sphere(position,scale,color,segments=10,rings=6,emission=0,animation=0)`, `tube(points,radius,color,sides=6,emission=0)`, `ellipse(position,radiusX,radiusZ,color,alpha=1,emission=0)`, `collider(xMin,xMax,zMin,zMax)`. `world.active` selects the destination for ordinary primitives. `world.tables` is café-specific collision data, not a universal contract.

`Batch.tri(a,b,c,color,uv?,emission=0,animation=0,alpha=1,normals?)`; `Batch.quad(a,b,c,d,color,emission=0,animation=0,alpha=1,uv?)`. Arguments are positional; UV is in different positions for tri and quad. Vertices carry 14 floats (position3, normal3, UV2, color3, extra3). `upload` drops CPU vertex arrays, so count triangles before renderer initialization. No CULL_FACE is enabled; both sides draw. Alpha is not a sophisticated transparent-object sorting system; avoid overlapping large transparent meshes.

`Renderer(canvas)` throws `WEBGL2_UNAVAILABLE` on failure. `init(world,paintCanvas,skyCanvas,labelCanvas)` uploads batches and textures. `render(eye,target,time,fade=0)` performs depth-tested opaque rendering, sky, labels, alpha and a postprocess pass. `scale` and `paint` control resolution and grain; `resize()` updates targets. `gl.getError()` is the low-level diagnostic.

**Change the shader per work.** The baseline fragment shader has an explicitly café-specific `terrace` warm-light term and blue fog. Munch needs another atmospheric palette. The world sky is a large UV sphere, not an uploaded panorama of the whole scene.

Stable inspection facade recommended: `window.paintingWorld` with `ready`, `getState()`, `jump(id)`, `setPose(eye,target)`, `setLanguage(lang)`, `setTourTime(seconds)`, `capture()`, `glError()`. The baseline exports `window.cafeWorld`; a new scene may export the common facade too. A facade exists for tests, not as an end-user feature.
