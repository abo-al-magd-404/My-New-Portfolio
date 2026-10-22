import gsap from "gsap";

const CLICKABLE = "a,button,[role='button'],[data-click-fx]";
const MAGNETIC = "button,a,[data-magnetic]";
const PARTICLES = 6;
const MAX_LIVE_BURSTS = 4;

export function initInteractions(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  let live = 0;

  const burst = (x: number, y: number) => {
    if (live >= MAX_LIVE_BURSTS) return;
    live++;

    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.className =
      "pointer-events-none fixed inset-0 z-[100] overflow-hidden";

    const ring = document.createElement("span");
    ring.className = "absolute size-10 rounded-full border-2 border-brand-blue";
    const dots = Array.from({ length: PARTICLES }, () => {
      const d = document.createElement("span");
      d.className = "absolute size-1.5 rounded-full bg-brand-violet";
      return d;
    });

    [ring, ...dots].forEach((n) => {
      n.style.left = `${x}px`;
      n.style.top = `${y}px`;
      layer.appendChild(n);
    });
    document.body.appendChild(layer);

    const tl = gsap.timeline({
      onComplete: () => {
        layer.remove();
        live--;
      },
    });
    tl.fromTo(
      ring,
      { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0.9 },
      { scale: 2.6, opacity: 0, duration: 0.6, ease: "power2.out" },
      0,
    );
    dots.forEach((dot, i) => {
      const angle =
        (i / PARTICLES) * Math.PI * 2 + gsap.utils.random(-0.4, 0.4);
      const reach = gsap.utils.random(34, 64);
      tl.fromTo(
        dot,
        { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: Math.cos(angle) * reach,
          y: Math.sin(angle) * reach,
          scale: 0,
          opacity: 0,
          duration: gsap.utils.random(0.45, 0.7),
          ease: "power3.out",
        },
        0,
      );
    });
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const target = (e.target as Element | null)?.closest<HTMLElement>(
      CLICKABLE,
    );
    if (!target || target.closest("[data-no-motion]")) return;
    if (target.matches(":disabled,[aria-disabled='true']")) return;
    burst(e.clientX, e.clientY);
  };

  let active: HTMLElement | null = null;

  const isMagnetic = (el: HTMLElement) => {
    if (el.closest("[data-no-motion],header")) return false;
    if (el.hasAttribute("data-magnetic")) return true;
    if (getComputedStyle(el).display === "inline") return false;
    const r = el.getBoundingClientRect();
    return r.width <= 260 && r.height <= 90;
  };

  const release = (el: HTMLElement) => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
      onComplete: () => {
        el.style.transitionProperty = "";
      },
    });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el =
      (e.target as Element | null)?.closest<HTMLElement>(MAGNETIC) ?? null;

    if (el !== active) {
      if (active) release(active);
      active = el && isMagnetic(el) ? el : null;
      if (active) {
        active.style.transitionProperty =
          "color,background-color,border-color,box-shadow,opacity";
      }
    }
    if (!active) return;

    const r = active.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(active, {
      x: dx * 0.28,
      y: dy * 0.28,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeaveWindow = () => {
    if (active) release(active);
    active = null;
  };

  document.addEventListener("pointerdown", onPointerDown);
  if (finePointer) {
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
  }

  return () => {
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    if (active) release(active);
  };
}
