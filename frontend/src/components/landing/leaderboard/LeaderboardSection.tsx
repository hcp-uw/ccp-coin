"use client";

import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";
import { leaderboard } from "@/content/mockData";
import { FadeIn } from "@/components/shared/FadeIn";

export function LeaderboardSection() {
  return (
    <div id="leaderboard" className="w-full">
      <div className="flex items-center gap-2 mb-4 border-[2px] border-border bg-obsidian px-4 py-2 font-arcade text-[8px] text-muted w-fit tracking-widest">
        <FiTrendingUp className="text-up" />
        LIVE DATA FEED
      </div>

      <div className="mt-4 overflow-x-auto" data-testid="leaderboard">
        <div className="min-w-[600px] border-[4px] border-xp bg-obsidian shadow-[8px_8px_0px_0px_rgba(255,215,0,0.3)]">
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_120px_150px] gap-4 border-b-[4px] border-xp bg-xp/10 px-6 py-4 font-arcade text-[10px] text-xp">
            <span>RANK</span>
            <span>PLAYER</span>
            <span>ACCURACY</span>
            <span className="text-right">SCORE</span>
          </div>

          {/* Table rows */}
          <div className="divide-y-[2px] divide-border bg-obsidian">
            {leaderboard.map((row) => (
              <motion.div
                key={row.rank}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                className={`grid grid-cols-[80px_1fr_120px_150px] items-center gap-4 px-6 py-4 text-sm font-mono transition-colors ${row.rank === 1 ? "bg-xp/5" : ""
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-arcade text-sm ${row.rank === 1 ? "text-xp animate-pulse" : "text-muted"}`}>
                    #{row.rank}
                  </span>
                </div>

                <div>
                  <p className={`font-arcade text-xs ${row.rank === 1 ? "text-text" : "text-text/80"}`}>{row.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-up font-bold">{row.accuracy}</span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="font-arcade text-base text-text">{row.coins}</span>
                  <span className="text-[10px] text-muted font-mono">DC</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
