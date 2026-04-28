"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Bet,
  BetOutcome,
  BettingHistoryState,
  BettingHistoryAction,
} from "@/types/betting-history";
import type { BettingHistoryService } from "@/services/betting/interfaces";
import { getBettingHistoryService } from "@/services/betting";

function bettingHistoryReducer(
  state: BettingHistoryState,
  action: BettingHistoryAction
): BettingHistoryState {
  switch (action.type) {
    case "RECORD_BET":
      return { bets: [action.payload, ...state.bets] };
    case "RESOLVE_BET": {
      const bets = state.bets.map((b) =>
        b.id === action.payload.id
          ? { ...b, status: "RESOLVED" as const, outcome: action.payload.outcome, resolvedAt: Date.now() }
          : b
      );
      return { bets };
    }
    case "CLEAR_HISTORY":
      return { bets: [] };
    case "LOAD_HISTORY":
      return { bets: action.payload };
    default:
      return state;
  }
}

type BettingHistoryContextType = {
  state: BettingHistoryState;
  recordBet: (bet: Omit<Bet, "id" | "createdAt">) => Bet;
  resolveBet: (id: string, outcome: BetOutcome) => void;
  clearHistory: () => void;
};

export const BettingHistoryContext = createContext<BettingHistoryContextType | null>(null);

export function useBettingHistory(): BettingHistoryContextType {
  const context = useContext(BettingHistoryContext);
  if (!context) {
    throw new Error("useBettingHistory must be used within BettingHistoryProvider");
  }
  return context;
}

type BettingHistoryProviderProps = {
  children: ReactNode;
  service?: BettingHistoryService;
};

export function BettingHistoryProvider({
  children,
  service,
}: BettingHistoryProviderProps) {
  const bettingService = service ?? getBettingHistoryService();

  const [state, dispatch] = useReducer(bettingHistoryReducer, { bets: [] });

  useEffect(() => {
    dispatch({ type: "LOAD_HISTORY", payload: bettingService.getHistory() });
  }, [bettingService]);

  const recordBet = useCallback(
    (betData: Omit<Bet, "id" | "createdAt">) => {
      const bet = bettingService.recordBet(betData);
      dispatch({ type: "RECORD_BET", payload: bet });
      return bet;
    },
    [bettingService]
  );

  const resolveBet = useCallback(
    (id: string, outcome: BetOutcome) => {
      bettingService.resolveBet(id, outcome);
      dispatch({ type: "RESOLVE_BET", payload: { id, outcome } });
    },
    [bettingService]
  );

  const clearHistory = useCallback(() => {
    bettingService.clearHistory();
    dispatch({ type: "CLEAR_HISTORY" });
  }, [bettingService]);

  return (
    <BettingHistoryContext.Provider
      value={{ state, recordBet, resolveBet, clearHistory }}
    >
      {children}
    </BettingHistoryContext.Provider>
  );
}
