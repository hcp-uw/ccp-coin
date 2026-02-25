"use client";

import type { ActivityItem } from "@/types/friend";

type FriendActivityFeedProps = {
  activities: ActivityItem[];
};

export function FriendActivityFeed({ activities }: FriendActivityFeedProps) {
  const getOutcomeStyles = (outcome: ActivityItem["outcome"]) => {
    switch (outcome) {
      case "WIN":
        return "border-up text-up bg-up/10";
      case "LOSS":
        return "border-down text-down bg-down/10";
      case "PENDING":
      default:
        return "border-border text-muted";
    }
  };

  return (
    <div className="flex flex-col divide-y-[2px] divide-border">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02]">
          <div className="w-8 h-8 border-[2px] border-border bg-surface font-arcade text-[8px] text-primary flex items-center justify-center shrink-0">
            {activity.friendInitials}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-arcade text-[10px] text-text">{activity.friendUsername}</span>
              <span className="font-mono text-[8px] text-muted">→</span>
              <span className="font-arcade text-[10px] text-primary">{activity.symbol}</span>
              <span className={`font-arcade text-[8px] ${activity.direction === "MORE" ? "text-up" : "text-down"}`}>
                {activity.direction}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[8px] text-muted">{activity.stake} DC</span>
              <span className="font-mono text-[8px] text-muted">·</span>
              <span className="font-mono text-[8px] text-muted">{activity.timestamp}</span>
            </div>
          </div>

          <div className={`border-[2px] px-2 py-0.5 font-arcade text-[8px] shrink-0 ${getOutcomeStyles(activity.outcome)}`}>
            {activity.outcome}
          </div>
        </div>
      ))}
    </div>
  );
}
