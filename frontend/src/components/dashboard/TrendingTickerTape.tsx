"use client";

import type { TrendingPick } from "@/content/mockData";

export function TrendingTickerTape({ items }: { items: TrendingPick[] }) {
  return (
    <div className="border-y-[2px] border-border bg-surface/50 py-2 overflow-hidden relative mx-4 mt-4">
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center font-arcade text-[8px] text-primary bg-surface px-3 border-r-[2px] border-border">
        TRENDING NOW
      </div>
      <div
        className="flex gap-8 pl-36 pointer-events-none"
        style={{ animation: "ticker-scroll 30s linear infinite" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="font-arcade text-[10px] text-text">{item.symbol}</span>
            <span className="font-mono text-[10px] text-muted">{item.price}</span>
            <span className={`font-mono text-[10px] ${item.change.startsWith("+") ? "text-up" : "text-down"}`}>
              {item.change}
            </span>
            <span className="text-border font-mono text-[10px]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
