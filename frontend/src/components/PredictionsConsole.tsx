"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiCpu, FiChevronDown } from "react-icons/fi";
import type { AIInsight, Ticker } from "@/content/mockData";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useEscapeKey } from "@/hooks/useEscapeKey";

// --- Sub-components ---

const Sparkline = ({ points, symbol }: { points: number[]; symbol: string }) => {
  if (points.length === 0) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  // Generate path data
  const coords = points.length === 1
    ? [{
      x: 50,
      y: 24 - ((points[0] - min) / range) * 24
    }]
    : points.map((point, index) => ({
      x: (index / (points.length - 1)) * 100,
      y: 24 - ((point - min) / range) * 24, // Keep within 24px height
    }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`)
    .join(" ");

  const areaPath = `${linePath} L100,32 L0,32 Z`;
  const gradientId = `spark-gradient-${symbol}`;

  return (
    <div className="h-8 w-24">
      <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-gold))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(var(--color-gold))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="rgb(var(--color-gold))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

type SegmentedToggleProps = {
  value: "Up" | "Down" | null;
  onChange: (val: "Up" | "Down") => void;
  label?: string;
};

const SegmentedToggle = ({ value, onChange, label }: SegmentedToggleProps) => {
  const labelPrefix = label ? `${label} ` : "";
  return (
    <div
      className="flex rounded-lg bg-surface-2/50 p-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange("Up"); }}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${value === "Up"
            ? "bg-up/10 text-up shadow-sm ring-1 ring-up/20"
            : "text-muted hover:text-text"
          }`}
        aria-pressed={value === "Up"}
        aria-label={`${labelPrefix}Up`}
      >
        Up
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onChange("Down"); }}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${value === "Down"
            ? "bg-down/10 text-down shadow-sm ring-1 ring-down/20"
            : "text-muted hover:text-text"
          }`}
        aria-pressed={value === "Down"}
        aria-label={`${labelPrefix}Down`}
      >
        Down
      </button>
    </div>
  );
};

const StakeChip = () => (
  <button
    type="button"
    onClick={(e) => e.stopPropagation()}
    className="flex items-center gap-2 rounded-lg border border-border/40 bg-surface/40 px-3 py-1.5 text-xs text-muted transition hover:border-gold/30 hover:text-text"
  >
    <span>Stake: <span className="font-semibold text-text tabular-nums">50</span></span>
    <FiChevronDown className="opacity-50" />
  </button>
);

const AIPopover = ({
  insight,
  symbol,
  onClose
}: {
  insight: AIInsight;
  symbol: string;
  onClose: () => void;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-purple/20 bg-obsidian/95 p-5 shadow-2xl backdrop-blur-xl"
      data-testid="ai-panel"
    >
      <div className="absolute inset-0 -z-10 rounded-2xl bg-purple/5" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple">
          <FiCpu />
          <span>AI Insight</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text">{symbol}</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-xs text-muted hover:text-text">
            Close
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-text">Signal Strength</span>
            <span className="font-mono text-xs text-gold">{insight.confidence}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className={`h-full ${insight.suggestion === "Up" ? "bg-up" : "bg-down"}`}
              style={{ width: `${insight.confidence}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-right font-medium">
            Suggestion: <span className={insight.suggestion === "Up" ? "text-up" : "text-down"}>{insight.suggestion}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted">Analysis</p>
          <ul className="mt-2 space-y-2">
            {insight.rationale.slice(0, 2).map((point, i) => (
              <li key={i} className="flex gap-2 text-xs text-text/80">
                <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-border" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

type PredictionsConsoleProps = {
  tickers: Ticker[];
  aiInsights: Record<string, AIInsight>;
};

export function PredictionsConsole({ tickers, aiInsights }: PredictionsConsoleProps) {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [activeAI, setActiveAI] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, "Up" | "Down" | null>>({});

  const consoleRef = useRef<HTMLDivElement>(null);

  const closeInteraction = useCallback(() => {
    setActiveRow(null);
    setActiveAI(null);
  }, []);

  useOutsideClick(consoleRef, closeInteraction, activeRow !== null);
  useEscapeKey(closeInteraction, activeRow !== null);

  const handleRowClick = (symbol: string) => {
    setActiveRow(symbol);
  };

  const handleToggle = (symbol: string, value: "Up" | "Down") => {
    setPredictions(prev => ({ ...prev, [symbol]: value }));
  };

  const handleAI = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    setActiveAI(prev => prev === symbol ? null : symbol);
    setActiveRow(symbol); // Ensure row is active when AI is open
  };

  return (
    <div className="relative isolate" ref={consoleRef}>
      {/* Background Aura */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-purple/5 blur-3xl transition-opacity duration-500" />

      {/* Console Container */}
      <div className="surface-card overflow-visible rounded-[24px] border border-border/60 bg-surface/90 backdrop-blur-md">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80">Market Close Call</p>
            <h3 className="mt-1 font-display text-lg text-text">Today&apos;s Predictions</h3>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-muted">
            <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Live Market
          </div>
        </div>

        {/* Stock List */}
        <div className="divide-y divide-white/5">
          {tickers.map((ticker) => {
            const isActive = activeRow === ticker.symbol;
            const isAIOpen = activeAI === ticker.symbol;
            const prediction = predictions[ticker.symbol] ?? null;

            return (
              <div
                key={ticker.symbol}
                className={`relative transition-colors duration-200 ${isActive ? "bg-purple/5" : "hover:bg-white/[0.02]"
                  }`}
                onClick={() => handleRowClick(ticker.symbol)}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeRow"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"
                  />
                )}

                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 md:grid-cols-[1.2fr_1.5fr_0.8fr_auto_auto_auto]">

                  {/* 1. Ticker Info */}
                  <div className="min-w-0">
                    <span className="block font-display text-base font-semibold text-text">{ticker.symbol}</span>
                    <span className="block truncate text-xs text-muted sm:max-w-[100px]">{ticker.name}</span>
                  </div>

                  {/* 2. Sparkline */}
                  <div className="hidden md:block">
                    <Sparkline points={ticker.sparkline} symbol={ticker.symbol} />
                  </div>

                  {/* 3. Price / Change - Right aligned on mobile */}
                  <div className="text-right md:text-left">
                    <span className="block text-sm font-medium text-text tabular-nums">{ticker.price}</span>
                    <span className={`block text-xs tabular-nums font-medium ${ticker.change.startsWith("-") ? "text-down" : "text-up"
                      }`}>
                      {ticker.change}
                    </span>
                  </div>

                  {/* 4. Stake Chip (Desktop) */}
                  <div className="hidden md:block">
                    <StakeChip />
                  </div>

                  {/* 5. Toggle */}
                  <div className="col-span-3 flex justify-end pt-2 sm:col-span-1 sm:pt-0 md:ml-0">
                    <SegmentedToggle
                      value={prediction}
                      onChange={(val) => handleToggle(ticker.symbol, val)}
                      label={ticker.symbol}
                    />
                  </div>

                  {/* 6. AI Button */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={(e) => handleAI(e, ticker.symbol)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${isAIOpen
                          ? "border-purple bg-purple/10 text-purple"
                          : "border-transparent text-muted hover:bg-white/5 hover:text-text"
                        }`}
                      aria-label={`Open AI insight for ${ticker.symbol}`}
                    >
                      <FiCpu size={14} />
                    </button>

                    <AnimatePresence>
                      {isAIOpen && (
                        <AIPopover
                          insight={aiInsights[ticker.symbol]}
                          symbol={ticker.symbol}
                          onClose={() => setActiveAI(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile AI/Stake Expansion (if needed, kept simple for now) */}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Next allocation in 14:02:10</span>
            <span className="tabular-nums">Balance: 500 DC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
