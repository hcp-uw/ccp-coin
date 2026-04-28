import type { BettingHistoryService, CurrencyService } from "./interfaces";
import { LocalStorageBettingHistoryService } from "./LocalStorageBettingHistoryService";
import { LocalStorageCurrencyService } from "./LocalStorageCurrencyService";

let bettingHistoryInstance: BettingHistoryService | null = null;
let currencyInstance: CurrencyService | null = null;

export function getBettingHistoryService(): BettingHistoryService {
  if (!bettingHistoryInstance) {
    bettingHistoryInstance = new LocalStorageBettingHistoryService();
  }
  return bettingHistoryInstance;
}

export function getCurrencyService(): CurrencyService {
  if (!currencyInstance) {
    currencyInstance = new LocalStorageCurrencyService();
  }
  return currencyInstance;
}

export type { BettingHistoryService, CurrencyService };
