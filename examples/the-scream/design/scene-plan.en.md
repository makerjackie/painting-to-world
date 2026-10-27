# Spatial plan and reconstruction record

## Provenance
This edition was reauthored from the earlier screenshot direction using the café renderer. Original source was not recovered. The museum identity is Edvard Munch, The Scream, 1893, NG.M.00939. Museum reproduction pixels are not distributed.

## Recognition anchors
A flowing orange-red sky; a steep receding railing; a pale central head with hands near ears; sinuous dark clothing; two distant companions; a cool fjord and layered mountains. The opening is an authored landscape composition, not a pixel-for-pixel match to the original portrait canvas. Screenshot anchors below refer to THIS implementation, not measured painting coordinates.

At a 3:2 viewport: sky occupies the upper half; figure near x=0.63 and lower middle; vanishing path near x=0.55, y=0.53; railing runs from the lower-right into that depth. Exact fractions vary with viewport.

## Palette and surface rhythm
Sky: ochre, rust, amber. Water: muted teal-blue. Hills: dark olive. Skin: chalk yellow. Timber: irregular warm ochres. Cloak: green-black and slender curved pigment lines. Sky strokes are long and wavy; wood grain follows boards; hillside ribbons follow the actual mesh. The café's localized terrace illumination is removed.

## Coordinates and geometry
Y is up. Path x=-3.8..3.8, z=-75..26, deck near y=0 with visible thickness. Railing is at x=3.72. Fjord is near y=-7.25. Main figure is centered at x=1.13,z=1.1; two companions recede around z=-38 and -40. Visible head, coat, hands, rails, boards, boats and ridge sides are true meshes.

Walking: bounded to the deck, avoids a 0.90 radius around the figure. Flight: broader finite bounds; no body collision. This is a simplified observation model, not a first-person physics simulation.

## Camera sequence
32 seconds, Catmull interpolation of authored eye AND target points: threshold → figure side → railing → companions → fjord → elevated reverse-looking view. Any movement or drag interrupts. Six destination poses are in app.js.

## Invented content
Deck underside, support braces, land volumes, boats, shoreline lights, figure backs and the score are authored. No hidden geometry is claimed as fact. The supplied café demonstrates richer architectural detail; this different subject intentionally uses open terrain and a sculptural figure.

## QA repairs in this edition
Removed café signage and warm-light coordinates from the adapted scene. Removed excessive vertical face strokes that resembled hair. Added Chinese/English entry points and a mobile restore control. Current evidence is in ../qa/; earlier captures remain outside this example under the package archive.
