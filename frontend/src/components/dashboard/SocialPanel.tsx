"use client";

import { useState } from "react";
import { LeaderboardSection } from "@/components/landing/leaderboard/LeaderboardSection";
import { FriendActivityFeed } from "./FriendActivityFeed";
import { HeadToHeadCard } from "./HeadToHeadCard";
import type { Friend, ActivityItem, HeadToHead } from "@/types/friend";
import type { LeaderboardRow } from "@/content/mockData";

type SocialPanelProps = {
  friends: Friend[];
  activities: ActivityItem[];
  headToHead: HeadToHead;
  currentUserRank: number;
};

export function SocialPanel({ friends, activities, headToHead, currentUserRank }: SocialPanelProps) {
  const [activeTab, setActiveTab] = useState<"friends" | "feed">("friends");

  const leaderboardRows: LeaderboardRow[] = friends
    .filter(f => !f.isCurrentUser)
    .map(f => ({
      rank: f.rank,
      name: f.username,
      streak: f.streak,
      accuracy: `${f.accuracy}%`,
      coins: f.coins,
    }))
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col h-full border-l-[2px] border-border bg-obsidian overflow-hidden">
      <div className="grid grid-cols-2 border-b-[2px] border-border shrink-0">
        <button
          role="tab"
          aria-selected={activeTab === "friends"}
          onClick={() => setActiveTab("friends")}
          className={`py-3 font-arcade text-[8px] transition-colors ${
            activeTab === "friends"
              ? "text-primary border-b-[2px] border-primary bg-primary/5"
              : "text-muted hover:text-text"
          }`}
        >
          FRIENDS
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "feed"}
          onClick={() => setActiveTab("feed")}
          className={`py-3 font-arcade text-[8px] transition-colors ${
            activeTab === "feed"
              ? "text-primary border-b-[2px] border-primary bg-primary/5"
              : "text-muted hover:text-text"
          }`}
        >
          FEED
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "friends" ? (
          <div className="p-2">
            <LeaderboardSection data={leaderboardRows} highlightRank={currentUserRank} />
            <HeadToHeadCard headToHead={headToHead} />
          </div>
        ) : (
          <FriendActivityFeed activities={activities} />
        )}
      </div>
    </div>
  );
}
