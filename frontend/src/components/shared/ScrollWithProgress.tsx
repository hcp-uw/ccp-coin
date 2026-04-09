"use client";

import { useRef, useState } from "react";

type ScrollWithProgressProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollWithProgress({ children, className }: ScrollWithProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="h-[2px] bg-surface shrink-0">
        <div
          className="h-full bg-primary"
          style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
        />
      </div>
      <div
        ref={ref}
        onScroll={handleScroll}
        className={`flex-1 min-h-0 overflow-y-auto ${className ?? ""}`}
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
