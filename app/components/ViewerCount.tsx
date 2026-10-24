"use client";

import { useEffect, useState } from "react";

let request: Promise<number | null> | null = null;

function loadViewers() {
  request ??= fetch("/api/views", { method: "POST" })
    .then((r) => r.json())
    .then((d: { viewers: number | null }) => d.viewers)
    .catch(() => null);
  return request;
}

export default function ViewerCount() {
  // undefined while loading, null if the count couldn't be loaded
  const [viewers, setViewers] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    loadViewers().then((v) => alive && setViewers(v));
    return () => { alive = false; };
  }, []);

  if (viewers === null) return null;
  return (
    <p className={`viewers${viewers === undefined ? " pending" : ""}`} aria-live="polite">
      <span className="live" aria-hidden="true" />
      {viewers === undefined ? (
        "Counting viewers"
      ) : (
        <>
          <b>{viewers.toLocaleString("en-US")}</b> {viewers === 1 ? "viewer" : "viewers"}
        </>
      )}
    </p>
  );
}
