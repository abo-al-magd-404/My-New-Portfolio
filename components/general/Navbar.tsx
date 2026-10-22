"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { Button } from "../ui/button";
import Link from "next/link";

type Locale = "en" | "ar";

interface NavbarProps {
  locale: Locale;
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

const OVERLAY_ID = "locale-transition";
const SWITCH_SAFETY_TIMEOUT_MS = 6000;
const SOUND_SRC = "/sounds/transform.mp3";

const GRADIENT =
  "linear-gradient(120deg,var(--brand-blue),var(--brand-violet))";

const NAMES = {
  ar: { full: "محمد محمود أبو المجد", short: "أبو المجد" },
  en: { full: "Mohamed Mahmoud Abo al magd", short: "Abo al magd" },
} as const;

const LABELS = {
  ar: { lang: "Switch to English", theme: "تبديل المظهر" },
  en: { lang: "التبديل إلى العربية", theme: "Toggle theme" },
} as const;

const CLIP = {
  rtl: {
    start: "inset(0% 0% 0% 100%)",
    full: "inset(0% 0% 0% 0%)",
    end: "inset(0% 100% 0% 0%)",
  },
  ltr: {
    start: "inset(0% 100% 0% 0%)",
    full: "inset(0% 0% 0% 0%)",
    end: "inset(0% 0% 0% 100%)",
  },
} as const;

type Dir = keyof typeof CLIP;

const BTN_BASE =
  "group size-10 sm:w-auto sm:px-3.5 shrink-0 gap-2 rounded-xl " +
  "text-xs sm:text-sm font-bold cursor-pointer shadow-sm " +
  "border-border bg-secondary/50 dark:border-border dark:bg-secondary/50 " +
  "transition-colors duration-300";

const BTN_LANG =
  "hover:bg-brand-blue/10 hover:border-brand-blue/50 " +
  "dark:hover:bg-brand-blue/10 dark:hover:border-brand-blue/50";

const BTN_THEME =
  "hover:bg-brand-violet/10 hover:border-brand-violet/50 " +
  "dark:hover:bg-brand-violet/10 dark:hover:border-brand-violet/50";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getOverlay = () => document.getElementById(OVERLAY_ID);

function buildLocalePath(pathname: string, newLocale: Locale) {
  const segments = pathname.split("/");

  if (segments[1] === "en" || segments[1] === "ar") {
    segments[1] = newLocale;
  } else {
    segments.splice(1, 0, newLocale);
  }

  return segments.join("/") + window.location.search + window.location.hash;
}

function createOverlay(target: Locale) {
  const dir: Dir = target === "ar" ? "rtl" : "ltr";

  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.dataset.dir = dir;
  el.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:all;";

  const band = document.createElement("div");
  band.dataset.layer = "band";
  band.style.cssText = `position:absolute;inset:0;background:${GRADIENT};`;

  const panel = document.createElement("div");
  panel.dataset.layer = "panel";
  panel.style.cssText =
    "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--background);";

  const label = document.createElement("span");
  label.dataset.layer = "label";
  label.textContent = target === "ar" ? "ع" : "EN";
  label.style.cssText =
    "font-size:clamp(5rem,16vw,11rem);font-weight:800;line-height:1.2;display:inline-block;padding-bottom:0.1em;" +
    `background:${GRADIENT};` +
    "-webkit-background-clip:text;background-clip:text;color:transparent;";

  panel.appendChild(label);
  el.append(band, panel);
  document.body.appendChild(el);
  gsap.set([band, panel], { clipPath: CLIP[dir].start });

  return el;
}

const getOverlayLayers = (el: HTMLElement) => ({
  dir: (el.dataset.dir as Dir) ?? "ltr",
  band: el.querySelector('[data-layer="band"]'),
  panel: el.querySelector('[data-layer="panel"]'),
  label: el.querySelector('[data-layer="label"]'),
});

function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return ref;
}

function useSound(src: string, volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audioRef.current = audio;
  }, [src, volume]);

  return () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}

function useEntranceAnimation(navRef: React.RefObject<HTMLElement | null>) {
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const delay = getOverlay() ? 0.55 : 0;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -70,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        delay,
      });
      gsap.from("[data-nav-item]", {
        y: -14,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        delay: delay + 0.25,
      });
    }, navRef);

    return () => ctx.revert();
  }, [navRef]);
}

function useLocaleReveal(locale: Locale) {
  useEffect(() => {
    const el = getOverlay();
    if (!el) return;

    const { dir, band, panel, label } = getOverlayLayers(el);

    const tl = gsap
      .timeline({ delay: 0.25, onComplete: () => el.remove() })
      .to(label, { y: -30, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(
        panel,
        { clipPath: CLIP[dir].end, duration: 0.6, ease: "power4.inOut" },
        0.1,
      )
      .to(
        band,
        { clipPath: CLIP[dir].end, duration: 0.6, ease: "power4.inOut" },
        0.22,
      );

    return () => {
      tl.kill();
    };
  }, [locale]);
}

export default function Navbar({ locale }: NavbarProps) {
  const isArabic = locale === "ar";
  const name = NAMES[locale];
  const labels = LABELS[locale];

  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const isSwitchingRef = useRef(false);
  const langBtnRef = useMagnetic<HTMLButtonElement>();
  const themeBtnRef = useMagnetic<HTMLButtonElement>();
  const playSound = useSound(SOUND_SRC);

  useEntranceAnimation(navRef);
  useLocaleReveal(locale);

  useEffect(() => {
    isSwitchingRef.current = false;
  }, [locale]);

  const handleThemeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound();

    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    const doc = document as ViewTransitionDoc;

    if (!doc.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 750,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  const handleLanguageToggle = () => {
    if (isSwitchingRef.current) return;

    const newLocale: Locale = isArabic ? "en" : "ar";
    const target = buildLocalePath(pathname, newLocale);

    playSound();

    if (prefersReducedMotion()) {
      router.push(target);
      return;
    }

    isSwitchingRef.current = true;
    const { dir, band, panel, label } = getOverlayLayers(
      createOverlay(newLocale),
    );

    gsap
      .timeline({ onComplete: () => router.push(target) })
      .to(band, {
        clipPath: CLIP[dir].full,
        duration: 0.55,
        ease: "power4.inOut",
      })
      .to(
        panel,
        { clipPath: CLIP[dir].full, duration: 0.55, ease: "power4.inOut" },
        0.12,
      )
      .from(
        label,
        { y: 40, opacity: 0, duration: 0.4, ease: "power3.out" },
        0.4,
      );

    window.setTimeout(() => {
      getOverlay()?.remove();
      isSwitchingRef.current = false;
    }, SWITCH_SAFETY_TIMEOUT_MS);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        ref={navRef}
        className="pointer-events-auto container mx-auto flex items-center justify-between gap-3 rounded-2xl border border-border bg-foreground/5 px-3 py-2 text-foreground shadow-lg backdrop-blur-sm sm:px-5 sm:py-2.5"
      >
        <Link
          href={`/${locale}`}
          data-nav-item
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="relative size-9 sm:size-10 shrink-0 rounded-full overflow-hidden border border-brand-blue/40 shadow-[0_0_12px_var(--glow-blue)]">
            <Image
              src="/pictures/apple-touch-icon.png"
              alt={name.full}
              fill
              sizes="(min-width: 640px) 40px, 36px"
              className="object-cover"
              priority
            />
          </div>
          <span className="truncate font-bold text-sm sm:text-base tracking-tight">
            <span className="sm:hidden">{name.short}</span>
            <span className="hidden sm:inline">{name.full}</span>
          </span>
        </Link>

        <div
          data-nav-item
          className="flex shrink-0 items-center gap-2 sm:gap-2.5"
        >
          <Button
            ref={langBtnRef}
            type="button"
            variant="outline"
            size="icon"
            onClick={handleLanguageToggle}
            className={`${BTN_BASE} ${BTN_LANG}`}
            aria-label={labels.lang}
            title={labels.lang}
          >
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-brand-blue transition-transform duration-500 group-hover:rotate-180"
            />
            <span className="hidden sm:inline text-foreground">
              {isArabic ? "EN" : "AR"}
            </span>
          </Button>

          <Button
            ref={themeBtnRef}
            type="button"
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            className={`${BTN_BASE} ${BTN_THEME}`}
            aria-label={labels.theme}
            title={labels.theme}
          >
            <span className="relative inline-block h-4 w-4 text-brand-violet">
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
                <FontAwesomeIcon icon={faSun} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100">
                <FontAwesomeIcon icon={faMoon} />
              </span>
            </span>
            <span className="hidden sm:inline text-foreground">
              <span className="dark:hidden">
                {isArabic ? "فاتح" : "Light"}
              </span>
              <span className="hidden dark:inline">
                {isArabic ? "داكن" : "Dark"}
              </span>
            </span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
