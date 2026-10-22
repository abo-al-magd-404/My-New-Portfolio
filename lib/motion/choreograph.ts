import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Move, Plan, Role } from "./director";
import { scan, type Item } from "./scanner";

gsap.registerPlugin(ScrollTrigger, SplitText);

const BASE = 0.9;
const START = "top 92%";
const CLEAR = "opacity,transform,filter,clipPath,transition,visibility";

export function choreograph(root: HTMLElement, plan: Plan): () => void {
  const { mood } = plan;
  const seen = new WeakSet<Element>();
  const prepared: HTMLElement[] = [];
  const triggers: ScrollTrigger[] = [];
  const splits: SplitText[] = [];
  const counters: Partial<Record<Role, number>> = {};
  const nextIndex = (r: Role) => (counters[r] = (counters[r] ?? -1) + 1);

  const duration = BASE * mood.tempo;
  const toVars = (move: Move): gsap.TweenVars => ({
    ease: mood.ease,
    ...move.to,
    duration,
    clearProps: CLEAR,
    overwrite: "auto",
  });

  const splitHeading = (el: HTMLElement, mode: "words" | "lines") => {
    let tween: gsap.core.Tween | undefined;
    let entered = false;
    let played = false;

    const split = SplitText.create(el, {
      type: mode,
      mask: mode,
      autoSplit: true,
      onSplit(self) {
        if (played) return;
        const parts = mode === "words" ? self.words : self.lines;
        gsap.set(parts, { yPercent: 115 });
        tween = gsap.to(parts, {
          yPercent: 0,
          duration,
          ease: mood.ease,
          stagger: { amount: Math.min(mood.amount, 0.09 * parts.length) },
          paused: true,
          onComplete: () => {
            played = true;
          },
        });
        if (entered) tween.play();
        return tween;
      },
    });
    splits.push(split);

    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: START,
        once: true,
        onEnter: () => {
          entered = true;
          tween?.play();
        },
      }),
    );
  };

  const animateCluster = (item: Item) => {
    const kids = item.kids!;
    const move = plan.pick("block", nextIndex("block"), item.override);
    gsap.set(kids, { ...move.from, transition: "none" });
    prepared.push(...kids);

    triggers.push(
      ScrollTrigger.create({
        trigger: item.el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(kids, {
            ...toVars(move),
            stagger: {
              amount: mood.amount,
              grid: "auto",
              from: plan.clusterFrom(),
            },
          }),
      }),
    );
  };

  const process = (): number => {
    const items = scan(root).filter((i) => !seen.has(i.el));
    const queue = new Map<HTMLElement, Move>();

    for (const item of items) {
      seen.add(item.el);

      if (item.role === "cluster") {
        animateCluster(item);
        continue;
      }

      const move = plan.pick(item.role, nextIndex(item.role), item.override);
      if (move.split) {
        splitHeading(item.el, move.split);
        continue;
      }
      gsap.set(item.el, { ...move.from, transition: "none" });
      prepared.push(item.el);
      queue.set(item.el, move);
    }

    if (queue.size) {
      const els = [...queue.keys()];
      triggers.push(
        ...ScrollTrigger.batch(els, {
          start: START,
          once: true,
          onEnter: (batch) =>
            batch.forEach((el, i) => {
              const step = Math.min(
                0.12,
                mood.amount / Math.max(batch.length, 1),
              );
              gsap.to(el, {
                ...toVars(queue.get(el as HTMLElement)!),
                delay: i * step,
              });
            }),
        }),
      );
    }
    return items.length;
  };

  process();

  let timer = 0;
  const observer = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (process()) ScrollTrigger.refresh();
    }, 150);
  });
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-motion-pending"],
  });

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
    triggers.forEach((t) => t.kill());
    splits.forEach((s) => s.revert());
    gsap.killTweensOf(prepared);
    gsap.set(prepared, { clearProps: CLEAR });
  };
}
