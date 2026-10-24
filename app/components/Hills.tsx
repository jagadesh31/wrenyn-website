"use client";

import { useEffect, useRef } from "react";
import { startHills } from "./hills-gl";

export default function Hills() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => (ref.current ? startHills(ref.current) : undefined), []);
  return <canvas ref={ref} className="hills" aria-hidden="true" />;
}
