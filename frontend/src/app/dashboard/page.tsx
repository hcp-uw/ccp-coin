"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { DashboardWatchlist } from "@/components/dashboard/DashboardWatchlist";
import { DailyMissionStrip } from "@/components/dashboard/DailyMissionStrip";
import { TrendingTickerTape } from "@/components/dashboard/TrendingTickerTape";
import { ProjectionTileGrid } from "@/components/dashboard/ProjectionTileGrid";
import { SlipDrawer } from "@/components/dashboard/SlipDrawer";
import { SocialPanel } from "@/components/dashboard/SocialPanel";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { SlipProvider, useSlip } from "@/hooks/useSlip";
import { ScrollWithProgress } from "@/components/shared/ScrollWithProgress";
import {
  MOCK_USER,
  MOCK_WATCHLIST_TICKERS,
  MOCK_TRENDING_PICKS,
  MOCK_FRIENDS,
  MOCK_ACTIVITY,
  MOCK_HEAD_TO_HEAD,
} from "@/content/mockData";
import type { SlipDirection } from "@/types/slip";


export default function DashboardPage() {
  const [mobileView, setMobileView] = useState<"picks" | "watchlist" | "social">("picks");

  return (
    <SlipProvider>
      <DashboardContent mobileView={mobileView} onViewChange={setMobileView} />
    </SlipProvider>
  );
}

function DashboardContent({ 
  mobileView, 
  onViewChange 
}: { 
  mobileView: "picks" | "watchlist" | "social";
  onViewChange: (view: "picks" | "watchlist" | "social") => void;
}) {
  const { state, dispatch } = useSlip();
  const picks = state.picks;

  const handleSelectPick = (symbol: string, direction: SlipDirection, price: string, name: string) => {
    dispatch({
      type: "ADD_PICK",
      payload: { symbol, direction, price, stake: 100, name },
    });
  };

  const handleRemovePick = (symbol: string) => {
    dispatch({ type: "REMOVE_PICK", payload: symbol });
  };

  const handleClearSlip = () => {
    dispatch({ type: "CLEAR_SLIP" });
  };

  const handlePlaceBet = () => {
    console.log("Placing bet:", picks);
  };

  const scrollPb =
    picks.length === 0
      ? "pb-28"
      : picks.length <= 2
      ? "pb-32"
      : "pb-44";

  const renderCenterContent = () => (
    <section className="flex flex-col h-full">
      <DailyMissionStrip current={3} total={5} label="Place 5 predictions today" />
      <TrendingTickerTape items={MOCK_TRENDING_PICKS} />
      <ScrollWithProgress className={scrollPb}>
        <ProjectionTileGrid
          picks={MOCK_TRENDING_PICKS}
          selectedPicks={picks}
          onSelect={handleSelectPick}
          onDeselect={handleRemovePick}
        />
      </ScrollWithProgress>
    </section>
  );

  const renderWatchlist = () => (
    <DashboardWatchlist tickers={MOCK_WATCHLIST_TICKERS} />
  );

  const renderSocial = () => (
    <SocialPanel
      friends={MOCK_FRIENDS}
      activities={MOCK_ACTIVITY}
      headToHead={MOCK_HEAD_TO_HEAD}
      currentUserRank={MOCK_USER.rank}
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className="h-full grid grid-cols-1 lg:grid-cols-[260px_1fr_280px]">
        <div className="hidden lg:block h-full">
          {renderWatchlist()}
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {mobileView === "watchlist" && (
            <div className="flex-1 min-h-0 overflow-y-auto lg:hidden">
              {renderWatchlist()}
            </div>
          )}
          {mobileView === "social" && (
            <div className="flex-1 min-h-0 lg:hidden">
              {renderSocial()}
            </div>
          )}
          {mobileView === "picks" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {renderCenterContent()}
            </div>
          )}
        </div>

        <div className="hidden lg:block h-full">
          {renderSocial()}
        </div>
      </main>
      
      <SlipDrawer
        picks={picks}
        onRemovePick={handleRemovePick}
        onClearSlip={handleClearSlip}
        onPlaceBet={handlePlaceBet}
      />
      <MobileBottomNav activeView={mobileView} onViewChange={onViewChange} />
    </MotionConfig>
  );
}

export {};
