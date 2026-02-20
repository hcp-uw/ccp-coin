"use client";

import { FiTrendingUp } from "react-icons/fi";
import { leaderboard } from "@/content/mockData";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

/**
 * Leaderboard section with clean table layout (no card wrappers).
 * Rank #1 gets a gold left-border accent.
 * Purple eyebrow treatment on header.
 */
export function LeaderboardSection() {
  return (
    <SectionWrapper id="leaderboard" className="purple-section-glow">
      <FadeIn className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Leaderboard preview</p>
          <h2 className="mt-2 font-display text-4xl text-text lg:text-5xl">
            UW daily standings
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-xs text-muted">
          <FiTrendingUp />
          Mocked sample
        </div>
      </FadeIn>

      <div className="mt-8 overflow-x-auto" data-testid="leaderboard">
        <div className="min-w-[500px]">
          {/* Table header */}
          <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 border-b border-gold/10 pb-3 text-xs uppercase tracking-[0.2em] text-muted">
            <span>Rank</span>
            <span>Student</span>
            <span>Streak</span>
            <span>DubCoins</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border">
            {leaderboard.map((row) => (
              <div
                key={row.rank}
                className={`grid grid-cols-[80px_1fr_120px_120px] items-center gap-4 py-4 text-sm ${
                  row.rank === 1 ? "border-l-2 border-l-gold/60 bg-gold/10 pl-4" : "pl-4"
                }`}
              >
                <span className="font-display text-lg text-text">#{row.rank}</span>
                <div>
                  <p className="text-text">{row.name}</p>
                  <p className="text-xs text-muted">Accuracy {row.accuracy}</p>
                </div>
                <span className="text-text">{row.streak} days</span>
                <span className="text-text">{row.coins}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
