"use client";

import { useEffect, useRef } from "react";

export default function MotionHydrationBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const boundary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boundary.current?.removeAttribute("data-motion-pending");
  }, []);

  return (
    <div ref={boundary} data-motion-pending="">
      {children}
    </div>
  );
}
