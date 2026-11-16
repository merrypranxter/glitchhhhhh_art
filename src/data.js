export const engineInfo = [
  ["Plasma flow", "Liquid sine fields folded into neon ribbons.", "Fluid"],
  [
    "Acid bloom",
    "Two orbiting ring systems collide in an interference field.",
    "Signal",
  ],
  [
    "Fractal melt",
    "Iterative folds build endlessly intricate alien geometry.",
    "Fractal",
  ],
  [
    "Moiré field",
    "Crossed gratings weave drifting optical interference.",
    "Signal",
  ],
  [
    "Pixel rot",
    "Seeded digital cells disintegrate into restless blocks.",
    "Digital",
  ],
  [
    "Tunnel vision",
    "A polar spiral falls through an infinite color tunnel.",
    "Radial",
  ],
  [
    "Liquid marble",
    "Nested noise currents carve soft organic contours.",
    "Fluid",
  ],
  [
    "Cellular dream",
    "Drifting Voronoi cells grow luminous membranes.",
    "Organic",
  ],
  [
    "Orbit lace",
    "Harmonic petals trace a rotating mathematical rosette.",
    "Radial",
  ],
  [
    "Contour planet",
    "Layered noise becomes a moving topographic map.",
    "Organic",
  ],
  [
    "Chroma weave",
    "Warped crossing threads form an electric woven fabric.",
    "Signal",
  ],
  [
    "Crystal shards",
    "Angular distance fields cut a prismatic kaleidoscope.",
    "Radial",
  ],
].map(([name, description, family], id) => ({ id, name, description, family }));
export const engines = engineInfo.map((e) => e.name);
export const palettes = [
  {
    name: "Toxic candy",
    colors: ["#140827", "#6b21f0", "#ff32b8", "#ff826d", "#e6ff45", "#65ffd2"],
  },
  {
    name: "Hyperpop",
    colors: ["#160e30", "#ec36ff", "#ff335c", "#ffe856", "#18d9fe", "#3b32f4"],
  },
  {
    name: "Acid bath",
    colors: ["#091f24", "#075a57", "#43ffa0", "#caff15", "#ffea99", "#e56aff"],
  },
  {
    name: "After hours",
    colors: ["#0a0820", "#30269b", "#7071ff", "#f471ff", "#ff2a70", "#ff9f72"],
  },
  {
    name: "Solar flare",
    colors: ["#21113d", "#9321ad", "#ff315c", "#ff6c19", "#ffd23f", "#fff4b3"],
  },
  {
    name: "Bubblegum Shock",
    colors: ["#2a001d", "#ff4fcf", "#ff8ae2", "#ffffff"],
  },
  {
    name: "Barbie Reactor",
    colors: ["#111111", "#ff2bb8", "#ff66f0", "#ffd8f7"],
  },
  {
    name: "Kiss Badge Pop",
    colors: ["#3b0012", "#ff3b6b", "#ff79a8", "#fff1f6"],
  },
  {
    name: "Cyber sherbet",
    colors: ["#160b38", "#7047ff", "#ff48c7", "#ffb987", "#f8fa9b", "#65f5dc"],
  },
  {
    name: "Poison garden",
    colors: ["#091812", "#376128", "#adfa35", "#fff79e", "#e64b94", "#652b73"],
  },
  {
    name: "Digital koi",
    colors: ["#131a39", "#224fa8", "#6fe4e9", "#faf1d0", "#ff824e", "#da3056"],
  },
  {
    name: "Ultraviolet bruise",
    colors: ["#070a28", "#262363", "#663abb", "#af45de", "#fc55b9", "#8dffda"],
  },
  {
    name: "Traffic jam",
    colors: ["#10121c", "#fd2949", "#fe8d2b", "#f8e723", "#e6eeed", "#497eff"],
  },
  {
    name: "Laser lagoon",
    colors: ["#071e2e", "#073c5d", "#126fbb", "#22e4db", "#b7ff78", "#f8ecb4"],
  },
  {
    name: "Soft apocalypse",
    colors: ["#312844", "#9a5c8f", "#fba0b0", "#ffd1b0", "#f7ebcd", "#94c8c0"],
  },
  {
    name: "Printer tantrum",
    colors: ["#080811", "#fa19ac", "#03e7ef", "#f6ff2e", "#fbf6ef"],
  },
];
export const ratios = [
  { id: "1:1", value: 1 },
  { id: "9:16", value: 9 / 16 },
  { id: "16:9", value: 16 / 9 },
  { id: "3:4", value: 3 / 4 },
  { id: "4:3", value: 4 / 3 },
];
export const touchModes = ["Warp", "Vortex", "Repel", "Chroma"];
export const numericRanges = {
  complexity: [0, 100],
  scale: [0, 100],
  warp: [0, 100],
  speed: [0, 100],
  split: [0, 100],
  scan: [0, 100],
  grain: [0, 100],
  glitch: [0, 100],
  strength: [0, 100],
  radius: [5, 60],
  rotation: [0, 360],
  symmetry: [1, 12],
  blend: [0, 100],
  block: [0, 100],
  pixel: [0, 100],
  vignette: [0, 100],
  saturation: [0, 100],
  contrast: [0, 100],
  brightness: [0, 100],
  colorOffset: [0, 100],
  colorRepeat: [0, 100],
  colorSpeed: [0, 100],
  colorAmount: [0, 100],
};
export const initial = {
  engine: 0,
  palette: 0,
  colors: palettes[0].colors,
  complexity: 62,
  scale: 42,
  warp: 65,
  speed: 30,
  split: 12,
  scan: 16,
  grain: 8,
  glitch: 24,
  bloom: true,
  posterize: false,
  mirror: false,
  seed: 82491,
  marks: [],
  touchMode: "Warp",
  strength: 60,
  radius: 22,
  rotation: 0,
  symmetry: 1,
  secondaryEngine: 6,
  blend: 0,
  blendMode: "Mix",
  block: 0,
  pixel: 0,
  vignette: 0,
  invert: false,
  saturation: 50,
  contrast: 50,
  brightness: 50,
  colorOffset: 0,
  colorRepeat: 50,
  colorSpeed: 30,
  colorAmount: 0,
  colorMode: "Traveling wave",
  freezeGeometry: false,
  freezeColor: false,
  ratio: "1:1",
};
const bools = [
  "bloom",
  "posterize",
  "mirror",
  "invert",
  "freezeGeometry",
  "freezeColor",
];
const colorRE = /^#[0-9a-f]{6}$/i;
export function validateRecipe(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("This is not an art recipe.");
  const x = input.state || input,
    s = { ...initial };
  for (const key of Object.keys(numericRanges)) {
    if (x[key] === undefined) continue;
    const [min, max] = numericRanges[key];
    if (!Number.isFinite(x[key]) || x[key] < min || x[key] > max)
      throw Error(`Invalid ${key}.`);
    s[key] = x[key];
  }
  for (const key of ["engine", "secondaryEngine"]) {
    if (x[key] === undefined && key === "secondaryEngine") continue;
    if (!Number.isInteger(x[key]) || x[key] < 0 || x[key] >= engines.length)
      throw Error("Unknown mathematical engine.");
    s[key] = x[key];
  }
  if (!Number.isInteger(x.seed) || x.seed < 0 || x.seed > 999999999)
    throw Error("The seed must be a whole number from 0 to 999999999.");
  if (
    !Array.isArray(x.colors) ||
    x.colors.length < 2 ||
    x.colors.length > 8 ||
    !x.colors.every((c) => typeof c === "string" && colorRE.test(c))
  )
    throw Error("A palette needs 2–8 valid hex colors.");
  s.seed = x.seed;
  s.colors = x.colors.map((c) => c.toLowerCase());
  s.palette =
    Number.isInteger(x.palette) && x.palette >= 0 && x.palette < palettes.length
      ? x.palette
      : -1;
  for (const key of bools) {
    if (x[key] !== undefined) {
      if (typeof x[key] !== "boolean") throw Error(`Invalid ${key}.`);
      s[key] = x[key];
    }
  }
  for (const [key, choices] of Object.entries({
    touchMode: touchModes,
    ratio: ratios.map((r) => r.id),
    blendMode: ["Mix", "Multiply", "Difference"],
    colorMode: ["Traveling wave", "Color canon", "Phase vortex"],
  })) {
    if (x[key] !== undefined) {
      if (!choices.includes(x[key])) throw Error(`Unknown ${key}.`);
      s[key] = x[key];
    }
  }
  if (x.marks !== undefined) {
    if (!Array.isArray(x.marks) || x.marks.length > 32)
      throw Error("A recipe can hold up to 32 touch forces.");
    const ids = new Set();
    s.marks = x.marks.map((m, i) => {
      if (
        !m ||
        !["x", "y", "power", "mode"].every((k) => Number.isFinite(m[k])) ||
        m.x < 0 ||
        m.x > 1 ||
        m.y < 0 ||
        m.y > 1 ||
        Math.abs(m.power) > 2 ||
        !Number.isInteger(m.mode) ||
        m.mode < 0 ||
        m.mode > 3
      )
        throw Error("Invalid touch force.");
      const id = typeof m.id === "string" ? m.id.slice(0, 80) : `legacy-${i}`;
      if (ids.has(id)) throw Error("Duplicate touch force.");
      ids.add(id);
      const radius = m.radius ?? 0.22,
        angle = m.angle ?? 0;
      if (
        !Number.isFinite(radius) ||
        radius < 0.05 ||
        radius > 0.6 ||
        !Number.isFinite(angle) ||
        Math.abs(angle) > 1000
      )
        throw Error("Invalid force size or angle.");
      return {
        id,
        x: m.x,
        y: m.y,
        power: m.power,
        mode: m.mode,
        radius,
        angle,
      };
    });
  }
  return s;
}
export function parseDocument(input) {
  const state = validateRecipe(input);
  const time = input.timeline?.time ?? input.time ?? 0,
    colorTime = input.timeline?.colorTime ?? time;
  if (
    !Number.isFinite(time) ||
    time < 0 ||
    time > 1e8 ||
    !Number.isFinite(colorTime) ||
    colorTime < 0 ||
    colorTime > 1e8
  )
    throw Error("Invalid animation time.");
  return {
    state,
    title:
      typeof input.title === "string"
        ? input.title.slice(0, 100)
        : "Untitled exploration",
    timeline: { time, colorTime },
  };
}
export function recipeDocument(state, title, timeline) {
  return {
    app: "glitchhhhhh-art",
    version: 2,
    title,
    state,
    timeline: { ...timeline },
  };
}
export function parsePalette(text) {
  let source = text.trim();
  if (/^https?:\/\/coolors\.co\//i.test(source))
    source = source.split("/").pop().split("?")[0].replaceAll("-", " ");
  const colors = source
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map((c) => (c.startsWith("#") ? c : `#${c}`));
  if (
    colors.length < 2 ||
    colors.length > 8 ||
    !colors.every((c) => colorRE.test(c))
  )
    throw Error(
      "Paste 2–8 six-digit hex colors, separated by spaces or commas.",
    );
  return colors.map((c) => c.toLowerCase());
}
export function paletteName(state) {
  return (
    palettes.find(
      (p) =>
        p.colors.length === state.colors.length &&
        p.colors.every(
          (c, i) => c.toLowerCase() === state.colors[i].toLowerCase(),
        ),
    )?.name || "Custom mix"
  );
}
export function makeMark(state, x = 0.5, y = 0.5) {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ||
      `force-${Date.now()}-${Math.random()}`,
    x,
    y,
    power: state.strength / 100,
    mode: touchModes.indexOf(state.touchMode),
    radius: state.radius / 100,
    angle: 0,
  };
}
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
export function randomize(
  state,
  locks = {},
  mutate = false,
  random = Math.random,
) {
  const next = { ...state };
  if (!mutate && !locks.engine)
    next.engine = Math.floor(random() * engines.length);
  if (!mutate && !locks.color) {
    next.palette = Math.floor(random() * palettes.length);
    next.colors = palettes[next.palette].colors;
  }
  if (!mutate) next.seed = Math.floor(random() * 999999999);
  for (const key of [
    "complexity",
    "scale",
    "warp",
    "split",
    "scan",
    "grain",
    "glitch",
    "rotation",
    "blend",
    "block",
  ]) {
    const [min, max] = numericRanges[key];
    if (mutate)
      next[key] = clamp(
        state[key] + (random() - 0.5) * (max - min) * 0.22,
        min,
        max,
      );
    else
      next[key] =
        key === "rotation"
          ? random() * 360
          : ({ complexity: 35, scale: 15, warp: 25 }[key] || 0) +
            random() *
              ({
                complexity: 55,
                scale: 60,
                warp: 70,
                scan: 30,
                grain: 25,
                glitch: 70,
                split: 45,
                blend: 50,
                block: 35,
              }[key] || 50);
  }
  if (!mutate) {
    next.secondaryEngine = Math.floor(random() * engines.length);
    next.symmetry = [1, 1, 1, 3, 5, 6][Math.floor(random() * 6)];
  }
  return next;
}
export const looks = [
  {
    name: "Toxic tides",
    note: "Liquid marble / neon currents",
    state: {
      ...initial,
      engine: 6,
      warp: 82,
      complexity: 73,
      scale: 32,
      glitch: 39,
      seed: 76042,
    },
  },
  {
    name: "Cathedral FM",
    note: "Crystal shards / chroma canon",
    state: {
      ...initial,
      engine: 11,
      palette: 8,
      colors: palettes[8].colors,
      complexity: 49,
      scale: 18,
      symmetry: 5,
      split: 28,
      colorMode: "Color canon",
      colorAmount: 65,
      seed: 27182,
    },
  },
  {
    name: "Spore party",
    note: "Cellular dream / poison garden",
    state: {
      ...initial,
      engine: 7,
      palette: 9,
      colors: palettes[9].colors,
      complexity: 38,
      scale: 20,
      warp: 40,
      grain: 16,
      scan: 0,
      seed: 62091,
    },
  },
  {
    name: "Velvet interference",
    note: "Moiré × orbit lace / digital koi",
    state: {
      ...initial,
      engine: 3,
      secondaryEngine: 8,
      blend: 58,
      blendMode: "Difference",
      palette: 10,
      colors: palettes[10].colors,
      scale: 18,
      complexity: 32,
      glitch: 10,
      seed: 8841,
    },
  },
  {
    name: "Arcade mulch",
    note: "Pixel rot / printer tantrum",
    state: {
      ...initial,
      engine: 4,
      palette: 15,
      colors: palettes[15].colors,
      scale: 22,
      complexity: 26,
      block: 50,
      glitch: 57,
      pixel: 20,
      seed: 41020,
    },
  },
  {
    name: "Electric tapestry",
    note: "Chroma weave / ultraviolet bruise",
    state: {
      ...initial,
      engine: 10,
      palette: 11,
      colors: palettes[11].colors,
      complexity: 58,
      warp: 40,
      scale: 26,
      split: 32,
      scan: 8,
      colorAmount: 45,
      colorMode: "Traveling wave",
      seed: 99014,
    },
  },
];
