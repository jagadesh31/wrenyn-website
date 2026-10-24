import type { Ref } from "react";

export default function BirdMark({ className = "", ref }: { className?: string; ref?: Ref<HTMLSpanElement> }) {
  return (
    <span className={`bird idle ${className}`} ref={ref} aria-hidden="true">
      <img className="wing" src="/wrenyn-wing.png" alt="" draggable={false} />
      <img className="body" src="/wrenyn-body.png" alt="" draggable={false} />
    </span>
  );
}
