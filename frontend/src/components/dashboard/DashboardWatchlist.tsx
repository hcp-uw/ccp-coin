"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkline } from "@/components/shared/Sparkline";
import type { WatchlistTicker } from "@/content/mockData";

export function DashboardWatchlist({ tickers }: { tickers: WatchlistTicker[] }) {
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full border-r-[2px] border-border bg-obsidian overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-[2px] border-border px-4 h-12 shrink-0">
        <span className="border-[2px] border-border bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-muted"> WATCHLIST </span>
        <span className="border-[2px] border-primary bg-surface/60 px-2 py-1 font-arcade text-[8px] uppercase text-primary cursor-pointer hover:bg-primary/10 transition-colors">+ ADD</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto divide-y-[2px] divide-border">
        {tickers.map((ticker) => {
          const isActive = activeSymbol === ticker.symbol;
          return (
            <div
              key={ticker.symbol}
              className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
              }`}
              onClick={() => setActiveSymbol(isActive ? null : ticker.symbol)}
            >
              {isActive && (
                <motion.div
                  layoutId="watchlistActiveRow"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                />
              )}
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                <div className="min-w-0">
                  <span className="block font-arcade text-xs text-text">{ticker.symbol}</span>
                  <span className="block font-mono text-[10px] text-muted uppercase truncate">{ticker.name}</span>
                  <span className={`block font-arcade text-[8px] ${ticker.pnl >= 0 ? "text-up" : "text-down"}`}>
                    {ticker.pnl >= 0 ? "+" : ""}{ticker.pnl} DC
                  </span>
                </div>
                <Sparkline
                  points={ticker.sparkline}
                  symbol={ticker.symbol}
                  color={ticker.pnl >= 0 ? "up" : "down"}
                  className="h-6 w-16"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
