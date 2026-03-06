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
    <div className="flex flex-col h-full lg:border-l-[2px] border-border bg-obsidian overflow-hidden">
      <div className="grid grid-cols-2 shrink-0 h-12" role="tablist" aria-label="Social panel views">
        <button
          id="social-tab-friends"
          role="tab"
          aria-controls="social-panel-friends"
          aria-selected={activeTab === "friends"}
          tabIndex={activeTab === "friends" ? 0 : -1}
          onClick={() => setActiveTab("friends")}
          className={`h-full font-arcade text-[8px] transition-colors border-b-[2px] ${
            activeTab === "friends"
              ? "text-primary border-primary bg-primary/5"
              : "text-muted border-border hover:text-text"
          }`}
        >
          FRIENDS
        </button>
        <button
          id="social-tab-feed"
          role="tab"
          aria-controls="social-panel-feed"
          aria-selected={activeTab === "feed"}
          tabIndex={activeTab === "feed" ? 0 : -1}
          onClick={() => setActiveTab("feed")}
          className={`h-full font-arcade text-[8px] transition-colors border-b-[2px] ${
            activeTab === "feed"
              ? "text-primary border-primary bg-primary/5"
              : "text-muted border-border hover:text-text"
          }`}
        >
          FEED
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "friends" ? (
          <div
            id="social-panel-friends"
            role="tabpanel"
            aria-labelledby="social-tab-friends"
            className="px-3 py-2 pb-28 lg:pb-4"
          >
            <div className="flex items-center gap-2 mb-3 border-[2px] border-border bg-obsidian px-3 py-2 font-arcade text-[8px] text-muted w-full tracking-widest">
              <span className="text-up">↗</span>
              LIVE DATA FEED
            </div>
            <LeaderboardSection data={leaderboardRows} compact />
            <HeadToHeadCard headToHead={headToHead} />
          </div>
        ) : (
          <div
            id="social-panel-feed"
            role="tabpanel"
            aria-labelledby="social-tab-feed"
          >
            <FriendActivityFeed activities={activities} />
          </div>
        )}
      </div>
    </div>
  );
}
