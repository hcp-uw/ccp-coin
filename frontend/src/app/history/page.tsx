"use client";

import { useBettingHistory } from "@/hooks/useBettingHistory";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { FiClock, FiActivity } from "react-icons/fi";

export default function HistoryPage() {
  const { state: { bets } } = useBettingHistory();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center gap-3 border-b-[2px] border-border pb-4">
        <FiClock className="text-secondary w-6 h-6 animate-pulse" />
        <h1 className="font-arcade text-xl md:text-2xl text-text tracking-widest uppercase">
          Betting History
        </h1>
      </header>

      {bets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-[2px] border-dashed border-border/50 bg-surface/30">
          <FiActivity className="text-muted w-12 h-12 mb-4 opacity-50" />
          <p className="font-arcade text-muted text-sm text-center uppercase tracking-wider">
            NO_DATA_FOUND
          </p>
          <p className="text-muted/60 text-xs mt-2 max-w-sm text-center">
            System memory is empty. Awaiting first prediction sequence.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border-[2px] border-border bg-obsidian relative shadow-[0_0_15px_rgba(0,240,255,0.05)]">
          {/* CRT scanline overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-30 mix-blend-overlay"></div>

          <table className="w-full text-left border-collapse relative z-20 min-w-[800px]">
            <thead>
              <tr className="border-b-[2px] border-border bg-surface text-muted font-arcade text-[10px] uppercase tracking-wider">
                <th className="p-4 py-3">ASSET</th>
                <th className="p-4 py-3">TYPE</th>
                <th className="p-4 py-3 text-right">STRIKE</th>
                <th className="p-4 py-3 text-right">WAGER</th>
                <th className="p-4 py-3 text-right">PAYOUT</th>
                <th className="p-4 py-3 text-center">STATUS</th>
                <th className="p-4 py-3 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm divide-y-[1px] divide-border/30">
              {bets.map((bet, i) => {
                const isResolved = bet.status === "RESOLVED";
                const isWin = bet.outcome === "WIN";
                const isLoss = bet.outcome === "LOSS";
                const isRefund = bet.outcome === "REFUND";

                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    key={bet.id}
                    className="hover:bg-surface/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-arcade text-xs text-primary group-hover:animate-pulse">
                          {bet.symbol}
                        </span>
                        <span className="text-muted text-xs hidden sm:inline">
                          {bet.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-arcade text-[10px] px-2 py-1 border-[1px] ${
                          bet.direction === "MORE"
                            ? "text-up border-up/30 bg-up/5"
                            : "text-down border-down/30 bg-down/5"
                        }`}
                      >
                        {bet.direction}
                      </span>
                    </td>
                    <td className="p-4 text-right text-text/80">
                      {bet.entryPrice}
                    </td>
                    <td className="p-4 text-right font-arcade text-xs text-text">
                      {bet.stake.toLocaleString()} ₢
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-arcade text-xs text-xp">
                          {bet.potentialPayout.toLocaleString()} ₢
                        </span>
                        <span className="text-[10px] text-muted font-mono">
                          {bet.odds.toFixed(2)}x
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {!isResolved ? (
                        <span className="font-arcade text-[10px] text-secondary animate-pulse inline-block border-[1px] border-secondary/30 px-2 py-1 bg-secondary/5">
                          PENDING
                        </span>
                      ) : isWin ? (
                        <span className="font-arcade text-[10px] text-up inline-block border-[1px] border-up/30 px-2 py-1 bg-up/10 shadow-[0_0_8px_rgba(0,255,65,0.2)]">
                          WIN
                        </span>
                      ) : isLoss ? (
                        <span className="font-arcade text-[10px] text-down inline-block border-[1px] border-down/30 px-2 py-1 bg-down/5">
                          LOSS
                        </span>
                      ) : (
                        <span className="font-arcade text-[10px] text-muted inline-block border-[1px] border-muted/30 px-2 py-1 bg-surface">
                          REFUND
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right text-xs text-muted/80 whitespace-nowrap">
                      {formatDistanceToNow(bet.createdAt, { addSuffix: true })}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
