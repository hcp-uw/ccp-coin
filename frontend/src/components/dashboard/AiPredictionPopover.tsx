import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiBolt } from "react-icons/hi2";
import type { EodPrediction } from "@/content/mockData";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export const AiPredictionPopover = ({
  prediction,
  isOpen,
  onClose
}: {
  prediction: EodPrediction;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const popoverRef = useRef<HTMLDivElement>(null);

  useOutsideClick(popoverRef, () => {
    if (isOpen) onClose();
  });

  useEscapeKey(() => {
    if (isOpen) onClose();
  });

  return (
    <motion.div
      ref={popoverRef}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute right-0 top-6 z-20 mt-2 w-72 border-[2px] border-secondary bg-obsidian p-5 shadow-[4px_4px_0px_0px_rgba(184,41,255,0.5)] cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between border-b-[2px] border-secondary/30 pb-2">
        <div className="flex items-center gap-2 font-arcade text-[10px] text-secondary">
          <HiBolt />
          <span>AI PREDICTION</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="font-arcade text-[8px] text-muted hover:text-text">
          [ESC] CLOSE
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-arcade text-[8px] text-text">PREDICTION</span>
            <span className={`font-mono text-xs font-bold ${prediction.direction === "Up" ? "text-up" : "text-down"}`}>
              {prediction.direction.toUpperCase()}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-arcade text-[8px] text-text">CONFIDENCE</span>
            <span className="font-mono text-xs text-secondary font-bold">{prediction.confidence}%</span>
          </div>
          <div className="mt-2 h-2 w-full border-[2px] border-surface-2 bg-obsidian p-[1px]">
            <div
              className="h-full bg-secondary"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t-[2px] border-surface-2 pt-3">
          <div>
            <span className="font-arcade text-[8px] text-muted block mb-1">TARGET</span>
            <span className="font-mono text-[10px] text-text">{prediction.targetPrice}</span>
          </div>
          <div>
            <span className="font-arcade text-[8px] text-muted block mb-1">PROBABILITY</span>
            <span className="font-mono text-[10px] text-text">{prediction.profitProbability}%</span>
          </div>
        </div>

        <div className="border-t-[2px] border-surface-2 pt-3">
          <p className="font-arcade text-[8px] text-muted">ANALYSIS REQS:</p>
          <ul className="mt-2 space-y-2">
            {prediction.rationale.slice(0, 2).map((point, i) => (
              <li key={i} className="flex gap-2 font-mono text-[10px] text-text/90 uppercase">
                <span className="mt-1 block h-2 w-2 shrink-0 bg-border" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <span className="font-arcade text-[8px] text-muted block text-right">{prediction.timeframe}</span>
        </div>
      </div>
    </motion.div>
  );
};