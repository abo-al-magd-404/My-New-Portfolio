"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

interface NavbarProps {
  locale: "en" | "ar";
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const OVERLAY_ID = "locale-transition";

// ar = من اليمين للشمال، en = من الشمال لليمين
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

function createOverlay(target: "en" | "ar") {
  const dir: Dir = target === "ar" ? "rtl" : "ltr";

  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  el.dataset.dir = dir;
  el.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:all;";

  const band = document.createElement("div");
  band.dataset.layer = "band";
  band.style.cssText =
    "position:absolute;inset:0;background:linear-gradient(120deg,var(--brand-blue),var(--brand-violet));";

  const panel = document.createElement("div");
  panel.dataset.layer = "panel";
  panel.style.cssText =
    "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--background);";

  const label = document.createElement("span");
  label.dataset.layer = "label";
  label.textContent = target === "ar" ? "ع" : "EN";
  label.style.cssText =
    "font-size:clamp(5rem,16vw,11rem);font-weight:800;line-height:1;" +
    "background:linear-gradient(120deg,var(--brand-blue),var(--brand-violet));" +
    "-webkit-background-clip:text;background-clip:text;color:transparent;";

  panel.appendChild(label);
  el.append(band, panel);
  document.body.appendChild(el);
  gsap.set([band, panel], { clipPath: CLIP[dir].start });
  return el;
}

const layers = (el: HTMLElement) => ({
  dir: (el.dataset.dir as Dir) ?? "ltr",
  band: el.querySelector('[data-layer="band"]'),
  panel: el.querySelector('[data-layer="panel"]'),
  label: el.querySelector('[data-layer="label"]'),
});

/* Magnetic hover: الزر بيتحرك ناحية المؤشر بنعومة */
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

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function Navbar({ locale }: NavbarProps) {
  const isArabic = locale === "ar";
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSwitchingRef = useRef(false);
  const langBtnRef = useMagnetic<HTMLButtonElement>();
  const themeBtnRef = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    const audio = new Audio("/sounds/transform.mp3");
    audio.volume = 0.5;
    audioRef.current = audio;
  }, []);

  const playSound = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  /* ───── 1) Entrance animation ───── */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    // لو جاي من language switch، استنى الـ curtain يخلص تقريباً
    const delay = document.getElementById(OVERLAY_ID) ? 0.55 : 0;

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
  }, []);

  /* ───── 2) Reveal: بيشيل الـ curtain بعد تغيير اللغة ───── */
  useEffect(() => {
    isSwitchingRef.current = false;
    const el = document.getElementById(OVERLAY_ID);
    if (!el) return;

    const { dir, band, panel, label } = layers(el);
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

  /* ───── 3) Theme: circular reveal من مكان الزر، بدون reload ───── */
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

  /* ───── 4) Language: curtain ثم router.push ───── */
  const handleLanguageToggle = () => {
    if (isSwitchingRef.current) return;

    const newLocale = isArabic ? "en" : "ar";
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "ar") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const target =
      segments.join("/") + window.location.search + window.location.hash;

    playSound();

    if (prefersReducedMotion()) {
      router.push(target);
      return;
    }

    isSwitchingRef.current = true;
    const el = createOverlay(newLocale);
    const { dir, band, panel, label } = layers(el);

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

    // safety net: لو الـ navigation فشل ما نسيبش الشاشة مغطاة
    window.setTimeout(() => {
      document.getElementById(OVERLAY_ID)?.remove();
      isSwitchingRef.current = false;
    }, 6000);
  };

  const btnBase =
    "group px-3.5 py-1.5 text-xs sm:text-sm rounded-xl border border-border bg-secondary/50 transition-colors duration-300 flex items-center gap-2 cursor-pointer shadow-sm";

  return (
    <nav
      ref={navRef}
      className="z-10 container w-full mx-auto mt-5 px-5 py-2.5 flex justify-between items-center bg-foreground/5 backdrop-blur-md text-foreground rounded-2xl border border-border shadow-lg"
    >
      <div data-nav-item className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-blue/40 shadow-[0_0_12px_var(--glow-blue)]">
          <Image
            src="/pictures/apple-touch-icon.png"
            alt={
              isArabic ? "محمد محمود أبو المجد" : "Mohamed Mahmoud Abo al magd"
            }
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </div>
        <span className="font-bold text-sm sm:text-base tracking-tight">
          {isArabic ? "محمد محمود أبو المجد" : "Mohamed Mahmoud Abo al magd"}
        </span>
      </div>

      <div data-nav-item className="flex items-center gap-2.5">
        <button
          ref={langBtnRef}
          onClick={handleLanguageToggle}
          className={`${btnBase} hover:bg-brand-blue/10 hover:border-brand-blue/50`}
          title="Switch Language"
        >
          <FontAwesomeIcon
            icon={faGlobe}
            className="text-brand-blue transition-transform duration-500 group-hover:rotate-180"
          />
          <span className="font-bold text-foreground">
            {isArabic ? "EN" : "AR"}
          </span>
        </button>

        <button
          ref={themeBtnRef}
          onClick={handleThemeToggle}
          className={`${btnBase} hover:bg-brand-violet/10 hover:border-brand-violet/50`}
          title="Toggle Theme"
        >
          {/* الأيقونتين فوق بعض، والتبديل بالـ rotate + scale */}
          <span className="relative inline-block h-4 w-4 text-brand-violet">
            <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
              <FontAwesomeIcon icon={faSun} />
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100">
              <FontAwesomeIcon icon={faMoon} />
            </span>
          </span>

          <span className="font-bold text-foreground">
            <span className="dark:hidden">Light</span>
            <span className="hidden dark:inline">Dark</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
