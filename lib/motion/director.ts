import type gsap from "gsap";

export type Role = "heading" | "text" | "media" | "action" | "block";
export type StaggerFrom = "start" | "center" | "edges" | "end" | "random";

export type Move = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  split?: "words" | "lines";
};
type MoveCtx = { dir: 1 | -1; dist: number; rng: () => number };
type MoveFn = (c: MoveCtx) => Move;

export const MOVES: Record<string, MoveFn> = {
  rise: ({ dist }) => ({
    from: { opacity: 0, y: dist },
    to: { opacity: 1, y: 0 },
  }),
  drop: ({ dist }) => ({
    from: { opacity: 0, y: -dist },
    to: { opacity: 1, y: 0 },
  }),
  inline: ({ dir, dist }) => ({
    from: { opacity: 0, x: dist * 1.3 * -dir },
    to: { opacity: 1, x: 0 },
  }),
  blur: ({ dist }) => ({
    from: { opacity: 0, y: dist * 0.4, filter: "blur(12px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
  }),
  zoom: () => ({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
  }),
  pop: () => ({
    from: { opacity: 0, scale: 0.6 },
    to: { opacity: 1, scale: 1, ease: "back.out(1.7)" },
  }),
  tilt: ({ dir, dist, rng }) => ({
    from: {
      opacity: 0,
      y: dist,
      rotate: (2 + rng() * 3) * dir,
      transformOrigin: "50% 100%",
    },
    to: { opacity: 1, y: 0, rotate: 0 },
  }),
  wipe: ({ dir }) => ({
    from: {
      opacity: 0,
      clipPath: dir === 1 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
    },
    to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
  }),
  "split-words": () => ({ from: {}, to: {}, split: "words" }),
  "split-lines": () => ({ from: {}, to: {}, split: "lines" }),
};

export type Mood = {
  name: string;
  tempo: number;
  ease: string;
  dist: number;
  amount: number;
  from: StaggerFrom[];
  pools: Record<Role, string[]>;
};

export const MOODS: Mood[] = [
  {
    name: "calm",
    tempo: 1.1,
    ease: "power3.out",
    dist: 28,
    amount: 0.5,
    from: ["start", "center"],
    pools: {
      heading: ["split-lines", "rise"],
      text: ["rise", "blur"],
      media: ["zoom", "wipe"],
      action: ["rise"],
      block: ["rise", "zoom"],
    },
  },
  {
    name: "snappy",
    tempo: 0.65,
    ease: "expo.out",
    dist: 40,
    amount: 0.4,
    from: ["start", "edges"],
    pools: {
      heading: ["split-words", "inline"],
      text: ["inline", "rise"],
      media: ["wipe", "tilt"],
      action: ["pop", "rise"],
      block: ["inline", "rise"],
    },
  },
  {
    name: "cinematic",
    tempo: 1.4,
    ease: "power4.out",
    dist: 60,
    amount: 0.8,
    from: ["center", "start"],
    pools: {
      heading: ["split-lines", "blur"],
      text: ["blur", "rise"],
      media: ["zoom", "wipe"],
      action: ["rise", "blur"],
      block: ["blur", "zoom"],
    },
  },
  {
    name: "playful",
    tempo: 0.9,
    ease: "back.out(1.5)",
    dist: 36,
    amount: 0.6,
    from: ["random", "edges", "center"],
    pools: {
      heading: ["split-words", "tilt"],
      text: ["tilt", "rise"],
      media: ["pop", "tilt"],
      action: ["pop"],
      block: ["tilt", "pop"],
    },
  },
];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const recall = (key: string): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
};
const remember = (key: string, value: string) => {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify([value, ...recall(key)].slice(0, 3)),
    );
  } catch {}
};

export type Plan = {
  mood: Mood;
  seed: number;
  dir: 1 | -1;
  pick: (role: Role, i: number, override?: string) => Move;
  clusterFrom: () => StaggerFrom;
};

export function createPlan(pathname: string, dir: 1 | -1): Plan {
  const params = new URLSearchParams(window.location.search);

  const forcedMood = MOODS.find((m) => m.name === params.get("motion"));
  const forcedSeed = Number(params.get("motion-seed"));
  const seed = forcedSeed
    ? forcedSeed >>> 0
    : (hashString(pathname) ^ (Math.random() * 4294967296)) >>> 0;
  const rng = createRng(seed);

  const pageKey = `motion:page:${pathname}`;
  const avoid = new Set([recall(pageKey)[0], recall("motion:global")[0]]);
  const pool = MOODS.filter((m) => !avoid.has(m.name));
  const candidates = pool.length ? pool : MOODS;
  const mood = forcedMood ?? candidates[Math.floor(rng() * candidates.length)];

  remember(pageKey, mood.name);
  remember("motion:global", mood.name);

  const offsets = Object.fromEntries(
    (Object.keys(mood.pools) as Role[]).map((r) => [
      r,
      Math.floor(rng() * mood.pools[r].length),
    ]),
  ) as Record<Role, number>;

  const build = (name: string): Move => {
    const fn = MOVES[name] ?? MOVES.rise;
    return fn({ dir, dist: mood.dist, rng });
  };

  return {
    mood,
    seed,
    dir,
    pick: (role, i, override) => {
      if (override && MOVES[override]) return build(override);
      const names = mood.pools[role];
      return build(names[(i + offsets[role]) % names.length]);
    },
    clusterFrom: () => mood.from[Math.floor(rng() * mood.from.length)],
  };
}
