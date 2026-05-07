import type { Bet, BetOutcome } from "@/types/betting-history";

export interface BettingHistoryService {
  recordBet(bet: Omit<Bet, "id" | "createdAt">): Bet;
  getHistory(): Bet[];
  resolveBet(id: string, outcome: BetOutcome): void;
  clearHistory(): void;
}

export interface CurrencyService {
  getBalance(): number;
  deduct(amount: number): boolean;
  credit(amount: number): void;
  reset(): void;
}
