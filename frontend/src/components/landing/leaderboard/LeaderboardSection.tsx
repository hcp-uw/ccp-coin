"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import { leaderboard, type LeaderboardRow } from "@/content/mockData";

export function LeaderboardSection({ data, highlightRank, compact }: { data?: LeaderboardRow[]; highlightRank?: number; compact?: boolean } = {}) {
  const [query, setQuery] = useState("");
  const rows = data ?? leaderboard;
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(normalized) || String(row.rank).includes(normalized));
  }, [query, rows]);

  if (compact) {
    return (
      <div className="w-full border-[2px] border-xp bg-obsidian" data-testid="leaderboard">
        <div className="grid grid-cols-[40px_1fr] gap-3 border-b-[2px] border-xp bg-xp/10 px-3 py-2 font-arcade text-[8px] text-xp">
          <span>RANK</span>
          <span>PLAYER</span>
        </div>
        <div className="divide-y-[2px] divide-border">
          {filteredRows.map((row) => (
            <div
              key={row.rank}
              className={`grid grid-cols-[40px_1fr] items-center gap-3 px-3 py-2 ${row.rank === highlightRank ? "bg-primary/5 border-l-[2px] border-primary" : ""}`}
            >
              <span className={`font-arcade text-[8px] ${row.rank === 1 ? "text-xp" : "text-muted"}`}>#{row.rank}</span>
              <span className={`font-arcade text-[8px] truncate ${row.rank === 1 ? "text-text" : "text-text/80"}`}>{row.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="leaderboard" className="w-full">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2 border-[2px] border-border bg-obsidian px-4 py-2 font-arcade text-[8px] text-muted w-fit tracking-widest">
          <FiTrendingUp className="text-up" />
          LIVE DATA FEED
        </div>
        <label className="flex items-center gap-2 border-[2px] border-border bg-surface/60 px-4 py-3 text-muted focus-within:border-xp">
          <FiSearch className="shrink-0 text-xp" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search players"
            className="w-full bg-transparent font-mono text-sm text-text outline-none placeholder:text-muted"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto" data-testid="leaderboard">
        <div className="min-w-[280px] md:min-w-[600px] border-[4px] border-xp bg-obsidian shadow-[8px_8px_0px_0px_rgba(255,215,0,0.3)]">
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_120px_150px] gap-4 border-b-[4px] border-xp bg-xp/10 px-6 py-4 font-arcade text-[10px] text-xp">
            <span>RANK</span>
            <span>PLAYER</span>
            <span>ACCURACY</span>
            <span className="text-right">SCORE</span>
          </div>

          {/* Table rows */}
          <div className="divide-y-[2px] divide-border bg-obsidian">
            {filteredRows.map((row) => (
              <motion.div
                key={row.rank}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                className={`grid grid-cols-[80px_1fr_120px_150px] items-center gap-4 px-6 py-4 text-sm font-mono transition-colors ${[row.rank === 1 ? "bg-xp/5" : "", row.rank === highlightRank ? "bg-primary/5 border-l-[2px] border-primary" : ""].filter(Boolean).join(" ")}`}
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
