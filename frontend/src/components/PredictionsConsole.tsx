"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { AIInsight, Ticker } from "@/content/mockData";

const focusableToggle = (value: "Up" | "Down") => value.toLowerCase();

const sparklinePath = (points: number[]) => {
  if (points.length === 0) return "";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 32 - ((point - min) / range) * 32;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

const Sparkline = ({ points }: { points: number[] }) => (
  <svg viewBox="0 0 100 32" className="h-8 w-24">
    <path
      d={sparklinePath(points)}
      fill="none"
      stroke="rgba(198,161,91,0.8)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

type PredictionsConsoleProps = {
  tickers: Ticker[];
  aiInsights: Record<string, AIInsight>;
};

export function PredictionsConsole({ tickers, aiInsights }: PredictionsConsoleProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeAI, setActiveAI] = useState<string | null>(null);
  const [toggles, setToggles] = useState<Record<string, "Up" | "Down">>(() =>
    Object.fromEntries(tickers.map((ticker) => [ticker.symbol, "Up"]))
  );

  const handleToggle = (symbol: string, value: "Up" | "Down") => {
    setToggles((prev) => ({ ...prev, [symbol]: value }));
  };

  const handleAI = (symbol: string) => {
    setActiveAI((prev) => (prev === symbol ? null : symbol));
  };

  const activeInsight = useMemo(() => {
    if (!activeAI) return null;
    return aiInsights[activeAI];
  }, [activeAI, aiInsights]);

  return (
    <div className="surface-card relative w-full max-w-xl overflow-visible rounded-[28px] border border-border bg-surface/80 p-6 shadow-glow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Today&apos;s Predictions</p>
          <h3 className="font-display text-xl text-text">Market Close Call</h3>
        </div>
        <div className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
          DubCoins: 500
        </div>
      </div>

      <div className="space-y-4 overflow-visible">
        {tickers.map((ticker) => {
          const isActive = activeAI === ticker.symbol;
          const insight = aiInsights[ticker.symbol];

          return (
            <div key={ticker.symbol} className="relative">
              <div
                className={`flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface-2/70 p-4 transition ${
                  isActive ? "border-gold/60 shadow-[0_0_0_1px_rgba(198,161,91,0.3)]" : ""
                }`}
              >
                <div className="min-w-[120px]">
                  <p className="font-display text-lg text-text">{ticker.symbol}</p>
                  <p className="text-xs text-muted">{ticker.name}</p>
                </div>
                <div>
                  <p className="text-sm text-text">{ticker.price}</p>
                  <p className={`text-xs ${ticker.change.startsWith("-") ? "text-down" : "text-up"}`}>
                    {ticker.change}
                  </p>
                </div>
                <Sparkline points={ticker.sparkline} />
                <div className="flex items-center gap-2 rounded-full border border-border bg-obsidian/60 p-1 text-xs">
                  {["Up", "Down"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleToggle(ticker.symbol, value as "Up" | "Down")}
                      className={`rounded-full px-3 py-1 transition ${
                        toggles[ticker.symbol] === value
                          ? value === "Up"
                            ? "bg-up/20 text-up"
                            : "bg-down/20 text-down"
                          : "text-muted"
                      }`}
                      aria-pressed={toggles[ticker.symbol] === value}
                      aria-label={`${ticker.symbol} ${focusableToggle(value as "Up" | "Down")}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted opacity-70"
                  disabled
                >
                  Wager DubCoins
                </button>
                <button
                  type="button"
                  onClick={() => handleAI(ticker.symbol)}
                  aria-label={`Open AI Insight for ${ticker.symbol}`}
                  aria-expanded={isActive}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 text-[10px] uppercase tracking-[0.2em] text-muted transition hover:text-text"
                >
                  AI
                </button>
              </div>

              <AnimatePresence>
                {isActive && insight ? (
                  <motion.div
                    key={`ai-${ticker.symbol}`}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                    className="relative mt-4 overflow-hidden rounded-2xl border border-border bg-obsidian/80 p-4 shadow-glow lg:absolute lg:left-[calc(100%+24px)] lg:top-0 lg:mt-0 lg:w-[320px]"
                    data-testid="ai-panel"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold via-purple to-transparent" />
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gold/15 blur-2xl" />
                    <div className="relative space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-muted">AI Insight</p>
                          <p className="font-display text-lg text-text">{ticker.symbol}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAI(null)}
                          className="text-xs text-muted hover:text-text"
                          aria-label="Close AI Insight"
                        >
                          Close
                        </button>
                      </div>

                      <div className="rounded-xl border border-border bg-surface/70 p-3">
                        <p className="text-sm text-text">
                          Suggestion: <span className={insight.suggestion === "Up" ? "text-up" : "text-down"}>{insight.suggestion}</span>
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-surface-2">
                            <div
                              className={`h-1.5 rounded-full ${
                                insight.suggestion === "Up" ? "bg-up" : "bg-down"
                              }`}
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted">{insight.confidence}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted">Why</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                          {insight.rationale.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="section-divider" />

                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted">Sources to explore</p>
                        <p className="mt-1 text-[11px] text-muted">Example sources</p>
                        <ul className="mt-2 space-y-1 text-sm text-text">
                          {insight.sources.map((source) => (
                            <li key={source} className="rounded-lg border border-border bg-surface/60 px-2 py-1">
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {activeInsight ? (
        <p className="mt-6 text-xs text-muted">
          AI insight is optional and contextual. Use it as a starting point, not a verdict.
        </p>
      ) : null}
    </div>
  );
}
