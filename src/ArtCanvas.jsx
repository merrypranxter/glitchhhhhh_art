import React, { useRef, useEffect, useState } from "react";
import { createRenderer, previewDimensions } from "./renderer";
import { TouchSession } from "./gestures";
import { ratios, touchModes } from "./data";

export default function ArtCanvas({
  history,
  playing,
  timelineRef,
  canvasRef,
  quality,
  onStatus,
  onTime,
  tool,
  showHandles,
  selected,
  onSelect,
}) {
  const stageRef = useRef(null),
    session = useRef(null),
    runtime = useRef({ playing, quality, tool }),
    [size, setSize] = useState({ width: 1, height: 1 });
  const [error, setError] = useState(""),
    [recovering, setRecovering] = useState(false),
    [retry, setRetry] = useState(0);
  runtime.current = { playing, quality, tool };
  const actions = useRef(history);
  actions.current = history;
  const ratio = ratios.find((r) => r.id === history.state.ratio)?.value || 1;
  const cancel = () => {
    if (session.current) {
      session.current = null;
      actions.current.cancel();
    }
  };
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      cancel();
      const b = entry.contentRect,
        w = Math.max(1, Math.min(b.width, b.height * ratio));
      setSize({ width: w, height: w / ratio });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ratio]);
  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer,
      frame,
      last = performance.now(),
      lastDraw = 0,
      lastReport = 0,
      hidden = document.hidden,
      lost = false,
      lastState = null,
      lastW = 0,
      lastH = 0,
      lastTime = -1,
      lastColorTime = -1;
    let intervals = [],
      previewScale = 1,
      lastAdjust = 0;
    function setup() {
      try {
        renderer = createRenderer(canvas);
        setError("");
        setRecovering(false);
        lost = false;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } catch (e) {
        setError(e.message);
        onStatus({ error: true });
      }
    }
    function tick(now) {
      if (lost) return;
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      const state = actions.current.current.current,
        rt = runtime.current;
      if (!hidden && rt.playing) {
        if (!state.freezeGeometry)
          timelineRef.current.time += (dt * state.speed) / 30;
        if (!state.freezeColor)
          timelineRef.current.colorTime += (dt * state.colorSpeed) / 30;
      }
      const animated =
        rt.playing &&
        ((!state.freezeGeometry && state.speed > 0) ||
          (!state.freezeColor && state.colorSpeed > 0));
      const cssW = canvas.clientWidth,
        cssH = canvas.clientHeight;
      const dims = previewDimensions(cssW, cssH, rt.quality, previewScale);
      const seeked =
        !animated &&
        (lastTime !== timelineRef.current.time ||
          lastColorTime !== timelineRef.current.colorTime);
      if (
        !hidden &&
        renderer.ready() &&
        ((animated && now - lastDraw >= 1000 / 30 - 1) ||
          lastState !== state ||
          lastW !== dims.width ||
          lastH !== dims.height ||
          seeked)
      ) {
        const drawInterval = now - lastDraw;
        try {
          renderer.draw(state, timelineRef.current, dims.width, dims.height);
          lastState = state;
          lastW = dims.width;
          lastH = dims.height;
          lastDraw = now;
          lastTime = timelineRef.current.time;
          lastColorTime = timelineRef.current.colorTime;
        } catch (e) {
          setError(e.message);
          return;
        }
        if (
          animated &&
          lastDraw > 0 &&
          drawInterval > 0 &&
          drawInterval < 10000
        ) {
          intervals.push(drawInterval);
          if (intervals.length > 90) intervals.shift();
        }
      }
      if (now - lastReport > 1000) {
        const sorted = intervals.slice(-90).sort((a, b) => a - b),
          median = sorted[Math.floor(sorted.length / 2)] || 16.67;
        onStatus({
          width: dims.width,
          height: dims.height,
          fps:
            animated && sorted.length ? Math.round(10000 / median) / 10 : null,
          quality: rt.quality,
          scale: previewScale,
        });
        onTime({ ...timelineRef.current });
        lastReport = now;
        if (
          rt.quality === "Auto" &&
          animated &&
          sorted.length >= 8 &&
          now - lastAdjust > 5000
        ) {
          if (median > 45 && previewScale > 0.55) {
            previewScale = previewScale === 1 ? 0.75 : 0.55;
            lastAdjust = now;
          } else if (
            median < 36 &&
            previewScale < 1 &&
            now - lastAdjust > 15000
          ) {
            previewScale = previewScale === 0.55 ? 0.75 : 1;
            lastAdjust = now;
          }
          intervals = [];
        }
      }
      frame = requestAnimationFrame(tick);
    }
    function visibility() {
      hidden = document.hidden;
      last = performance.now();
      intervals = [];
      if (hidden) cancel();
    }
    function loss(e) {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      cancel();
      setRecovering(true);
    }
    function restore() {
      renderer?.destroy();
      setup();
    }
    function interrupt(e) {
      if (e.type === "blur" || e.key === "Escape") cancel();
    }
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", loss);
    canvas.addEventListener("webglcontextrestored", restore);
    window.addEventListener("blur", interrupt);
    window.addEventListener("keydown", interrupt);
    setup();
    return () => {
      cancelAnimationFrame(frame);
      cancel();
      renderer?.destroy(true);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", loss);
      canvas.removeEventListener("webglcontextrestored", restore);
      window.removeEventListener("blur", interrupt);
      window.removeEventListener("keydown", interrupt);
    };
  }, [retry]);
  function point(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      id: e.pointerId,
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: 1 - Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  }
  function preview() {
    const s = session.current;
    if (!s) return;
    history.preview(s.draft);
    if (s.target >= 0) onSelect(s.draft.marks[s.target]?.id || null);
  }
  function down(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    const p = point(e),
      surface = e.currentTarget;
    surface.setPointerCapture(e.pointerId);
    if (session.current) {
      session.current.add(p);
    } else {
      history.begin();
      let activeTool = runtime.current.tool;
      const handle = e.target.closest("[data-force]");
      if (handle && activeTool !== "Erase") {
        const mark = history.current.current.marks.find(
          (m) => m.id === handle.dataset.force,
        );
        if (mark) {
          p.x = mark.x;
          p.y = mark.y;
          activeTool = "Move";
        }
      }
      session.current = new TouchSession(
        history.current.current,
        activeTool,
        p,
        ratio,
      );
    }
    preview();
  }
  function move(e) {
    if (session.current) {
      session.current.move(point(e));
      preview();
    }
  }
  function up(e) {
    if (!session.current) return;
    if (session.current.release(e.pointerId)) {
      session.current = null;
      history.end();
    }
  }
  const handles = showHandles || tool !== "Paint";
  return (
    <div className="art-stage" ref={stageRef}>
      <div
        className="art-surface"
        style={{ width: size.width, height: size.height }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={cancel}
        onLostPointerCapture={(e) => {
          if (session.current?.pointers.has(e.pointerId)) cancel();
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Animated artwork. Drag to paint; pinch and twist to resize and rotate a force."
        />
        {handles &&
          history.state.marks.map((m, i) => (
            <button
              key={m.id}
              data-force={m.id}
              className={"force-handle " + (selected === m.id ? "active" : "")}
              style={{ left: `${m.x * 100}%`, top: `${(1 - m.y) * 100}%` }}
              aria-label={`${touchModes[m.mode]} force ${i + 1}`}
              onFocus={() => onSelect(m.id)}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  history.change((s) => ({
                    ...s,
                    marks: s.marks.map((x) =>
                      x.id === m.id
                        ? {
                            ...x,
                            x: Math.max(
                              0,
                              Math.min(
                                1,
                                x.x +
                                  (e.key === "ArrowLeft"
                                    ? -0.01
                                    : e.key === "ArrowRight"
                                      ? 0.01
                                      : 0),
                              ),
                            ),
                            y: Math.max(
                              0,
                              Math.min(
                                1,
                                x.y +
                                  (e.key === "ArrowDown"
                                    ? -0.01
                                    : e.key === "ArrowUp"
                                      ? 0.01
                                      : 0),
                              ),
                            ),
                          }
                        : x,
                    ),
                  }));
                }
              }}
            >
              <span>{i + 1}</span>
            </button>
          ))}
        <div className="canvas-tag">
          <i />
          {playing ? "LIVE GENERATIVE ART" : "A MOMENT, HELD STILL"}
        </div>
        {(error || recovering) && (
          <div className="render-error" role="alert">
            <strong>
              {recovering
                ? "Restoring your artwork…"
                : "The renderer needs a hand."}
            </strong>
            <p>
              {error || "Rebuilding graphics while preserving your recipe."}
            </p>
            {error && (
              <button className="button" onClick={() => setRetry((x) => x + 1)}>
                Retry renderer
              </button>
            )}
          </div>
        )}
      </div>
      <button
        className="fullscreen-exit"
        onClick={() => document.exitFullscreen?.()}
      >
        Exit fullscreen
      </button>
    </div>
  );
}
