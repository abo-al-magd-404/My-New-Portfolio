import type { Role } from "./director";

export type Item = {
  el: HTMLElement;
  role: Role | "cluster";
  kids?: HTMLElement[];
  override?: string;
};

const MAX_ITEMS = 80;
const TEXT = new Set([
  "p",
  "li",
  "blockquote",
  "label",
  "figcaption",
  "dt",
  "dd",
]);
const MEDIA = new Set(["img", "picture", "video", "figure"]);
const ACTION = new Set(["button", "a", "input", "textarea", "select"]);
const BLOCK = new Set(["table", "form", "pre", "details", "iframe"]);

function shouldSkip(el: HTMLElement): boolean {
  if (el.closest("[data-no-motion], [data-motion-pending]")) return true;
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden") return true;
  return (
    cs.position === "fixed" ||
    cs.position === "absolute" ||
    cs.position === "sticky"
  );
}

function detectCluster(el: HTMLElement): HTMLElement[] | null {
  const kids = Array.from(el.children).filter(
    (c): c is HTMLElement => c instanceof HTMLElement && !shouldSkip(c),
  );
  if (kids.length < 3) return null;
  const signature = kids[0].tagName + kids[0].className;
  return kids.every((k) => k.tagName + k.className === signature) ? kids : null;
}

export function scan(root: HTMLElement): Item[] {
  const out: Item[] = [];

  const walk = (parent: HTMLElement) => {
    for (const el of Array.from(parent.children)) {
      if (out.length >= MAX_ITEMS) return;
      if (!(el instanceof HTMLElement) || shouldSkip(el)) continue;

      const tag = el.tagName.toLowerCase();
      const override = el.dataset.motion;

      if (/^h[1-6]$/.test(tag)) out.push({ el, role: "heading", override });
      else if (TEXT.has(tag)) out.push({ el, role: "text", override });
      else if (MEDIA.has(tag)) out.push({ el, role: "media", override });
      else if (ACTION.has(tag)) out.push({ el, role: "action", override });
      else if (BLOCK.has(tag)) out.push({ el, role: "block", override });
      else {
        const kids = detectCluster(el);
        if (kids) out.push({ el, role: "cluster", kids });
        else if (el.children.length === 0) {
          if (el.textContent?.trim()) out.push({ el, role: "text", override });
        } else walk(el);
      }
    }
  };

  walk(root);
  return out;
}
