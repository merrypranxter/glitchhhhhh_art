import { initial, parseDocument, recipeDocument } from "./data.js";
export function loadDraft() {
  try {
    const raw = localStorage.getItem("glitch-draft");
    return raw
      ? parseDocument(JSON.parse(raw))
      : {
          state: initial,
          title: "Untitled exploration",
          timeline: { time: 0, colorTime: 0 },
        };
  } catch {
    return {
      state: initial,
      title: "Untitled exploration",
      timeline: { time: 0, colorTime: 0 },
    };
  }
}
export function saveDraft(state, title, timeline) {
  localStorage.setItem(
    "glitch-draft",
    JSON.stringify(recipeDocument(state, title, timeline)),
  );
}
export function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem("glitch-saved") || "[]").flatMap(
      (s) => {
        try {
          const doc = parseDocument(s);
          return [{ ...s, ...doc }];
        } catch {
          return [];
        }
      },
    );
  } catch {
    return [];
  }
}
export function storeCollection(items) {
  localStorage.setItem("glitch-saved", JSON.stringify(items));
}
export function loadCustomPalettes() {
  try {
    return JSON.parse(localStorage.getItem("glitch-palettes") || "[]").filter(
      (p) =>
        typeof p.name === "string" &&
        Array.isArray(p.colors) &&
        p.colors.length >= 2 &&
        p.colors.length <= 8 &&
        p.colors.every((c) => /^#[a-f\d]{6}$/i.test(c)),
    );
  } catch {
    return [];
  }
}
