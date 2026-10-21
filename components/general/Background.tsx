"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type RGB = [number, number, number];

type Palette = {
  blue: RGB;
  violet: RGB;
  cyan: RGB;
  border: RGB;
  foreground: RGB;
};

type Look = {
  grid: number;
  dot: number;
  runner: number;
  cursor: number;
  coreMix: number;
  light: number;
  wave: number;
};

type Runner = {
  active: boolean;
  delay: number;
  horizontal: boolean;
  line: number;
  dir: number;
  pos: number;
  speed: number;
  length: number;
  idx: number;
  alpha: number;
};

type Ripple = {
  active: boolean;
  x: number;
  y: number;
  p: number;
  hue0: number;
  born: number;
};

const TAU = Math.PI * 2;

const FALLBACK: Palette = {
  blue: [37, 99, 235],
  violet: [124, 58, 237],
  cyan: [8, 145, 178],
  border: [228, 225, 216],
  foreground: [24, 24, 27],
};

const PALETTE_KEYS = [
  "blue",
  "violet",
  "cyan",
  "border",
  "foreground",
] as const;

const LOOK: Record<"light" | "dark", Look> = {
  light: {
    grid: 0.14,
    dot: 0.36,
    runner: 0.55,
    cursor: 0.8,
    coreMix: 0.16,
    light: 0.1,
    wave: 0.16,
  },
  dark: {
    grid: 0.09,
    dot: 0.28,
    runner: 0.7,
    cursor: 0.85,
    coreMix: 0.4,
    light: 0.14,
    wave: 0.22,
  },
};
const LOOK_KEYS = Object.keys(LOOK.light) as (keyof Look)[];

const RAMP_STEPS = 24;
const CORE_PX = 16;
const DOT_RADIUS = 1.2;

const AMBIENT_POOL = 6;
const SPEED_MIN = 380;
const SPEED_MAX = 720;
const TAIL_MIN = 140;
const TAIL_MAX = 280;
const DELAY_MIN = 0.15;
const DELAY_MAX = 1.4;

const LIGHT_RADIUS = 180;
const MOUSE_SIGMA = 85;
const MOUSE_INV = 1 / (2 * MOUSE_SIGMA * MOUSE_SIGMA);

const RIPPLE_POOL = 4;
const RIPPLE_DURATION = 1.8;
const RIPPLE_MAX_RADIUS = 900;

const THEME_DURATION = 0.7;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const rgba = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

const mixRGB = (a: RGB, b: RGB, t: number, out: RGB): RGB => {
  out[0] = lerp(a[0], b[0], t);
  out[1] = lerp(a[1], b[1], t);
  out[2] = lerp(a[2], b[2], t);
  return out;
};

const rampColor = (p: Palette, t: number, out: RGB): RGB =>
  t < 0.5
    ? mixRGB(p.blue, p.violet, t * 2, out)
    : mixRGB(p.violet, p.cyan, (t - 0.5) * 2, out);

const pickRampIndex = () => {
  const base = [0, 0.5, 1][(Math.random() * 3) | 0];
  return Math.round(
    clamp01(base + (Math.random() - 0.5) * 0.3) * (RAMP_STEPS - 1),
  );
};

const clonePalette = (p: Palette): Palette => ({
  blue: [...p.blue],
  violet: [...p.violet],
  cyan: [...p.cyan],
  border: [...p.border],
  foreground: [...p.foreground],
});

const samePalette = (a: Palette, b: Palette) =>
  PALETTE_KEYS.every(
    (k) => a[k][0] === b[k][0] && a[k][1] === b[k][1] && a[k][2] === b[k][2],
  );

let probeCtx: CanvasRenderingContext2D | null = null;

const resolveColor = (value: string, fallback: RGB): RGB => {
  const raw = value.trim();
  if (!raw) return [...fallback];

  if (!probeCtx) {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    probeCtx = probe.getContext("2d", { willReadFrequently: true });
  }
  if (!probeCtx) return [...fallback];

  const sentinel = "#010203";
  probeCtx.fillStyle = sentinel;
  probeCtx.fillStyle = raw;
  if (probeCtx.fillStyle === sentinel) return [...fallback];

  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillRect(0, 0, 1, 1);
  const d = probeCtx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
};

const readPalette = (): Palette => {
  const s = getComputedStyle(document.documentElement);
  const read = (name: string, fb: RGB) =>
    resolveColor(s.getPropertyValue(name), fb);

  return {
    blue: read("--brand-blue", FALLBACK.blue),
    violet: read("--brand-violet", FALLBACK.violet),
    cyan: read("--brand-cyan", FALLBACK.cyan),
    border: read("--border", FALLBACK.border),
    foreground: read("--foreground", FALLBACK.foreground),
  };
};

const isDark = () => document.documentElement.classList.contains("dark");

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const lowPower =
      window.matchMedia("(pointer: coarse)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;

    const maxDpr = lowPower ? 1.5 : 2;
    const frameInterval = lowPower ? 1 / 30 : 0;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let cell = 56;
    let cols = 0;
    let rows = 0;
    let count = 0;
    let ambientLimit = AMBIENT_POOL;

    let gridX = new Float32Array(0);
    let gridY = new Float32Array(0);

    const gridLayer = document.createElement("canvas");
    const coreAtlas = document.createElement("canvas");
    let coreSize = 0;

    const rampFull: string[] = new Array(RAMP_STEPS).fill("");
    const rampZero: string[] = new Array(RAMP_STEPS).fill("");

    let reduced = motionQuery.matches;
    let running = false;
    let lastTime = -1;
    let clock = 0;

    let mx = -1000;
    let my = -1000;
    let sx = -1000;
    let sy = -1000;
    let hover = 0;
    let hoverTarget = 0;

    let scrollEnergy = 0;
    let lastScrollY = window.scrollY;
    let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const runners: Runner[] = Array.from({ length: AMBIENT_POOL }, () => ({
      active: false,
      delay: 0,
      horizontal: true,
      line: 0,
      dir: 1,
      pos: 0,
      speed: 0,
      length: 0,
      idx: 0,
      alpha: 1,
    }));

    const ripples: Ripple[] = Array.from({ length: RIPPLE_POOL }, () => ({
      active: false,
      x: 0,
      y: 0,
      p: 0,
      hue0: 0,
      born: 0,
    }));

    const tmpA: RGB = [0, 0, 0];
    const tmpB: RGB = [0, 0, 0];

    let paletteTo = readPalette();
    let paletteFrom = clonePalette(paletteTo);
    const live = clonePalette(paletteTo);
    let darkFrom = isDark() ? 1 : 0;
    let darkTo = darkFrom;
    let darkNow = darkFrom;
    const look: Look = { ...LOOK.light };
    const themeState = { mix: 1 };
    let themeTween: gsap.core.Tween | undefined;

    const buildAtlas = () => {
      const cctx = coreAtlas.getContext("2d");
      if (!cctx) return;

      coreSize = Math.ceil(CORE_PX * dpr);
      coreAtlas.width = coreSize * RAMP_STEPS;
      coreAtlas.height = coreSize;

      for (let i = 0; i < RAMP_STEPS; i++) {
        rampColor(live, i / (RAMP_STEPS - 1), tmpA);
        mixRGB(tmpA, live.foreground, look.coreMix, tmpB);

        const cx = i * coreSize + coreSize / 2;
        const cy = coreSize / 2;
        const g = cctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize / 2);
        g.addColorStop(0, rgba(tmpB, 1));
        g.addColorStop(0.6, rgba(tmpB, 1));
        g.addColorStop(1, rgba(tmpB, 0));
        cctx.fillStyle = g;
        cctx.fillRect(i * coreSize, 0, coreSize, coreSize);
      }
    };

    const buildGridLayer = () => {
      const gctx = gridLayer.getContext("2d");
      if (!gctx) return;

      gridLayer.width = canvas.width;
      gridLayer.height = canvas.height;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, W, H);

      mixRGB(live.border, live.foreground, 0.35, tmpA);
      gctx.strokeStyle = rgba(tmpA, look.grid);
      gctx.lineWidth = 1;
      gctx.beginPath();
      for (let c = 0; c < cols; c++) {
        gctx.moveTo(gridX[c], 0);
        gctx.lineTo(gridX[c], H);
      }
      for (let r = 0; r < rows; r++) {
        const y = gridY[r * cols];
        gctx.moveTo(0, y);
        gctx.lineTo(W, y);
      }
      gctx.stroke();

      mixRGB(live.blue, live.foreground, 0.35, tmpA);
      gctx.fillStyle = rgba(tmpA, look.dot);
      gctx.beginPath();
      for (let i = 0; i < count; i++) {
        gctx.moveTo(gridX[i] + DOT_RADIUS, gridY[i]);
        gctx.arc(gridX[i], gridY[i], DOT_RADIUS, 0, TAU);
      }
      gctx.fill();
    };

    const buildRampStyles = () => {
      for (let i = 0; i < RAMP_STEPS; i++) {
        rampColor(live, i / (RAMP_STEPS - 1), tmpA);
        rampFull[i] = rgba(tmpA, look.runner);
        rampZero[i] = rgba(tmpA, 0);
      }
    };

    const rebuildStyles = () => {
      if (!W || !H) return;
      buildAtlas();
      buildGridLayer();
      buildRampStyles();
    };

    const applyTheme = () => {
      const m = themeState.mix;
      for (const key of PALETTE_KEYS) {
        mixRGB(paletteFrom[key], paletteTo[key], m, live[key]);
      }
      darkNow = lerp(darkFrom, darkTo, m);
      for (const key of LOOK_KEYS) {
        look[key] = lerp(LOOK.light[key], LOOK.dark[key], darkNow);
      }
      rebuildStyles();
    };

    const spawnRunner = (r: Runner, prewarm: boolean) => {
      r.active = true;
      r.horizontal = Math.random() < 0.5;

      const lines = r.horizontal ? rows : cols;
      r.line = 1 + ((Math.random() * (lines - 2)) | 0);
      r.dir = Math.random() < 0.5 ? 1 : -1;
      r.speed = rand(SPEED_MIN, SPEED_MAX);
      r.length = rand(TAIL_MIN, TAIL_MAX);
      r.idx = pickRampIndex();
      r.alpha = rand(0.55, 1);

      const span = r.horizontal ? W : H;
      r.pos = prewarm ? Math.random() * span : r.dir > 0 ? 0 : span;
    };

    const resetRunners = () => {
      for (let i = 0; i < runners.length; i++) {
        const r = runners[i];
        r.active = false;
        r.delay = rand(0, DELAY_MAX);
        if (!reduced && i < ambientLimit && W) spawnRunner(r, true);
      }
    };

    const clearRipples = () => {
      for (let i = 0; i < RIPPLE_POOL; i++) {
        gsap.killTweensOf(ripples[i]);
        ripples[i].active = false;
      }
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const nextDpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      if (!w || !h) return;
      if (w === W && h === H && nextDpr === dpr) return;

      W = w;
      H = h;
      dpr = nextDpr;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";

      cell = W < 640 ? 44 : 56;
      cols = Math.ceil(W / cell) + 2;
      rows = Math.ceil(H / cell) + 2;
      count = cols * rows;

      const originX = Math.round((W - (cols - 1) * cell) / 2) + 0.5;
      const originY = Math.round((H - (rows - 1) * cell) / 2) + 0.5;

      gridX = new Float32Array(count);
      gridY = new Float32Array(count);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          gridX[i] = originX + c * cell;
          gridY[i] = originY + r * cell;
        }
      }

      ambientLimit = lowPower || W < 640 ? 4 : AMBIENT_POOL;

      rebuildStyles();
      resetRunners();
      draw();
    };

    function draw() {
      if (!W || !H) return;

      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);

      if (hover > 0.01) {
        rampColor(live, 0.55, tmpA);

        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, LIGHT_RADIUS);

        g.addColorStop(0, rgba(tmpA, look.light * hover));
        g.addColorStop(0.5, rgba(tmpA, look.light * hover * 0.35));
        g.addColorStop(1, rgba(tmpA, 0));

        ctx.fillStyle = g;
        ctx.fillRect(
          sx - LIGHT_RADIUS,
          sy - LIGHT_RADIUS,
          LIGHT_RADIUS * 2,
          LIGHT_RADIUS * 2,
        );
      }

      const maxR = Math.min(Math.hypot(W, H) * 0.6, RIPPLE_MAX_RADIUS);
      for (let i = 0; i < RIPPLE_POOL; i++) {
        const rp = ripples[i];
        if (!rp.active) continue;

        const radius = rp.p * maxR;
        const a = look.wave * Math.pow(1 - rp.p, 1.5);
        if (radius < 2 || a < 0.004) continue;

        const band = 60 + 90 * rp.p;
        const r0 = Math.max(0, radius - band);
        const r1 = radius + band;
        const peak = (radius - r0) / (r1 - r0);

        rampColor(live, clamp01(rp.hue0 + rp.p * (1 - rp.hue0)), tmpA);

        const g = ctx.createRadialGradient(rp.x, rp.y, r0, rp.x, rp.y, r1);
        g.addColorStop(0, rgba(tmpA, 0));
        g.addColorStop(peak, rgba(tmpA, a));
        g.addColorStop(1, rgba(tmpA, 0));

        ctx.strokeStyle = g;
        ctx.lineWidth = r1 - r0;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, (r0 + r1) / 2, 0, TAU);
        ctx.stroke();
      }

      ctx.drawImage(gridLayer, 0, 0, W, H);

      ctx.lineWidth = 1.5;

      for (let i = 0; i < runners.length; i++) {
        const r = runners[i];
        if (!r.active) continue;

        const tail = r.pos - r.dir * r.length;
        let x0: number;
        let y0: number;
        let x1: number;
        let y1: number;

        if (r.horizontal) {
          y0 = y1 = gridY[r.line * cols];
          x0 = tail;
          x1 = r.pos;
        } else {
          x0 = x1 = gridX[r.line];
          y0 = tail;
          y1 = r.pos;
        }

        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, rampZero[r.idx]);
        g.addColorStop(1, rampFull[r.idx]);

        ctx.globalAlpha = r.alpha;
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        const span = r.horizontal ? W : H;
        if (r.pos >= 0 && r.pos <= span) {
          const size = 4.5;
          ctx.drawImage(
            coreAtlas,
            r.idx * coreSize,
            0,
            coreSize,
            coreSize,
            x1 - size / 2,
            y1 - size / 2,
            size,
            size,
          );
        }
      }

      if (hover > 0.02) {
        const R = MOUSE_SIGMA * 2.6;
        const c0 = Math.max(0, Math.floor((sx - R - gridX[0]) / cell));
        const c1 = Math.min(cols - 1, Math.ceil((sx + R - gridX[0]) / cell));
        const r0 = Math.max(0, Math.floor((sy - R - gridY[0]) / cell));
        const r1 = Math.min(rows - 1, Math.ceil((sy + R - gridY[0]) / cell));

        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c;
            const dx = gridX[i] - sx;
            const dy = gridY[i] - sy;
            const m = hover * Math.exp(-(dx * dx + dy * dy) * MOUSE_INV);
            if (m < 0.04) continue;

            const idx = (clamp01(0.5 + 0.45 * m) * (RAMP_STEPS - 1) + 0.5) | 0;
            const size = 2.4 + m * 3.4;
            ctx.globalAlpha = Math.min(1, look.dot + m * look.cursor);
            ctx.drawImage(
              coreAtlas,
              idx * coreSize,
              0,
              coreSize,
              coreSize,
              gridX[i] - size / 2,
              gridY[i] - size / 2,
              size,
              size,
            );
          }
        }
      }

      ctx.globalAlpha = 1;
    }

    const tick = (time: number) => {
      if (lastTime < 0) lastTime = time;
      const elapsed = time - lastTime;
      if (elapsed < frameInterval - 0.002) return;

      const dt = Math.min(elapsed, 0.05);
      lastTime = time;
      clock += dt;

      const follow = 1 - Math.exp(-dt * 8);
      sx += (mx - sx) * follow;
      sy += (my - sy) * follow;
      hover +=
        (hoverTarget - hover) *
        (1 - Math.exp(-dt * (hoverTarget > hover ? 7 : 2.2)));

      scrollEnergy *= Math.exp(-dt * 1.6);
      const speedMul = 1 + 1.2 * scrollEnergy;

      for (let i = 0; i < runners.length; i++) {
        const r = runners[i];

        if (r.active) {
          r.pos += r.dir * r.speed * speedMul * dt;

          const span = r.horizontal ? W : H;
          const out =
            r.dir > 0 ? r.pos - r.length > span : r.pos + r.length < 0;

          if (out) {
            r.active = false;
            r.delay = rand(DELAY_MIN, DELAY_MAX);
          }
        } else if (i < ambientLimit) {
          r.delay -= dt;
          if (r.delay <= 0) spawnRunner(r, false);
        }
      }

      draw();
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      lastTime = -1;
      gsap.ticker.add(tick);
    };

    const stopLoop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    const addRipple = (x: number, y: number) => {
      let slot: Ripple | undefined;
      for (let i = 0; i < RIPPLE_POOL; i++) {
        if (!ripples[i].active) {
          slot = ripples[i];
          break;
        }
      }
      if (!slot) {
        slot = ripples[0];
        for (let i = 1; i < RIPPLE_POOL; i++) {
          if (ripples[i].born < slot.born) slot = ripples[i];
        }
      }

      const ripple = slot;
      gsap.killTweensOf(ripple);
      ripple.active = true;
      ripple.x = x;
      ripple.y = y;
      ripple.p = 0;
      ripple.hue0 = Math.random() * 0.45;
      ripple.born = clock;

      gsap.to(ripple, {
        p: 1,
        duration: RIPPLE_DURATION,
        ease: "power2.out",
        onComplete: () => {
          ripple.active = false;
        },
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduced || event.pointerType === "touch") return;

      mx = event.clientX;
      my = event.clientY;

      if (hoverTarget === 0 && hover < 0.02) {
        sx = mx;
        sy = my;
      }

      hoverTarget = 1;
    };

    const onPointerLeave = () => {
      hoverTarget = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduced || !W) return;
      addRipple(event.clientX, event.clientY);
    };

    const onScroll = () => {
      if (reduced) return;

      const y = window.scrollY;

      scrollEnergy = Math.min(
        1,
        scrollEnergy + Math.abs(y - lastScrollY) / 900,
      );

      lastScrollY = y;

      // On touch devices, use the viewport center as the ambient-light position.
      if (coarsePointer) {
        mx = W / 2;
        my = H / 2;

        // Avoid animating the light from its initial off-screen position.
        if (hover < 0.02) {
          sx = mx;
          sy = my;
        }

        hoverTarget = 1;

        // Hide the light gradually after scrolling stops.
        if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(() => {
          hoverTarget = 0;
          scrollIdleTimer = undefined;
        }, 180);
      }
    };

    const onThemeChange = () => {
      const nextPalette = readPalette();
      const nextDark = isDark() ? 1 : 0;
      if (nextDark === darkTo && samePalette(nextPalette, paletteTo)) return;

      paletteFrom = clonePalette(live);
      paletteTo = nextPalette;
      darkFrom = darkNow;
      darkTo = nextDark;

      themeTween?.kill();
      themeState.mix = 0;

      if (reduced || !W) {
        themeState.mix = 1;
        applyTheme();
        draw();
        return;
      }

      themeTween = gsap.to(themeState, {
        mix: 1,
        duration: THEME_DURATION,
        ease: "power2.inOut",
        onUpdate: applyTheme,
      });
    };

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      hover = 0;
      hoverTarget = 0;
      scrollEnergy = 0;
      clearRipples();

      if (reduced) {
        stopLoop();
        resetRunners();
        draw();
      } else {
        resetRunners();
        startLoop();
      }
    };

    applyTheme();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    motionQuery.addEventListener("change", onMotionChange);

    if (reduced) draw();
    else startLoop();

    return () => {
      stopLoop();
      themeTween?.kill();
      clearRipples();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);

      resizeObserver.disconnect();
      themeObserver.disconnect();

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-lvh w-full"
    />
  );
}
