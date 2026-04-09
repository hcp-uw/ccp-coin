"use client";

import type { HeadToHead } from "@/types/friend";

type HeadToHeadCardProps = {
  headToHead: HeadToHead;
};

export function HeadToHeadCard({ headToHead }: HeadToHeadCardProps) {
  const isUserWinning = headToHead.userCorrect > headToHead.opponentCorrect;
  const isOpponentWinning = headToHead.opponentCorrect > headToHead.userCorrect;
  const isTied = headToHead.userCorrect === headToHead.opponentCorrect;

  const statusClass = isUserWinning 
    ? "text-up" 
    : isOpponentWinning 
      ? "text-down" 
      : "text-muted";

  const statusText = isUserWinning 
    ? "YOU WIN" 
    : isOpponentWinning 
      ? "YOU LOSE" 
      : "TIED";

  return (
    <div className="border-[2px] border-secondary bg-obsidian shadow-[4px_4px_0px_0px_rgba(184,41,255,0.4)] p-4 mt-3">
      <div className="flex items-center justify-between mb-4">
        <span className="font-arcade text-[8px] text-secondary">HEAD TO HEAD</span>
        <span className={`font-arcade text-[8px] ${statusClass}`}>{statusText}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="w-10 h-10 border-[2px] border-border bg-surface font-arcade text-[8px] text-primary flex items-center justify-center mx-auto mb-2">
            YOU
          </div>
          <span className="font-arcade text-2xl text-text">{headToHead.userCorrect}</span>
          <div className="font-arcade text-[8px] text-primary mt-1">{headToHead.userStreak}x</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-arcade text-[8px] text-muted">VS</span>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 border-[2px] border-border bg-surface font-arcade text-[8px] text-secondary flex items-center justify-center mx-auto mb-2">
            {headToHead.opponent.avatarInitials}
          </div>
          <span className="font-arcade text-2xl text-text">{headToHead.opponentCorrect}</span>
          <div className="font-arcade text-[8px] text-secondary mt-1">{headToHead.opponentStreak}x</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-[2px] border-border">
        <span className="font-arcade text-[8px] text-muted">vs {headToHead.opponent.username}</span>
      </div>
    </div>
  );
}
