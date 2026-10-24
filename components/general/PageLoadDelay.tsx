"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function PageLoadDelay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let fadeTimeoutId: ReturnType<typeof setTimeout>;

    const hideAfterDelay = () => {
      timeoutId = setTimeout(() => {
        setIsFadingOut(true);

        fadeTimeoutId = setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }, 1500);
    };

    if (document.readyState === "complete") {
      hideAfterDelay();
    } else {
      window.addEventListener("load", hideAfterDelay, { once: true });
    }

    return () => {
      window.removeEventListener("load", hideAfterDelay);
      clearTimeout(timeoutId);
      clearTimeout(fadeTimeoutId);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <LoadingScreen />
    </div>
  );
}
