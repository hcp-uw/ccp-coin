"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArcadeButton } from "@/components/shared/ArcadeButton";
import type { SlipPick } from "@/types/slip";
import type { PlacedPick } from "@/hooks/useSlip";

type SlipDrawerProps = {
  picks: SlipPick[];
  placedPicks: PlacedPick[];
  onRemovePick: (symbol: string) => void;
  onClearSlip: () => void;
  onPlaceBet: () => { ok: false; reason: string } | { ok: true };
};

const multiplierMap: Record<number, number> = { 1: 2, 2: 3, 3: 5, 4: 8, 5: 12, 6: 18 };

function getMultiplier(n: number): number {
  return multiplierMap[n] || n * 3;
}

export function SlipDrawer({ picks, placedPicks, onRemovePick, onClearSlip, onPlaceBet }: SlipDrawerProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const totalStake = picks.reduce((sum, p) => sum + p.stake, 0);
  const multiplier = picks.length >= 1 ? getMultiplier(picks.length) : 1;
  const potentialPayout = totalStake * multiplier;
  const placedSymbols = new Set(placedPicks.map(p => p.symbol));

  const heightClass = picks.length === 0
    ? "h-14"
    : picks.length <= 2
    ? "h-28"
    : "h-40";

  const handlePlaceBet = () => {
    const result = onPlaceBet();
    if (!result.ok) {
      setFeedback(result.reason);
    } else {
      setFeedback("WAGER PLACED");
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <motion.div
      layout
      className={`fixed bottom-0 left-0 right-0 z-30 border-t-[4px] border-primary bg-obsidian shadow-[0px_-4px_0px_0px_rgba(0,240,255,0.3)] ${heightClass} overflow-hidden`}
    >
      {picks.length === 0 && placedPicks.length === 0 ? (
        <div className="flex items-center justify-center h-full px-6">
          <span className="font-arcade text-[10px] text-muted">[ YOUR SLIP ] — EMPTY</span>
        </div>
      ) : (
        <div className="flex flex-col h-full p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-arcade text-[8px] text-primary">[ YOUR SLIP ]</span>
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.span
                  key={feedback}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`font-arcade text-[8px] px-2 ${feedback === "WAGER PLACED" ? "text-up" : "text-down"}`}
                >
                  {feedback}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="flex gap-2">
              <ArcadeButton variant="danger" onClick={onClearSlip} className="text-[8px] px-2 py-1">
                CLEAR
              </ArcadeButton>
              <ArcadeButton
                variant="success"
                onClick={handlePlaceBet}
                disabled={picks.length === 0}
                className="text-[8px] px-2 py-1"
              >
                PLACE BET
              </ArcadeButton>
            </div>
          </div>

          <div className={`flex gap-2 overflow-x-auto ${picks.length > 3 ? "flex-wrap" : ""}`}>
            {placedPicks.map((pick) => (
              <div
                key={pick.betId}
                className={`flex items-center gap-2 border-[2px] px-3 py-2 font-arcade text-[8px] shrink-0 opacity-70 ${
                  pick.direction === "MORE"
                    ? "border-up bg-up/10 text-up"
                    : "border-down bg-down/10 text-down"
                }`}
              >
                <span>{pick.symbol}</span>
                <span className="text-[10px]">{pick.direction}</span>
                <span className="text-[10px]">{pick.stake} DC</span>
                <span className="text-[10px] text-xp">WAGERED</span>
              </div>
            ))}
            {picks.map((pick) => (
              <button
                key={pick.symbol}
                onClick={() => onRemovePick(pick.symbol)}
                className={`flex items-center gap-2 border-[2px] px-3 py-2 font-arcade text-[8px] shrink-0 cursor-pointer transition-colors ${
                  pick.direction === "MORE"
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                    : "border-down bg-down/10 text-down hover:bg-down/20"
                }`}
              >
                <span>{pick.symbol}</span>
                <span className="text-[10px]">{pick.direction}</span>
                <span className="text-[10px]">{pick.stake} DC</span>
              </button>
            ))}
          </div>

          {picks.length >= 3 && (
            <div className="mt-auto pt-2 border-t-[2px] border-border">
              <span className="font-arcade text-[10px] text-xp">
                PAYOUT: {multiplier}x → {potentialPayout} DC
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
