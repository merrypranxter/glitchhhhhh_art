# GLITCHHHHHH · v2

An animated, touch-reactive WebGL art instrument inspired by Merry's [GLITCHY vault](https://github.com/merrypranxter/shaderslop_designs/tree/main/GLITCHY). Built with React and Vite. No account, API key, paid service, or remote rendering required. Fonts are bundled locally with their OFL licenses.

## Run

Use Node 20+.

```sh
npm install
npm run dev
npm run build
npm run preview
npm test
```

The production output is `dist/`. Serve it with a static web server. WebGL and hardware acceleration are required. Video additionally needs WebCodecs with VP8 encoding in a secure browser (HTTPS or localhost).

## Make something strange

**12 engines:** Plasma flow, Acid bloom, Fractal melt, Moiré field, Pixel rot, Tunnel vision, Liquid marble, Cellular dream, Orbit lace, Contour planet, Chroma weave, Crystal shards. These implement different analytic/procedural mechanisms, not just palette swaps. The six-entry lookbook renders actual starting-point recipes.

**Layers:** Mix, multiply, or take the absolute difference of two scalar fields. The fields share structure controls, local touch sources, and a geometry clock. Blend at zero bypasses the second engine completely.

**Shape:** Complexity, scale, domain warp, rotation, 1–12-fold kaleidoscope, and mirror. Choose 1:1, 9:16, 16:9, 3:4, or 4:3; the canvas preserves that exact ratio in both preview and export.

**Color:** All eight original palettes plus eight new ones; create, name, and save up to 32 custom palettes. Import 2–8 six-digit hex colors or a Coolors URL. Add/remove stops, reverse or rotate them, and adjust saturation, contrast, brightness, offset, and repetition. Named source colors are retained without substitution.

**Color choreography:** Independent color and geometry clocks. Opt into traveling phase waves, a harmonic 1:2:3 color canon, or a phase vortex with Rhythm amount. Freeze either clock separately. At zero rhythm amount, the original color-phase mapping is preserved. These are analytic color-phase fields; they are not dye transport or spectral simulations. Palette interpolation uses cyclic smoothstep interpolation in display sRGB, with final sRGB clipping.

**Effects:** Chromatic separation, tracking tears, block corruption, pixelation, scanlines, film grain, vignette, phosphor bloom, color posterization, inversion.

**Explore:** Surprise me changes independent mechanisms; engine and palette locks protect your choices. Mutate makes smaller parameter changes. Both preserve touch sources and aspect ratio. Undo reverses either action.

## Touch the math

- Paint local Warp, Vortex, Repel, or Chroma sources. Chroma alters the local color phase without deforming geometry.
- Pinch and twist with two fingers to resize, rotate, and reposition a source. Releasing one finger does not accidentally resume painting.
- Move and Erase tools edit existing sources. Show touch handles to inspect them, then use the source inspector for strength, radius, angle, and deletion. Focused handles can be nudged with arrow keys.
- Each stroke or pinch is one undo transaction. Escape, pointer cancellation, app blur, context loss, and canvas resize cancel the active gesture.
- The 32 most recent sources are retained. Declarative source IDs, normalized positions, radii, angles, modes, and strengths are saved in the recipe. Coordinates use bottom-left UV; radius is in normalized artwork-height units.
- Toolbar controls provide a keyboard/mouse alternative to gestures. On phones, artwork stays above collapsible control panels.

Space plays/pauses; Ctrl/Cmd+Z undoes; Shift+Ctrl/Cmd+Z redoes; F enters fullscreen; H toggles Focus mode; ? opens the guide. Native text controls retain their normal keyboard behavior. Reduced-motion preferences pause playback initially.

## Keep your creations

- **PNG:** A separate full-resolution render at 1080, 2160, or 4096 pixels on the long edge, subject to the device's actual WebGL limit. Preview quality never limits export resolution. Interface chrome and touch handles are excluded.
- **Video:** A fully rendered 2, 4, 6, or 10 second WebM clip at 480, 720, or 1080 pixels on the long edge. Every frame is sampled at an explicit timestamp and encoded at 20 fps using WebCodecs and Mediabunny in quality mode, with encoder backpressure and a final packet-count check. Rendering can take longer than playback, without dropping frames or changing duration. Frozen channels stay frozen. Keep the tab visible; cancel remains available. These clips are **not certified seamless loops**. Browsers without VP8 encoding retain PNG and recipe export.
- **Recipes:** Versioned JSON preserves the seed, title, both clocks, palette stops, all effects, both engines, aspect ratio, and touch sources. Invalid or oversized files are rejected before changing the artwork. Original v1 recipes remain loadable. Imports and saved works open paused at the stored frame.
- **Vault:** Bookmark stores up to 40 named snapshots with thumbnails in this browser. Search by title, engine, or palette; sort works; export individual recipes; undo a deletion. Nothing is automatically evicted to make room.
- **Draft:** Settings and title autosave after editing, with periodic clock checkpoints. Browser storage errors are reported. Local storage is not cloud backup; export recipes for portable, durable copies.

## Rendering and resilience

The engines are analytic rather than stateful simulations. Geometry and color clocks integrate elapsed seconds, independently of preview frame count. Hidden tabs pause both clocks. Opening a dialog holds the preview; video rendering samples an independent exact frame schedule from the chosen frame.

Preview drawing is capped at 30 fps. Eco/Balanced/Sharp use approximate pixel budgets of 0.32/0.8/1.8 megapixels. Auto starts from Balanced and changes only preview scale (100%, 75%, 55%) after sustained load, with a longer recovery dwell. No equation, octave/iteration count, source, seed, or palette changes with quality. The FPS readout measures submitted draw cadence, **not GPU timing**. This governor is conservative; device performance still requires real-device testing.

WebGL resources have no depth, stencil, MSAA, or simulation textures. A single RGBA8 preview color attachment has approximately 1.28 / 3.2 / 7.2 MB payload at those pixel budgets; browser compositor/back buffers and driver overhead are additional and are not measured VRAM. A 4096² RGBA8 export has a 67.1 MB color payload plus encoding/driver overhead. Export rendering and buffers are independent of preview. Video additionally owns reusable RGBA readback/image buffers and a 2D capture canvas; encoder and muxer buffering are additional. Encoded frames are submitted with backpressure rather than retained as an unbounded raw-frame collection.

WebGL2 fences pace submissions so the renderer does not flood a busy GPU; WebGL1 remains a compatibility fallback. Video capture waits for each completed frame, reads its RGBA pixels into a reusable buffer, and encodes it at an explicit timestamp. The renderer caches uniform locations and buffers, bypasses disabled secondary-field/channel work, disposes capture resources, and rebuilds GPU resources after context restoration from the unchanged CPU recipe and clocks. No reseeding occurs during recovery.

## Source provenance

Inspected reference sources:

- [acid-bloom.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/03-datamosh-digital-rot/acid-bloom.js): ring interference and banded tracking tears.
- [acidic-fractal.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/05-psychedelic-glitch-art/acidic-fractal.js): iterative coordinates, neon palettes, procedural noise.
- [acidic-analog-glitch.js](https://github.com/merrypranxter/shaderslop_designs/blob/main/GLITCHY/02-vhs-crt-analog/acidic-analog-glitch.js): analog color and channel separation.
- [Hot Pink Glitter Palettes](https://github.com/merrypranxter/shaderslop_designs/blob/main/myspace_glitch/source-library/myspace_aesthetic/myspace_angelfire_graphics_style/03_palette_and_effects/hot_pink_glitter_palettes.md): Bubblegum Shock, Barbie Reactor, and Kiss Badge Pop, preserved verbatim.

New parameterized shaders use direct WebGL without Three.js. These are artist's mathematical models, not calibrated physical simulations.

## Verification and creative crew

`npm test` exercises recipe migration/validation, exact document round trips, palette parsing, locked randomization, actual pinch/source semantics, move/erase, and export dimensions. Browser verification uses installed Chromium through Playwright because no Browser plugin is exposed. Local browser checks cover all engine and layer modes, touch edits and cancellation, palette import/locking, collection workflows, full-resolution PNGs, context recovery, and responsive controls. FFprobe/FFmpeg verified a two-second 720px WebM with 40 distinct decoded frames and exact 20 fps timing. Physical iPhone Safari, thermal behavior, and on-device video encoding remain unverified.

Creative Plugin Ringmaster continues to coordinate this project. Gesture Witch informed touch transactions; Chromatic Choreographer informed independent analytic color phases; Rendering Survivalist informed preview/export separation and context recovery; Frontend App Builder and Frontend Testing Debugging informed interface and visual/browser QA. These were skill-readable guidance, not remotely executed specialist services. Development uses local previews; hosting is configured separately. Reconsider the crew for seamless encoding, additional simulations, or measured device performance work.
