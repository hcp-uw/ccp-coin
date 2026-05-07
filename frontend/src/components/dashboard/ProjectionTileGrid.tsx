"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HiBolt } from "react-icons/hi2";
import { ArcadeButton } from "@/components/shared/ArcadeButton";
import type { TrendingPick } from "@/content/mockData";
import type { SlipPick, SlipDirection } from "@/types/slip";
import { AiPredictionPopover } from "./AiPredictionPopover";

type ProjectionTileProps = {
  pick: TrendingPick;
  isSelected: boolean;
  selectedDirection: SlipDirection | null;
  onSelect: (symbol: string, direction: SlipDirection, price: string, name: string) => void;
  onDeselect: (symbol: string) => void;
  isPopoverOpen: boolean;
  onTogglePopover: () => void;
};

export function ProjectionTile({ pick, isSelected, selectedDirection, onSelect, onDeselect, isPopoverOpen, onTogglePopover }: ProjectionTileProps) {
  const baseBorderClass = "border-[2px] border-border bg-obsidian hover:border-primary/50 transition-colors";
  const selectedMoreClass = "border-primary shadow-[4px_4px_0px_0px_rgba(0,240,255,0.4)]";
  const selectedLessClass = "border-down shadow-[4px_4px_0px_0px_rgba(255,0,85,0.4)]";
  
  const borderClass = isSelected 
    ? (selectedDirection === "MORE" ? selectedMoreClass : selectedLessClass)
    : baseBorderClass;

  const handleMore = () => {
    onSelect(pick.symbol, "MORE", pick.price, pick.name);
  };

  const handleLess = () => {
    onSelect(pick.symbol, "LESS", pick.price, pick.name);
  };

  const handleDeselect = () => {
    onDeselect(pick.symbol);
  };

  return (
    <div className={`p-4 ${borderClass}`}>
      <div className="text-center mb-3">
        <span className="font-arcade text-sm text-text">{pick.symbol}</span>
      </div>

      <div className="text-center mb-3">
        <span className="font-arcade text-xl text-text">{pick.price}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1 relative">
            <span className="font-arcade text-[8px] text-secondary">AI</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] text-muted">{pick.aiConfidence}%</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onTogglePopover(); }}
                className={`flex items-center justify-center w-5 h-5 border-[2px] transition-colors ${
                  isPopoverOpen 
                    ? "border-secondary bg-secondary text-obsidian shadow-[0_0_10px_rgba(184,41,255,0.8)]" 
                    : "border-border bg-obsidian text-muted hover:border-text hover:text-text"
                }`}
              >
                <HiBolt size={10} />
              </button>
            </div>
            
            <AnimatePresence>
              {isPopoverOpen && pick.eodPrediction && (
                <AiPredictionPopover 
                  prediction={pick.eodPrediction} 
                  isOpen={isPopoverOpen} 
                  onClose={onTogglePopover} 
                />
              )}
            </AnimatePresence>
          </div>
          <div className="h-2 border-[2px] border-surface-2 bg-obsidian">
            <div 
              className="h-full bg-secondary" 
              style={{ width: `${pick.aiConfidence}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-arcade text-[8px] text-muted">COMM</span>
            <span className="font-mono text-[8px] text-muted">{pick.morePct}%</span>
          </div>
          <div className="h-2 border-[2px] border-surface-2 bg-obsidian">
            <div 
              className={`h-full ${pick.morePct > 50 ? "bg-up" : "bg-down"}`}
              style={{ width: `${pick.morePct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2" aria-label={`${pick.symbol} direction`} role="group">
        {isSelected && selectedDirection === "MORE" ? (
          <ArcadeButton
            variant="success"
            onClick={handleDeselect}
            className="flex-1 text-[8px] py-1"
            aria-pressed={true}
          >
            MORE ✓
          </ArcadeButton>
        ) : (
          <ArcadeButton
            variant="success"
            onClick={handleMore}
            className="flex-1 text-[8px] py-1"
            aria-pressed={selectedDirection === "MORE"}
          >
            MORE
          </ArcadeButton>
        )}
        {isSelected && selectedDirection === "LESS" ? (
          <ArcadeButton
            variant="danger"
            onClick={handleDeselect}
            className="flex-1 text-[8px] py-1"
            aria-pressed={true}
          >
            LESS ✓
          </ArcadeButton>
        ) : (
          <ArcadeButton
            variant="danger"
            onClick={handleLess}
            className="flex-1 text-[8px] py-1"
            aria-pressed={selectedDirection === "LESS"}
          >
            LESS
          </ArcadeButton>
        )}
      </div>
    </div>
  );
}

type ProjectionTileGridProps = {
  picks: TrendingPick[];
  selectedPicks: SlipPick[];
  onSelect: (symbol: string, direction: SlipDirection, price: string, name: string) => void;
  onDeselect: (symbol: string) => void;
};

export function ProjectionTileGrid({ picks, selectedPicks, onSelect, onDeselect }: ProjectionTileGridProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const selectedMap = new Map(selectedPicks.map(p => [p.symbol, p.direction]));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 py-4">
      {picks.map((pick) => {
        const isSelected = selectedMap.has(pick.symbol);
        const selectedDirection = selectedMap.get(pick.symbol) ?? null;
        
        return (
          <ProjectionTile
            key={pick.symbol}
            pick={pick}
            isSelected={isSelected}
            selectedDirection={selectedDirection}
            onSelect={onSelect}
            onDeselect={onDeselect}
            isPopoverOpen={openPopoverId === pick.symbol}
            onTogglePopover={() => setOpenPopoverId(prev => prev === pick.symbol ? null : pick.symbol)}
          />
        );
      })}
    </div>
  );
}
