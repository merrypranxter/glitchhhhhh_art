import React, { useRef } from "react";
import { numericRanges } from "../data";
export function Range({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onStart,
  onChange,
  onEnd,
  onCancel,
  format,
}) {
  const editing = useRef(false);
  const start = () => {
    if (!editing.current) {
      editing.current = true;
      onStart?.();
    }
  };
  const end = () => {
    if (editing.current) {
      editing.current = false;
      onEnd?.();
    }
  };
  return (
    <label className="slider">
      <span>
        {label}
        <output>{format ? format(value) : `${Math.round(value)}%`}</output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--value": `${((value - min) / (max - min)) * 100}%` }}
        onPointerDown={start}
        onChange={(e) => {
          start();
          onChange(+e.target.value);
        }}
        onPointerUp={end}
        onPointerCancel={() => {
          editing.current = false;
          onCancel?.();
        }}
        onLostPointerCapture={end}
        onBlur={end}
        onKeyDown={(e) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
              "PageUp",
              "PageDown",
            ].includes(e.key)
          )
            start();
        }}
        onKeyUp={end}
      />
    </label>
  );
}
export function Parameter({ label, name, history, format }) {
  const [min, max] = numericRanges[name];
  return (
    <Range
      label={label}
      value={history.state[name]}
      min={min}
      max={max}
      format={format}
      onStart={history.begin}
      onChange={(v) => history.preview((s) => ({ ...s, [name]: v }))}
      onEnd={history.end}
      onCancel={history.cancel}
    />
  );
}
export function Switch({ label, name, history, note }) {
  return (
    <button
      className="toggle-row"
      role="switch"
      aria-checked={history.state[name]}
      onClick={() => history.change((s) => ({ ...s, [name]: !s[name] }))}
    >
      <span>
        {label}
        {note && <small>{note}</small>}
      </span>
      <span className={"switch " + (history.state[name] ? "on" : "")} />
    </button>
  );
}
export function Select({ label, value, onChange, children }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}
export function Section({ title, aside, children }) {
  return (
    <section className="control-section">
      <div className="section-heading">
        <span>{title}</span>
        {aside}
      </div>
      {children}
    </section>
  );
}
