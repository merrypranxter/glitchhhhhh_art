import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Image,
  Film,
  Braces,
  Check,
  Square,
  LoaderCircle,
} from "lucide-react";
import Modal from "./Modal";
import { Select } from "./Controls";
import { ratios, recipeDocument } from "../data";
import {
  dimensions,
  renderImage,
  download,
  recordClip,
  videoFormat,
} from "../export";
export default function ExportDialog({
  state,
  title,
  timelineRef,
  onClose,
  onNotice,
}) {
  const [tab, setTab] = useState("Image"),
    [longEdge, setLongEdge] = useState(2160),
    [videoSize, setVideoSize] = useState(720),
    [duration, setDuration] = useState(6),
    [ratio, setRatio] = useState(state.ratio),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  const controller = useRef(null),
    mounted = useRef(true),
    [format] = useState(videoFormat);
  useEffect(
    () => () => {
      mounted.current = false;
      controller.current?.abort();
    },
    [],
  );
  const size = dimensions(ratio, tab === "Video" ? videoSize : longEdge);
  async function run() {
    setError("");
    setProgress(0);
    setBusy(true);
    if (tab === "Video") controller.current = new AbortController();
    const snapshot = { ...state, ratio },
      timeline = { ...timelineRef.current };
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      if (tab === "Image") {
        const blob = await renderImage(snapshot, timeline, longEdge);
        download(blob, `glitch-${state.seed}-${size.width}x${size.height}.png`);
        onNotice("High-resolution image exported.");
      } else if (tab === "Video") {
        const result = await recordClip(snapshot, timeline, {
          longEdge: videoSize,
          duration,
          onProgress: (p) => {
            if (mounted.current) setProgress(p);
          },
          signal: controller.current.signal,
        });
        download(result.blob, `glitch-${state.seed}.${result.extension}`);
        onNotice(`Your ${result.seconds.toFixed(1)}s clip is ready.`);
      } else {
        download(
          new Blob(
            [JSON.stringify(recipeDocument(state, title, timeline), null, 2)],
            { type: "application/json" },
          ),
          `glitch-${state.seed}.json`,
        );
        onNotice("Recipe exported. Keep this one.");
      }
    } catch (e) {
      if (mounted.current)
        setError(
          e.name === "AbortError"
            ? "Rendering cancelled. Your artwork is unchanged."
            : e.message,
        );
    } finally {
      if (mounted.current) setBusy(false);
      controller.current = null;
    }
  }
  return (
    <Modal
      title="Take the chaos with you."
      subtitle="The artwork stays yours, in every format."
      onClose={onClose}
      busy={busy}
    >
      <div className="export-tabs">
        {[
          [Image, "Image"],
          [Film, "Video"],
          [Braces, "Recipe"],
        ].map(([Icon, name]) => (
          <button
            disabled={busy}
            className={tab === name ? "selected" : ""}
            onClick={() => {
              setTab(name);
              setError("");
            }}
            key={name}
          >
            <Icon size={17} />
            {name}
          </button>
        ))}
      </div>
      <fieldset disabled={busy} className="export-options">
        {tab !== "Recipe" ? (
          <>
            <div className="export-format">
              <span>
                {tab === "Image"
                  ? "PNG / LOSSLESS"
                  : format
                    ? `${format.extension.toUpperCase()} / 20 FPS / EVERY FRAME`
                    : "VIDEO / NOT SUPPORTED"}
              </span>
              <strong>
                {size.width} <span>×</span> {size.height}
              </strong>
            </div>
            <div className="export-fields">
              <Select label="Aspect ratio" value={ratio} onChange={setRatio}>
                {ratios.map((r) => (
                  <option key={r.id}>{r.id}</option>
                ))}
              </Select>
              <Select
                label="Longest edge"
                value={tab === "Image" ? longEdge : videoSize}
                onChange={(v) =>
                  tab === "Image" ? setLongEdge(+v) : setVideoSize(+v)
                }
              >
                {(tab === "Image" ? [1080, 2160, 4096] : [480, 720, 1080]).map(
                  (x) => (
                    <option value={x} key={x}>
                      {x.toLocaleString()} px
                    </option>
                  ),
                )}
              </Select>
            </div>
            {tab === "Video" ? (
              <>
                <Select
                  label="Clip duration"
                  value={duration}
                  onChange={(v) => setDuration(+v)}
                >
                  {[2, 4, 6, 10].map((x) => (
                    <option value={x} key={x}>
                      {x} seconds
                    </option>
                  ))}
                </Select>
                <p className="export-note">
                  Renders every frame at 20 fps from this moment. Larger videos
                  take longer to process. Frozen channels stay frozen. Keep this
                  tab visible. Clips are not certified seamless loops.
                </p>
                {!format && (
                  <p className="field-error">
                    This browser needs WebCodecs and HTTPS for video export. Try
                    current Chrome or Edge. Images and recipes are still
                    available.
                  </p>
                )}
              </>
            ) : (
              <p className="export-note">
                <Check size={13} />
                Full-resolution render, independent of preview quality. Touch
                handles and interface elements are excluded.
              </p>
            )}
          </>
        ) : (
          <div className="recipe-explainer">
            <Braces size={34} />
            <h3>A tiny file. Your whole universe.</h3>
            <p>
              Your seed, palettes, math layers, effects, touch sources, title,
              aspect ratio, and both animation clocks. Load it later to return
              to this exact frame.
            </p>
            <span>BACKWARD COMPATIBLE WITH YOUR ORIGINAL RECIPES</span>
          </div>
        )}
      </fieldset>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {busy && tab === "Video" && (
        <div className="record-progress">
          <div>
            <span style={{ width: `${progress * 100}%` }} />
          </div>
          <p>
            <i />
            {Math.round(progress * duration * 20)} / {duration * 20} frames{" "}
            <button onClick={() => controller.current?.abort()}>
              <Square size={10} />
              Cancel render
            </button>
          </p>
        </div>
      )}
      <button
        className="button primary export-submit"
        disabled={busy || (tab === "Video" && !format)}
        onClick={run}
      >
        {busy ? (
          <LoaderCircle className="spin" size={17} />
        ) : (
          <Download size={17} />
        )}{" "}
        {busy
          ? tab === "Video"
            ? "Rendering your creation…"
            : "Rendering…"
          : tab === "Image"
            ? "Export image"
            : tab === "Video"
              ? "Render & download clip"
              : "Export recipe"}
      </button>
    </Modal>
  );
}
