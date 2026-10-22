"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { createPlan } from "../../lib/motion/director";
import { choreograph } from "../../lib/motion/choreograph";

export default function Template({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    let mm: ReturnType<typeof gsap.matchMedia> | undefined;
    const frame = window.requestAnimationFrame(() => {
      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        const plan = createPlan(pathname, dir);

        root.dataset.motionMood = plan.mood.name;
        root.dataset.motionSeed = String(plan.seed);

        return choreograph(root, plan);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      mm?.revert();
    };
  }, [pathname]);

  return <div ref={scope}>{children}</div>;
}
