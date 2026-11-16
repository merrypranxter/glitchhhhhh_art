import { makeMark } from "./data.js";
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const distance = (a, b, aspect) => Math.hypot((a.x - b.x) * aspect, a.y - b.y);
export function nearestMark(marks, p, aspect) {
  let index = -1,
    best = 0.13;
  marks.forEach((m, i) => {
    const d = distance(m, p, aspect);
    if (d < best) {
      best = d;
      index = i;
    }
  });
  return index;
}
/** Pointer state belongs here; the persistent document stores only mathematical sources. */
export class TouchSession {
  constructor(state, tool, p, aspect = 1) {
    this.base = state;
    this.draft = state;
    this.tool = tool;
    this.aspect = aspect;
    this.pointers = new Map([[p.id, p]]);
    this.last = null;
    this.pinched = false;
    this.target = nearestMark(state.marks, p, aspect);
    this.apply(p);
  }
  apply(p) {
    if (this.tool === "Paint") {
      if (this.last && distance(this.last, p, this.aspect) < 0.055) return;
      this.last = p;
      const mark = makeMark(this.base, p.x, p.y);
      this.draft = {
        ...this.draft,
        marks: [...this.draft.marks, mark].slice(-32),
      };
      this.target = this.draft.marks.length - 1;
    } else if (this.tool === "Move" && this.target >= 0) {
      this.draft = {
        ...this.draft,
        marks: this.draft.marks.map((m, i) =>
          i === this.target ? { ...m, x: p.x, y: p.y } : m,
        ),
      };
    } else if (this.tool === "Erase") {
      const index = nearestMark(this.draft.marks, p, this.aspect);
      if (index >= 0)
        this.draft = {
          ...this.draft,
          marks: this.draft.marks.filter((_, i) => i !== index),
        };
    }
  }
  add(p) {
    if (this.pointers.size >= 2) return;
    this.pointers.set(p.id, p);
    if (this.pointers.size !== 2) return;
    this.pinched = true;
    const [a, b] = [...this.pointers.values()];
    const middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    let i = nearestMark(this.draft.marks, middle, this.aspect);
    if (i < 0) {
      this.draft = {
        ...this.draft,
        marks: [
          ...this.draft.marks,
          makeMark(this.base, middle.x, middle.y),
        ].slice(-32),
      };
      i = this.draft.marks.length - 1;
    }
    this.target = i;
    this.pinch = {
      distance: Math.max(0.015, distance(a, b, this.aspect)),
      angle: Math.atan2(b.y - a.y, (b.x - a.x) * this.aspect),
      mark: this.draft.marks[i],
      middle,
    };
  }
  move(p) {
    if (!this.pointers.has(p.id)) return;
    this.pointers.set(p.id, p);
    if (this.pinched) {
      if (this.pointers.size < 2 || !this.pinch) return;
      const [a, b] = [...this.pointers.values()],
        origin = this.pinch;
      const radius = clamp(
        (origin.mark.radius * distance(a, b, this.aspect)) / origin.distance,
        0.05,
        0.6,
      );
      const angle =
        origin.mark.angle +
        Math.atan2(b.y - a.y, (b.x - a.x) * this.aspect) -
        origin.angle;
      const x = clamp(origin.mark.x + (a.x + b.x) / 2 - origin.middle.x, 0, 1),
        y = clamp(origin.mark.y + (a.y + b.y) / 2 - origin.middle.y, 0, 1);
      this.draft = {
        ...this.draft,
        marks: this.draft.marks.map((m, i) =>
          i === this.target ? { ...m, radius, angle, x, y } : m,
        ),
      };
    } else this.apply(p);
  }
  release(id) {
    this.pointers.delete(id);
    return this.pointers.size === 0;
  }
}
