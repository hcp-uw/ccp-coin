"use client";

type DailyMissionStripProps = {
  current: number;
  total: number;
  label: string;
};

export function DailyMissionStrip({ current, total, label }: DailyMissionStripProps) {
  const isComplete = current >= total;
  const pct = Math.min(100, (current / total) * 100);

  return (
    <div
      className={`flex items-center gap-4 px-6 h-12 shrink-0 border-b-[2px] ${
        isComplete
          ? "border-up bg-up/5"
          : "border-xp bg-xp/5"
      }`}
    >
      <span className={`font-arcade text-[8px] shrink-0 ${isComplete ? "text-up" : "text-xp"}`}>
        [ DAILY MISSION ]
      </span>
      <span className="font-mono text-[10px] text-text flex-1">{label}</span>
      <span className={`font-arcade text-[8px] shrink-0 ${isComplete ? "text-up" : "text-xp"}`}>
        {current}/{total}
      </span>
      <div className="w-24 h-2 border-[2px] border-surface-2 bg-obsidian shrink-0">
        <div
          className={`h-full ${isComplete ? "bg-up" : "bg-xp"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
