"use client";

type MobileBottomNavProps = {
  activeView: "picks" | "watchlist" | "social";
  onViewChange: (view: "picks" | "watchlist" | "social") => void;
};

export function MobileBottomNav({ activeView, onViewChange }: MobileBottomNavProps) {
  const tabs: { id: "picks" | "watchlist" | "social"; label: string }[] = [
    { id: "picks", label: "PICKS" },
    { id: "watchlist", label: "WATCHLIST" },
    { id: "social", label: "SOCIAL" },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Dashboard sections"
      className="fixed bottom-14 left-0 right-0 z-20 border-t-[2px] border-border bg-obsidian lg:hidden"
    >
      <div className="grid grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`py-3 min-h-[44px] font-arcade text-[8px] transition-colors ${
              activeView === tab.id
                ? "text-primary bg-primary/5"
                : "text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
