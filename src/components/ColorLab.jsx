import React, { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  ArrowLeftRight,
  RotateCw,
  Save,
  Palette,
  Trash2,
} from "lucide-react";
import { palettes, parsePalette, paletteName } from "../data";
import { Parameter, Section, Select, Switch } from "./Controls";
export function Swatches({ colors }) {
  return (
    <span className="swatches">
      {colors.map((color, i) => (
        <i key={i} style={{ background: color }} />
      ))}
    </span>
  );
}
export default function ColorLab({
  history,
  customPalettes,
  onSavePalette,
  onDeletePalette,
}) {
  const state = history.state,
    [selected, setSelected] = useState(0),
    [text, setText] = useState(""),
    [error, setError] = useState(""),
    [name, setName] = useState(""),
    [filter, setFilter] = useState("");
  const pick = (colors) =>
    history.change((s) => ({ ...s, palette: -1, colors }));
  const index = Math.min(selected, state.colors.length - 1);
  function importColors(e) {
    e.preventDefault();
    try {
      pick(parsePalette(text));
      setText("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <Section
        title="PALETTE VAULT"
        aside={<span>{palettes.length + customPalettes.length} PALETTES</span>}
      >
        <input
          type="search"
          className="search-input"
          aria-label="Find a palette"
          placeholder="Find your kind of loud…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="palette-list">
          {[...palettes, ...customPalettes]
            .map((p, i) => ({ ...p, index: i }))
            .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
            .map((p) => {
              const chosen =
                state.colors.join("").toLowerCase() ===
                p.colors.join("").toLowerCase();
              return (
                <div className="palette-item" key={`${p.name}-${p.index}`}>
                  <button
                    className={"palette-row " + (chosen ? "chosen" : "")}
                    aria-pressed={chosen}
                    onClick={() =>
                      history.change((s) => ({
                        ...s,
                        palette: p.index < palettes.length ? p.index : -1,
                        colors: p.colors,
                      }))
                    }
                  >
                    <Swatches colors={p.colors} />
                    <span>{p.name}</span>
                    {chosen ? <Check size={13} /> : <span className="radio" />}
                  </button>
                  {p.index >= palettes.length && (
                    <button
                      className="delete-palette"
                      title={`Delete palette ${p.name}`}
                      onClick={() => onDeletePalette(p.index - palettes.length)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </Section>
      <Section
        title="MAKE IT YOURS"
        aside={<span>{paletteName(state).toUpperCase()}</span>}
      >
        <div className="color-stops">
          {state.colors.map((c, i) => (
            <button
              key={i}
              className={index === i ? "active" : ""}
              aria-label={`Select color ${i + 1}`}
              aria-pressed={index === i}
              onClick={() => setSelected(i)}
              style={{ "--color": c }}
            >
              <i />
              {i + 1}
            </button>
          ))}
          <button
            className="add-stop"
            title="Add color stop"
            disabled={state.colors.length >= 8}
            onClick={() => {
              pick([...state.colors, "#d6ff62"]);
              setSelected(state.colors.length);
            }}
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="color-edit">
          <input
            type="color"
            aria-label={`Edit color ${index + 1}`}
            value={state.colors[index]}
            onFocus={history.begin}
            onChange={(e) =>
              history.preview((s) => ({
                ...s,
                palette: -1,
                colors: s.colors.map((c, i) =>
                  i === index ? e.target.value : c,
                ),
              }))
            }
            onBlur={history.end}
          />
          <span>{state.colors[index].toUpperCase()}</span>
          <button
            title="Remove selected color"
            disabled={state.colors.length <= 2}
            onClick={() => pick(state.colors.filter((_, i) => i !== index))}
          >
            <Minus size={15} />
          </button>
          <button
            title="Reverse palette"
            onClick={() => pick([...state.colors].reverse())}
          >
            <ArrowLeftRight size={15} />
          </button>
          <button
            title="Rotate palette stops"
            onClick={() => pick([...state.colors.slice(1), state.colors[0]])}
          >
            <RotateCw size={15} />
          </button>
        </div>
        <form
          className="palette-save"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onSavePalette({
                name: name.trim().slice(0, 40),
                colors: state.colors,
              });
              setName("");
            }
          }}
        >
          <input
            aria-label="Custom palette name"
            maxLength="40"
            placeholder="Name this palette…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button title="Save custom palette" disabled={!name.trim()}>
            <Save size={15} />
          </button>
        </form>
        <details className="palette-import">
          <summary>
            <Palette size={13} /> Paste a palette
          </summary>
          <form onSubmit={importColors}>
            <textarea
              aria-label="Palette hex colors"
              placeholder="#ff32b8 #e6ff45 #65ffd2… or a Coolors URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="button secondary" type="submit">
              Apply colors
            </button>
          </form>
        </details>
      </Section>
      <Section
        title="COLOR CHOREOGRAPHY"
        aside={<span>INDEPENDENT OF SHAPE</span>}
      >
        <Select
          label="Rhythm"
          value={state.colorMode}
          onChange={(v) => history.change((s) => ({ ...s, colorMode: v }))}
        >
          {["Traveling wave", "Color canon", "Phase vortex"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
        <p className="control-note">
          {state.colorMode === "Color canon"
            ? "Three harmonic voices in a 1:2:3 rhythm."
            : state.colorMode === "Phase vortex"
              ? "Color winds around the center as a spiraling phase field."
              : "Color fronts travel across the artwork, independently of the geometry."}
        </p>
        <Parameter label="Rhythm amount" name="colorAmount" history={history} />
        <Parameter
          label="Color tempo"
          name="colorSpeed"
          history={history}
          format={(v) => `${(v / 30).toFixed(1)}×`}
        />
        <Parameter
          label="Palette offset"
          name="colorOffset"
          history={history}
        />
        <Parameter
          label="Color repetition"
          name="colorRepeat"
          history={history}
        />
        <Switch
          label="Freeze color clock"
          name="freezeColor"
          history={history}
        />
      </Section>
      <Section title="COLOR GRADE">
        <Parameter label="Saturation" name="saturation" history={history} />
        <Parameter label="Contrast" name="contrast" history={history} />
        <Parameter label="Brightness" name="brightness" history={history} />
      </Section>
    </>
  );
}
