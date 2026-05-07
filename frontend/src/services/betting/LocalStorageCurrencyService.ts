import type { CurrencyService } from "./interfaces";
import { INITIAL_BALANCE } from "@/types/betting-history";

const STORAGE_KEY = "ccp_currency_balance";

function safeReadBalance(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return INITIAL_BALANCE;
    const parsed = parseFloat(raw);
    return isFinite(parsed) ? parsed : INITIAL_BALANCE;
  } catch {
    return INITIAL_BALANCE;
  }
}

function safeWriteBalance(balance: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(balance));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export class LocalStorageCurrencyService implements CurrencyService {
  getBalance(): number {
    return safeReadBalance();
  }

  deduct(amount: number): boolean {
    const current = safeReadBalance();
    if (amount <= 0 || amount > current) return false;
    safeWriteBalance(current - amount);
    return true;
  }

  credit(amount: number): void {
    if (amount <= 0) return;
    safeWriteBalance(safeReadBalance() + amount);
  }

  reset(): void {
    safeWriteBalance(INITIAL_BALANCE);
  }
}
