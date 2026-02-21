"use client";

import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import { content } from "@/content/content";
import { tickers, aiInsights } from "@/content/mockData";
import { PredictionsConsole } from "@/components/PredictionsConsole";
import { useAudio } from "@/components/AudioController";

type HeroSectionProps = {
  onSignUp: () => void;
  onOpenHow: () => void;
  onOpenFAQ: () => void;
  onOpenLeaderboard: () => void;
};

export function HeroSection({ onSignUp, onOpenHow, onOpenFAQ, onOpenLeaderboard }: HeroSectionProps) {
  const { playSfx } = useAudio();

  return (
    <section className="flex flex-col items-center justify-center gap-12 lg:grid lg:grid-cols-2 lg:gap-16 relative z-10 w-full">

      {/* Title & Start Action */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">

        <div className="space-y-4">
          <p className="font-arcade text-xs text-secondary animate-pulse">
            CREDITS: 0
          </p>
          <h1 className="font-arcade text-5xl leading-tight text-text sm:text-6xl lg:text-7xl text-shadow-block">
            BEAT THE<br /> <span className="text-primary">MARKET</span>
          </h1>
          <p className="max-w-xl font-mono text-lg text-muted">
            Predict crypto paths. Win tokens. Climb the leaderboard.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-6 pt-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px 0px rgba(0,255,65,1)" }}
            type="button"
            onClick={() => { playSfx("start"); onSignUp(); }}
            onMouseEnter={() => playSfx("hover")}
            style={{ boxShadow: "6px 6px 0px 0px rgba(0,255,65,0.7)" }}
            className="group flex w-full max-w-sm items-center justify-center gap-3 border-[4px] border-up bg-up/10 px-8 py-5 font-arcade text-xl text-up transition-colors hover:bg-up/30 animate-blink"
          >
            <FiPlay className="text-2xl" />
            PRESS START
          </motion.button>

          {/* Secondary Arcade Menu */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 font-arcade text-[10px] text-muted pt-4 w-full max-w-sm">
            <button
              onClick={() => { playSfx("click"); onOpenLeaderboard(); }}
              onMouseEnter={() => playSfx("hover")}
              className="border-[2px] border-border bg-obsidian px-4 py-2 hover:border-xp hover:text-xp transition-colors"
            >
              HIGH SCORES
            </button>
            <button
              onClick={() => { playSfx("click"); onOpenHow(); }}
              onMouseEnter={() => playSfx("hover")}
              className="border-[2px] border-border bg-obsidian px-4 py-2 hover:border-primary hover:text-primary transition-colors"
            >
              HOW TO PLAY
            </button>
            <button
              onClick={() => { playSfx("click"); onOpenFAQ(); }}
              onMouseEnter={() => playSfx("hover")}
              className="border-[2px] border-border bg-obsidian px-4 py-2 hover:border-secondary hover:text-secondary transition-colors"
            >
              SYSTEM FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Gameplay Demo (Predictions Console) */}
      <div className="w-full relative z-10 flex justify-center lg:justify-end">
        <PredictionsConsole tickers={tickers} aiInsights={aiInsights} />
      </div>

    </section>
  );
}
