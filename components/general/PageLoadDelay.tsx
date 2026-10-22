"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function PageLoadDelay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const hideAfterDelay = () => {
      timeoutId = setTimeout(() => setIsVisible(false), 1000);
    };

    if (document.readyState === "complete") {
      hideAfterDelay();
    } else {
      window.addEventListener("load", hideAfterDelay, { once: true });
    }

    return () => {
      window.removeEventListener("load", hideAfterDelay);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background">
      <LoadingScreen />
    </div>
  );
}
