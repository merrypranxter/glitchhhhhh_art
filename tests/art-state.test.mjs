import test from "node:test";
import assert from "node:assert/strict";
import {
  initial,
  parseDocument,
  recipeDocument,
  parsePalette,
  randomize,
  makeMark,
  palettes,
} from "../src/data.js";
import { TouchSession } from "../src/gestures.js";
import { dimensions } from "../src/export.js";
test("old recipes retain all original values and gain editable touch-source identities", () => {
  const old = { ...initial, marks: [{ x: 0.4, y: 0.6, power: 0.6, mode: 1 }] };
  delete old.radius;
  delete old.blend;
  const doc = parseDocument({ state: old, time: 12.5 });
  assert.equal(doc.timeline.colorTime, 12.5);
  assert.equal(doc.state.marks[0].id, "legacy-0");
  assert.equal(doc.state.colors.join(), palettes[0].colors.join());
  assert.equal(doc.state.blend, 0);
});
test("complete recipe round trip preserves clocks, title, custom colors, and source shape", () => {
  const doc = recipeDocument(
    {
      ...initial,
      engine: 11,
      colors: ["#fa19ac", "#080811"],
      marks: [makeMark(initial)],
    },
    "Moon jelly",
    { time: 34.23, colorTime: 5.43 },
  );
  assert.deepEqual(parseDocument(JSON.parse(JSON.stringify(doc))), {
    state: doc.state,
    title: doc.title,
    timeline: doc.timeline,
  });
});
test("invalid seed, clock, color and source data cannot enter the renderer", () => {
  for (const bad of [
    { ...initial, seed: -1 },
    { ...initial, colors: ["#abc", "javascript:bad"] },
    { ...initial, marks: [{ ...makeMark(initial), radius: 8 }] },
    { ...initial, engine: 12 },
    { ...initial, blend: NaN },
  ])
    assert.throws(() => parseDocument(bad));
  assert.throws(() => parseDocument({ state: initial, time: Infinity }));
  const m = makeMark(initial);
  assert.throws(() => parseDocument({ ...initial, marks: [m, m] }));
});
test("palette import accepts hex lists and Coolors, preserves order, rejects extra garbage", () => {
  assert.deepEqual(parsePalette("#fa19ac, #080811\n#03e7ef"), [
    "#fa19ac",
    "#080811",
    "#03e7ef",
  ]);
  assert.deepEqual(parsePalette("https://coolors.co/fa19ac-080811-03e7ef"), [
    "#fa19ac",
    "#080811",
    "#03e7ef",
  ]);
  assert.throws(() => parsePalette("#ffcc00 nonsense #000000"));
});
test("randomization respects locks and preserves touch work and composition", () => {
  const source = { ...initial, marks: [makeMark(initial)], ratio: "9:16" },
    next = randomize(source, { engine: true, color: true }, false, () => 0.7);
  assert.equal(next.engine, source.engine);
  assert.deepEqual(next.colors, source.colors);
  assert.equal(next.marks, source.marks);
  assert.equal(next.ratio, source.ratio);
  assert.notEqual(next.seed, source.seed);
});
test("pinch enlarges and twists a real source; releasing one finger never paints a stray stroke", () => {
  const start = { ...initial, marks: [] },
    s = new TouchSession(start, "Paint", { id: 1, x: 0.4, y: 0.5 });
  s.add({ id: 2, x: 0.6, y: 0.5 });
  const before = s.draft.marks.at(-1);
  s.move({ id: 2, x: 0.7, y: 0.7 });
  const after = s.draft.marks.at(-1);
  assert.ok(after.radius > before.radius);
  assert.notEqual(after.angle, before.angle);
  const count = s.draft.marks.length;
  assert.equal(s.release(2), false);
  s.move({ id: 1, x: 0.2, y: 0.2 });
  assert.equal(s.draft.marks.length, count);
  assert.equal(s.release(1), true);
  assert.deepEqual(start.marks, []);
});
test("move and erase edit existing sources without changing their identity or creating new ones", () => {
  const m = makeMark(initial, 0.5, 0.5),
    base = { ...initial, marks: [m] },
    s = new TouchSession(base, "Move", { id: 1, x: 0.5, y: 0.5 });
  s.move({ id: 1, x: 0.7, y: 0.4 });
  assert.equal(s.draft.marks[0].id, m.id);
  assert.equal(s.draft.marks[0].x, 0.7);
  const erase = new TouchSession(s.draft, "Erase", { id: 2, x: 0.7, y: 0.4 });
  assert.equal(erase.draft.marks.length, 0);
  assert.equal(base.marks.length, 1);
});
test("export dimensions keep their exact long edge across every artwork ratio", () => {
  assert.deepEqual(dimensions("9:16", 2160), { width: 1215, height: 2160 });
  assert.deepEqual(dimensions("16:9", 4096), { width: 4096, height: 2304 });
  assert.deepEqual(dimensions("1:1", 1080), { width: 1080, height: 1080 });
});
