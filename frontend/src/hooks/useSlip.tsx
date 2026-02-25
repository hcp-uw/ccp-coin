"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { SlipPick, SlipDirection } from "@/types/slip";

type SlipState = {
  picks: SlipPick[];
};

type SlipAction =
  | { type: "ADD_PICK"; payload: SlipPick }
  | { type: "REMOVE_PICK"; payload: string }
  | { type: "CLEAR_SLIP" };

function slipReducer(state: SlipState, action: SlipAction): SlipState {
  switch (action.type) {
    case "ADD_PICK": {
      const existingIndex = state.picks.findIndex(p => p.symbol === action.payload.symbol);
      if (existingIndex >= 0) {
        const newPicks = [...state.picks];
        newPicks[existingIndex] = action.payload;
        return { picks: newPicks };
      }
      return { picks: [...state.picks, action.payload] };
    }
    case "REMOVE_PICK":
      return { picks: state.picks.filter(p => p.symbol !== action.payload) };
    case "CLEAR_SLIP":
      return { picks: [] };
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
  const [state, dispatch] = useReducer(slipReducer, { picks: [] });
  return (
    <SlipContext.Provider value={{ state, dispatch }}>
      {children}
    </SlipContext.Provider>
  );
}
