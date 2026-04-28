"use client";

import { useCallback, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { HiBolt } from "react-icons/hi2";
import type { TrendingPick } from "@/content/mockData";
import { AiPredictionPopover } from "@/components/dashboard/AiPredictionPopover";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useAudio } from "@/components/AudioController";
import { Sparkline } from "@/components/shared/Sparkline";

// --- Sub-components ---

type SegmentedToggleProps = {
  value: "Up" | "Down" | null;
  onChange: (val: "Up" | "Down") => void;
  playSfx: (type: "up" | "down" | "hover") => void;
};

const SegmentedToggle = ({ value, onChange, playSfx }: SegmentedToggleProps) => {
  return (
    <div role="radiogroup" aria-label="Prediction direction" className="flex gap-2 p-1">
      <button
        type="button"
        role="radio"
        aria-checked={value === "Up"}
        onMouseEnter={() => playSfx("hover")}
        onClick={(e) => { e.stopPropagation(); playSfx("up"); onChange("Up"); }}
        className={`border-[2px] px-3 py-1 font-arcade text-[10px] transition-all ${value === "Up"
          ? "border-up bg-up text-obsidian shadow-[0px_0px_10px_0px_rgba(0,255,65,0.8)]"
          : "border-border bg-obsidian text-muted hover:border-up/50 hover:text-up"
          }`}
      >
        UP
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "Down"}
        onMouseEnter={() => playSfx("hover")}
        onClick={(e) => { e.stopPropagation(); playSfx("down"); onChange("Down"); }}
        className={`border-[2px] px-3 py-1 font-arcade text-[10px] transition-all ${value === "Down"
          ? "border-down bg-down text-obsidian shadow-[0px_0px_10px_0px_rgba(255,0,85,0.8)]"
          : "border-border bg-obsidian text-muted hover:border-down/50 hover:text-down"
          }`}
      >
        DWN
      </button>
    </div>
  );
};

const StakeDropdown = ({ playSfx }: { playSfx: (type: "hover" | "click" | "up" | "down" | "start") => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stake, setStake] = useState<number | string>(50);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false), isOpen);
  useEscapeKey(() => setIsOpen(false), isOpen);

  const stakes = [10, 50, 100, 500, "MAX"];

  const handleSelect = (e: MouseEvent, val: number | string) => {
    e.stopPropagation();
    playSfx("click");
    setStake(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); playSfx("click"); setIsOpen(!isOpen); }}
        className={`flex items-center gap-2 border-[2px] px-3 py-1.5 font-arcade text-[8px] transition-colors ${isOpen ? "border-xp text-text bg-white/5" : "border-border bg-obsidian text-muted hover:border-xp hover:text-text"}`}
      >
        <span>STAKE: <span className="text-xp">{stake}</span></span>
        <FiChevronDown className={`opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 top-full z-20 mt-1 w-full border-[2px] border-xp bg-obsidian shadow-[4px_4px_0px_0px_rgba(255,215,0,0.3)]"
          >
            <div className="flex flex-col">
              {stakes.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={(e) => handleSelect(e, val)}
                  onMouseEnter={() => playSfx("hover")}
                  className={`px-3 py-2 text-left font-arcade text-[8px] hover:bg-white/10 ${stake === val ? "text-xp" : "text-muted"}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Component ---

type PredictionsConsoleProps = {
  picks: TrendingPick[];
};

export function PredictionsConsole({ picks }: PredictionsConsoleProps) {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [activeAI, setActiveAI] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, "Up" | "Down" | null>>({});

  const { playSfx } = useAudio();
  const consoleRef = useRef<HTMLDivElement>(null);

  const closeInteraction = useCallback(() => {
    setActiveRow(null);
    setActiveAI(null);
  }, []);

  useOutsideClick(consoleRef, closeInteraction, activeRow !== null);
  useEscapeKey(closeInteraction, activeRow !== null);

  const handleRowClick = (symbol: string) => {
    if (activeRow !== symbol) playSfx("click");
    setActiveRow(symbol);
  };

  const handleToggle = (symbol: string, value: "Up" | "Down") => {
    setPredictions(prev => ({ ...prev, [symbol]: value }));
  };

  const handleAI = (e: MouseEvent, symbol: string) => {
    e.stopPropagation();
    playSfx("click");
    setActiveAI(prev => prev === symbol ? null : symbol);
    setActiveRow(symbol); // Ensure row is active when AI is open
  };

  return (
    <div className="relative isolate w-full max-w-2xl" ref={consoleRef}>

      {/* Console Container */}
      <div className="border-[4px] border-primary bg-obsidian shadow-[12px_12px_0px_0px_rgba(0,240,255,0.2)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b-[4px] border-primary px-6 py-5 bg-primary/10">
          <div>
            <p className="font-arcade text-[8px] text-primary animate-pulse">SYSTEM: ONLINE</p>
            <h3 className="mt-2 font-arcade text-sm text-text">THE ARENA</h3>
          </div>
          <div className="flex items-center gap-2 border-[2px] border-up bg-obsidian px-3 py-1 font-arcade text-[8px] text-up">
            <div className="h-2 w-2 bg-up animate-blink" />
            LIVE MARKET
          </div>
        </div>

        {/* Stock List */}
        <div className="divide-y-[2px] divide-border bg-obsidian">
          {picks.map((ticker) => {
            const isActive = activeRow === ticker.symbol;
            const isAIOpen = activeAI === ticker.symbol;
            const prediction = predictions[ticker.symbol] ?? null;

            return (
              <div
                key={ticker.symbol}
                className={`relative transition-colors duration-0 ${isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
                  }`}
                onClick={() => handleRowClick(ticker.symbol)}
                onMouseEnter={() => !isActive && playSfx("hover")}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeRow"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  />
                )}

                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 md:grid-cols-[1.2fr_1.5fr_0.8fr_auto_auto_auto]">

                  {/* 1. Ticker Info */}
                  <div className="min-w-0">
                    <span className="block font-arcade text-sm text-text">{ticker.symbol}</span>
                    <span className="block truncate font-mono text-[10px] text-muted sm:max-w-[100px] uppercase">
                      {ticker.name}
                    </span>
                  </div>

                  {/* 2. Sparkline */}
                  <div className="hidden md:block">
                    <Sparkline points={ticker.sparkline} symbol={ticker.symbol} />
                  </div>

                  {/* 3. Price / Change - Right aligned on mobile */}
                  <div className="text-right md:text-left">
                    <span className="block font-mono text-sm font-bold text-text tabular-nums">{ticker.price}</span>
                    <span className={`block font-mono text-[10px] tabular-nums font-bold ${ticker.change.startsWith("-") ? "text-down" : "text-up"
                      }`}>
                      {ticker.change}
                    </span>
                  </div>

                  {/* 4. Stake Chip (Desktop) */}
                  <div className="hidden md:block">
                    <StakeDropdown playSfx={playSfx} />
                  </div>

                  {/* 5. Toggle */}
                  <div className="col-span-3 flex justify-end pt-2 sm:col-span-1 sm:pt-0 md:ml-0">
                    <SegmentedToggle
                      value={prediction}
                      onChange={(val) => handleToggle(ticker.symbol, val)}
                      playSfx={playSfx}
                    />
                  </div>

                  {/* 6. AI Button */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={(e) => handleAI(e, ticker.symbol)}
                      onMouseEnter={() => playSfx("hover")}
                      className={`flex h-8 w-8 items-center justify-center border-[2px] transition-colors ${isAIOpen
                        ? "border-secondary bg-secondary text-obsidian shadow-[0_0_10px_rgba(184,41,255,0.8)]"
                        : "border-border bg-obsidian text-muted hover:border-text hover:text-text"
                        }`}
                      aria-label="Toggle AI Insight"
                    >
                      <HiBolt size={14} />
                    </button>

                    <AnimatePresence>
                      {isAIOpen && (
                        <AiPredictionPopover
                          prediction={ticker.eodPrediction}
                          isOpen={isAIOpen}
                          onClose={() => setActiveAI(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t-[4px] border-primary bg-primary/5 px-6 py-4">
          <div className="flex items-center justify-between font-arcade text-[8px] text-muted">
            <span>NEXT MISSION: 14:02:10</span>
            <span className="text-xp">BALANCE: 500 DC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
