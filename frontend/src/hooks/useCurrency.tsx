"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { CurrencyState, CurrencyAction } from "@/types/betting-history";
import type { CurrencyService } from "@/services/betting/interfaces";
import { getCurrencyService } from "@/services/betting";

function currencyReducer(state: CurrencyState, action: CurrencyAction): CurrencyState {
  switch (action.type) {
    case "DEDUCT":
      return { balance: state.balance - action.payload };
    case "CREDIT":
      return { balance: state.balance + action.payload };
    case "SET_BALANCE":
      return { balance: action.payload };
    default:
      return state;
  }
}

type CurrencyContextType = {
  state: CurrencyState;
  deduct: (amount: number) => boolean;
  credit: (amount: number) => void;
  reset: () => void;
};

export const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

type CurrencyProviderProps = {
  children: ReactNode;
  service?: CurrencyService;
};

export function CurrencyProvider({ children, service }: CurrencyProviderProps) {
  const currencyService = service ?? getCurrencyService();

  const [state, dispatch] = useReducer(currencyReducer, {
    balance: currencyService.getBalance(),
  });

  const deduct = useCallback(
    (amount: number): boolean => {
      const success = currencyService.deduct(amount);
      if (success) {
        dispatch({ type: "DEDUCT", payload: amount });
      }
      return success;
    },
    [currencyService]
  );

  const credit = useCallback(
    (amount: number) => {
      currencyService.credit(amount);
      dispatch({ type: "CREDIT", payload: amount });
    },
    [currencyService]
  );

  const reset = useCallback(() => {
    currencyService.reset();
    dispatch({ type: "SET_BALANCE", payload: currencyService.getBalance() });
  }, [currencyService]);

  return (
    <CurrencyContext.Provider value={{ state, deduct, credit, reset }}>
      {children}
    </CurrencyContext.Provider>
  );
}
