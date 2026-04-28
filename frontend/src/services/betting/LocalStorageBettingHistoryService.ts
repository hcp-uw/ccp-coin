import type { BettingHistoryService } from "./interfaces";
import type { Bet, BetOutcome } from "@/types/betting-history";

const STORAGE_KEY = "ccp_betting_history";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function safeReadHistory(): Bet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteHistory(bets: Bet[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export class LocalStorageBettingHistoryService implements BettingHistoryService {
  recordBet(betData: Omit<Bet, "id" | "createdAt">): Bet {
    const history = safeReadHistory();
    const bet: Bet = {
      ...betData,
      id: generateId(),
      createdAt: Date.now(),
    };
    history.unshift(bet);
    safeWriteHistory(history);
    return bet;
  }

  getHistory(): Bet[] {
    return safeReadHistory();
  }

  resolveBet(id: string, outcome: BetOutcome): void {
    const history = safeReadHistory();
    const index = history.findIndex((b) => b.id === id);
    if (index === -1) return;
    history[index] = {
      ...history[index],
      status: "RESOLVED",
      outcome,
      resolvedAt: Date.now(),
    };
    safeWriteHistory(history);
  }

  clearHistory(): void {
    safeWriteHistory([]);
  }
}
