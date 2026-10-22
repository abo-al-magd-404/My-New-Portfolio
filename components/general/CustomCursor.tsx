"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = 0.4;
    clickAudioRef.current = audio;

    const moveCursor = (x: number, y: number) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        cursor.style.opacity = "1";
      }
    };

    const hideCursor = () => {
      isVisibleRef.current = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const handleMouseMove = (event: MouseEvent) => {
      moveCursor(event.clientX, event.clientY);
    };

    const handleTouchStartOrMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      moveCursor(touch.clientX, touch.clientY);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };

    const handleTouchEnd = () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
      touchTimeoutRef.current = setTimeout(() => {
        hideCursor();
      }, 500);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      moveCursor(event.clientX, event.clientY);
    };

    const handleGlobalClick = () => {
      if (clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInputField && clickAudioRef.current) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", handleMouseEnter);

    window.addEventListener("touchstart", handleTouchStartOrMove);
    window.addEventListener("touchmove", handleTouchStartOrMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);

      window.removeEventListener("touchstart", handleTouchStartOrMove);
      window.removeEventListener("touchmove", handleTouchStartOrMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);

      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("keydown", handleGlobalKeyDown);

      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-1000 mix-blend-difference font-mono block transition-opacity duration-300"
      style={{
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        willChange: "transform",
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center font-mono select-none drop-shadow-[0_0_8px_var(--glow-blue)]">
        <span className="text-muted-foreground opacity-80 text-xl font-light transform scale-y-125 inline-block">
          [
        </span>
        <span className="text-lg leading-none text-brand-blue font-bold">
          +
        </span>
        <span className="text-muted-foreground opacity-80 text-xl font-light transform scale-y-125 inline-block">
          ]
        </span>
      </div>
    </div>
  );
}
