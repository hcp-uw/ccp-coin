"use client";

import { LeaderboardSection } from "@/components/landing/leaderboard/LeaderboardSection";
import { leaderboard } from "@/content/mockData";

export default function LeaderboardPage() {
  return (
    <main className="flex-1 overflow-hidden px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
        <div className="border-[2px] border-border bg-obsidian px-4 py-3 font-arcade text-[8px] tracking-widest text-muted">
          HALL OF FAME
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <LeaderboardSection data={leaderboard} />
        </div>
      </div>
    </main>
  );
}
