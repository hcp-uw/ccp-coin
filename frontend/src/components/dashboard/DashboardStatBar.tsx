"use client";

import type { User } from "@/types/user";

export function DashboardStatBar({ user }: { user: User }) {
  const streakBorderClass =
    user.streak >= 10
      ? "border-secondary shadow-[4px_4px_0px_0px_rgba(184,41,255,0.4)]"
      : user.streak >= 5
      ? "border-xp shadow-[4px_4px_0px_0px_rgba(255,215,0,0.4)]"
      : "border-border";

  return (
    <div className="border-b-[2px] border-border bg-surface px-6 py-3 shrink-0">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="border-[2px] border-border bg-obsidian px-4 py-2 flex flex-col gap-1">
          <span className="font-arcade text-sm text-xp">{user.balance} DC</span>
          <span className="font-arcade text-[8px] text-muted uppercase">Balance</span>
        </div>
        <div className={`border-[2px] bg-obsidian px-4 py-2 flex flex-col gap-1 ${streakBorderClass}`}>
          <span className="font-arcade text-sm text-primary">{user.streak}x</span>
          <span className="font-arcade text-[8px] text-muted uppercase">Streak</span>
        </div>
        <div className="border-[2px] border-border bg-obsidian px-4 py-2 flex flex-col gap-1">
          <span className="font-arcade text-sm text-secondary">#{user.rank}</span>
          <span className="font-arcade text-[8px] text-muted uppercase">Rank</span>
        </div>
        <div className="border-[2px] border-border bg-obsidian px-4 py-2 flex flex-col gap-1">
          <span className="font-arcade text-sm text-up">{user.accuracy}%</span>
          <span className="font-arcade text-[8px] text-muted uppercase">Accuracy</span>
        </div>
      </div>
    </div>
  );
}
