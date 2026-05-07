export type BetOutcome = "WIN" | "LOSS" | "REFUND";

export type BetStatus = "PENDING" | "RESOLVED";

export type SlipDirection = "MORE" | "LESS";

export type Bet = {
  id: string;
  symbol: string;
  name: string;
  direction: SlipDirection;
  entryPrice: string;
  stake: number;
  odds: number;
  potentialPayout: number;
  status: BetStatus;
  outcome?: BetOutcome;
  createdAt: number;
  resolvedAt?: number;
};

export type BettingHistoryState = {
  bets: Bet[];
};

export type BettingHistoryAction =
  | { type: "RECORD_BET"; payload: Bet }
  | { type: "RESOLVE_BET"; payload: { id: string; outcome: BetOutcome } }
  | { type: "CLEAR_HISTORY" }
  | { type: "LOAD_HISTORY"; payload: Bet[] };

export type CurrencyState = {
  balance: number;
};

export type CurrencyAction =
  | { type: "DEDUCT"; payload: number }
  | { type: "CREDIT"; payload: number }
  | { type: "SET_BALANCE"; payload: number };

export const INITIAL_BALANCE = 500;
