import { createRenderer } from "./renderer.js";
import { ratios } from "./data.js";
export function dimensions(ratio, longEdge) {
  const r = ratios.find((x) => x.id === ratio)?.value || 1;
  return r >= 1
    ? { width: longEdge, height: Math.round(longEdge / r) }
    : { width: Math.round(longEdge * r), height: longEdge };
}
export function download(blob, name) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function renderImage(
  state,
  timeline,
  longEdge = 2160,
  type = "image/png",
) {
  const canvas = document.createElement("canvas");
  let renderer;
  try {
    renderer = createRenderer(canvas);
    const { width, height } = dimensions(state.ratio, longEdge);
    renderer.draw(state, timeline, width, height);
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b ? resolve(b) : reject(Error("The image could not be encoded.")),
        type,
        0.8,
      ),
    );
    return blob;
  } finally {
    renderer?.destroy(true);
    canvas.width = 1;
    canvas.height = 1;
  }
}
export async function thumbnail(state, timeline) {
  const blob = await renderImage(state, timeline, 240, "image/jpeg");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("Thumbnail unavailable"));
    reader.readAsDataURL(blob);
  });
}
export function videoFormat() {
  return typeof VideoEncoder !== "undefined" &&
    typeof VideoFrame !== "undefined"
    ? { mime: "video/webm", extension: "webm" }
    : null;
}
/** Render every analytic frame at an explicit timestamp; encode with backpressure. */
export async function recordClip(
  state,
  timeline,
  { longEdge = 720, duration = 6, onProgress = () => {}, signal } = {},
) {
  if (!videoFormat())
    throw Error(
      "Video export needs WebCodecs in a secure browser. PNG and recipes still work.",
    );
  const {
    Output,
    WebMOutputFormat,
    BufferTarget,
    CanvasSource,
    Quality,
    canEncodeVideo,
  } = await import("mediabunny");
  const fps = 20,
    frames = Math.round(duration * fps),
    size = dimensions(state.ratio, longEdge),
    quality = new Quality({ bitrate: 8000000 });
  if (
    !(await canEncodeVideo("vp8", {
      width: size.width,
      height: size.height,
      quality,
      frameRate: fps,
      latencyMode: "quality",
    }))
  )
    throw Error(
      "VP8 video encoding is unavailable in this browser. Try current Chrome or Edge; PNG and recipes still work.",
    );
  let renderer,
    output,
    source,
    hidden = false,
    encoded = 0;
  const canvas = document.createElement("canvas"),
    capture = document.createElement("canvas");
  const check = () => {
    if (signal?.aborted)
      throw new DOMException("Rendering cancelled", "AbortError");
    if (hidden)
      throw Error(
        "Video rendering stopped because the tab was hidden. Keep this tab visible and try again.",
      );
  };
  const interrupt = () => {
    hidden = document.hidden;
    if (hidden) output?.cancel().catch(() => {});
  };
  const abort = () => output?.cancel().catch(() => {});
  signal?.addEventListener("abort", abort, { once: true });
  document.addEventListener("visibilitychange", interrupt);
  try {
    check();
    capture.width = size.width;
    capture.height = size.height;
    const ctx = capture.getContext("2d", { alpha: false });
    if (!ctx) throw Error("Canvas video export is unavailable.");
    const image = ctx.createImageData(size.width, size.height),
      pixels = new Uint8Array(size.width * size.height * 4),
      stride = size.width * 4;
    renderer = createRenderer(canvas);
    const target = new BufferTarget();
    output = new Output({ format: new WebMOutputFormat(), target });
    source = new CanvasSource(capture, {
      codec: "vp8",
      quality,
      latencyMode: "quality",
      contentHint: "detail",
      onEncodedPacket: () => encoded++,
    });
    output.addVideoTrack(source, { frameRate: fps });
    await output.start();
    for (let k = 0; k < frames; k++) {
      check();
      const seconds = k / fps;
      renderer.draw(
        state,
        {
          time:
            timeline.time +
            (state.freezeGeometry ? 0 : (seconds * state.speed) / 30),
          colorTime:
            timeline.colorTime +
            (state.freezeColor ? 0 : (seconds * state.colorSpeed) / 30),
        },
        size.width,
        size.height,
      );
      const deadline = performance.now() + 30000;
      while (!renderer.ready()) {
        check();
        if (performance.now() > deadline)
          throw Error(
            "A video frame took too long. Try 480px or simplify the field blend.",
          );
        await new Promise((resolve) => setTimeout(resolve, 8));
      }
      renderer.readFrame(pixels);
      for (let y = 0; y < size.height; y++)
        image.data.set(
          pixels.subarray(
            (size.height - 1 - y) * stride,
            (size.height - y) * stride,
          ),
          y * stride,
        );
      ctx.putImageData(image, 0, 0);
      await source.add(seconds, 1 / fps);
      onProgress((k + 1) / frames);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    check();
    source.close();
    await output.finalize();
    check();
    if (encoded !== frames)
      throw Error(
        "The encoder did not return every frame. Try a smaller export size.",
      );
    return {
      blob: new Blob([target.buffer], { type: "video/webm" }),
      extension: "webm",
      seconds: duration,
      frames,
    };
  } catch (e) {
    if (signal?.aborted)
      throw new DOMException("Rendering cancelled", "AbortError");
    throw e;
  } finally {
    if (output && output.state !== "finalized" && output.state !== "canceled")
      await output.cancel().catch(() => {});
    renderer?.destroy(true);
    canvas.width = 1;
    canvas.height = 1;
    capture.width = 1;
    capture.height = 1;
    signal?.removeEventListener("abort", abort);
    document.removeEventListener("visibilitychange", interrupt);
  }
}
