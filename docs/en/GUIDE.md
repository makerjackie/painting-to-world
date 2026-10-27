# Usage guide

## Explore before authoring

Extract the whole archive and open `START-HERE.html`. Both examples have Chinese and English entry points, with an in-world language switch. `examples/cafe-terrace/archive/index.html` is the untouched successful original; the current entry points add localization details.

Desktop controls: drag to look, WASD/arrows to move, F for walk/flight, Q down and E up in flight, H to hide/restore, and P to export an actual framed PNG. The destination bar provides quick travel. Mobile includes a movement joystick, drag-to-look and altitude buttons.

The café starts gentle music after the entry click; it can be muted immediately. The Scream starts with music off and requires a separate click. Both offer an automatic-camera off option. Collision is limited to walking; flight is not a physical-body simulation.

## Requirements

Authoring requires an image-capable coding AI that can read the complete Skill, read/write local files and implement code. Supplied build scripts require Node.js 18+. Visual review needs a working WebGL2 browser. Python and Playwright are optional testing tools, not website dependencies. Without a browser, code can still be produced, but visual verification must not be claimed.

The package does not include an AI account, credits, third-party model weights, an online image-upload application or hosting. Opening an example plays a finished artifact; a new painting still requires the AI to execute the Skill.

## Install one language only

Chinese: `skills/zh-CN/painting-to-world/`. English: `skills/en/painting-to-world/`. Each contains the same capabilities and self-contained code assets. **Do not install both same-name versions in the same scope.**

In a local Agent Skills environment such as Codex, copy the whole folder to `.agents/skills/painting-to-world/` inside your project. A user-wide location is `~/.agents/skills/painting-to-world/`. Discovery and reload behavior depend on the client version; see the official source below.

macOS/Linux example, from the extracted package root; replace the project path:

```bash
DEST="/path/to/your-project/.agents/skills/painting-to-world"
if [ -e "$DEST" ]; then
  echo "Destination exists. Inspect and back it up rather than overwriting."
else
  mkdir -p "$(dirname "$DEST")"
  cp -R skills/en/painting-to-world "$DEST"
fi
```

On Windows, copying the full folder with a file manager is also sufficient for the file placement step. Nothing has been installed on your machine automatically.

In an environment that can read attachments and execute code but does not discover local Skills, supply the complete folder or kit as working material and explicitly ask the AI to read `SKILL.md` and its references. Uploading a ZIP does not guarantee automatic installation or execution in every chat client. A text-only client without file writing/code execution cannot run the build scripts merely by reading them.

## Supply the reference and start

Use a clear, uncropped JPG/PNG/WEBP with its original aspect ratio. Identify the artist, title, year or collection when multiple versions exist. A collage, advertisement screenshot or heavily obscured image is a weak precise-composition reference. Do not send private imagery to external services without appropriate authorization.

Select or explicitly invoke `painting-to-world` using your client's supported interface. A complete request:

```text
Use the painting-to-world Skill to turn my uploaded painting into a walkable 3D website.
Use this exact upload rather than silently substituting another version.
Record composition, recognition anchors, palette and brushwork before choosing a spatial interpretation.
Use the café's engineering quality as the baseline, but reauthor the subject and scene—not just its colors.
Begin with a guided tour, then allow free exploration. Include Chinese and English, desktop and mobile,
a sound toggle and actual image export. Inspect browser screenshots and repair problems.
Do not substitute a concept image for a running scene.
Deliver offline HTML, editable source, usage notes, provenance and QA together in one ZIP.
Make normal creative decisions autonomously; identify missing input or unclear asset rights explicitly.
```

## Optional: copy the working baseline

From the package root:

```bash
node skills/en/painting-to-world/scripts/init.mjs ./my-painting --reference ./my-reference.png
node my-painting/scripts/build.mjs
```

The initializer refuses to overwrite a nonempty directory and copies the baseline, reference image and analysis template. **It is still the café at this point.** The script does not analyze an image or generate new geometry. The AI must then reauthor `world.js`, `textures.js`, camera choreography and copy. Do not present scaffolding success as a completed new painting.

## Improve resemblance deliberately

Instead of “make it more detailed,” identify three to seven concrete differences: subject location and area, the railing's vanishing direction, foreground occlusion, warm/cool balance or sky stroke direction. Correct composition and primary silhouettes before adding details. Request same-camera before/after captures, plus reverse and side views that verify three-dimensional volume.

Landscapes, streets and interiors often suit continuous walking spaces. Portraits, still lifes and Cubist multi-view images may work better as sculptural dioramas or spatial installations. A depth relief is valid when labeled with its view limits; it is not a full 360-degree world. One image cannot determine every hidden surface.

## Deliver and publish

A finished output should contain `index.html`, `index.en.html`, full `src/`, `scripts/build.mjs`, bilingual notes, provenance, QA and actual screenshots. Rebuild and run static checks, then open and inspect the result.

```bash
node scripts/build-all.mjs
node scripts/check-package.mjs
```

You may publish the files through your chosen static host using its account, permissions and configuration. This package does not create a live URL. Use reference images and assets you are entitled to use. Decide product licensing, support, updates and refund terms separately before selling.

## FAQ

**Why is my new project still a café?** Only the scaffold was copied. The AI has not reauthored the scene yet.

**Why did I get a screenshot or panorama?** Return to the Skill's geometry gate: translating the camera must reveal parallax and new object sides. Main subjects cannot simply be camera-facing pictures.

**Why does a poster look better than the app?** Historical AI concept images are not runtime evidence. Use the current actual-capture posters under `marketing/en/`, retaining their scope notes.

**Does every image work perfectly in one pass?** That is not guaranteed. The Skill improves consistency, while quality still depends on the reference, AI, tools, spatial approach and iteration.

**Do I need to install both languages?** No. Install one Skill locale; generated examples themselves should support both interface languages.

## Sources checked 2026-09-21

- Agent Skills format: https://agentskills.io/specification
- Codex local discovery: https://learn.chatgpt.com/docs/build-skills — Where Codex loads local skills
