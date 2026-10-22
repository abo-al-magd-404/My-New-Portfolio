"use client";

import { useEffect } from "react";
import { initInteractions } from "../../lib/motion/interactions";

export function MotionGlobal() {
  useEffect(() => initInteractions(), []);
  return null;
}
