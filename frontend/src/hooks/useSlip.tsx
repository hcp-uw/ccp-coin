"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { SlipPick } from "@/types/slip";
import { randomId } from "@/lib/random";

export type PlacedPick = SlipPick & { betId: string };

export type SlipDirection = "MORE" | "LESS";

export type SlipState = {
  picks: SlipPick[];
  placedPicks: PlacedPick[];
};

type SlipAction =
  | { type: "ADD_PICK"; payload: SlipPick }
  | { type: "REMOVE_PICK"; payload: string }
  | { type: "CLEAR_SLIP" }
  | { type: "PLACE_BET" }
  | { type: "CLEAR_PLACED_PICKS" };

function slipReducer(state: SlipState, action: SlipAction): SlipState {
  switch (action.type) {
    case "ADD_PICK": {
      const existingIndex = state.picks.findIndex(p => p.symbol === action.payload.symbol);
      if (existingIndex >= 0) {
        const newPicks = [...state.picks];
        newPicks[existingIndex] = action.payload;
        return { picks: newPicks, placedPicks: state.placedPicks };
      }
      return { picks: [...state.picks, action.payload], placedPicks: state.placedPicks };
    }
    case "REMOVE_PICK":
      return {
        picks: state.picks.filter(p => p.symbol !== action.payload),
        placedPicks: state.placedPicks.filter(p => p.symbol !== action.payload),
      };
    case "CLEAR_SLIP":
      return { picks: [], placedPicks: [] };
    case "PLACE_BET": {
      const newPlaced = state.picks.map(pick => ({
        ...pick,
        betId: randomId(),
      }));
      return { picks: state.picks, placedPicks: [...state.placedPicks, ...newPlaced] };
    }
    case "CLEAR_PLACED_PICKS":
      return { picks: [], placedPicks: [] };
    default:
      return state;
  }
}

type SlipContextType = {
  state: SlipState;
  dispatch: React.Dispatch<SlipAction>;
};

export const SlipContext = createContext<SlipContextType | null>(null);

export function useSlip() {
  const context = useContext(SlipContext);
  if (!context) {
    throw new Error("useSlip must be used within SlipProvider");
  }
  return context;
}

type SlipProviderProps = {
  children: ReactNode;
};

export function SlipProvider({ children }: SlipProviderProps) {
  const [state, dispatch] = useReducer(slipReducer, { picks: [], placedPicks: [] });
  return (
    <SlipContext.Provider value={{ state, dispatch }}>
      {children}
    </SlipContext.Provider>
  );
}
