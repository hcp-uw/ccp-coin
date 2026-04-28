import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalStorageBettingHistoryService } from "@/services/betting/LocalStorageBettingHistoryService";
import type { Bet } from "@/types/betting-history";

const STORAGE_KEY = "ccp_betting_history";

const makeBet = (overrides: Partial<Bet> = {}): Omit<Bet, "id" | "createdAt"> => ({
  symbol: "AAPL",
  name: "Apple Inc.",
  direction: "MORE",
  entryPrice: "185.50",
  stake: 10,
  odds: 2.0,
  potentialPayout: 20,
  status: "PENDING",
  ...overrides,
});

describe("LocalStorageBettingHistoryService", () => {
  let service: LocalStorageBettingHistoryService;

  beforeEach(() => {
    localStorage.clear();
    service = new LocalStorageBettingHistoryService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("recordBet", () => {
    it("returns a bet with an id and createdAt", () => {
      const betData = makeBet();
      const bet = service.recordBet(betData);
      expect(bet.id).toBeTruthy();
      expect(bet.createdAt).toBeGreaterThan(0);
    });

    it("appends the bet to history", () => {
      const bet = service.recordBet(makeBet());
      const history = service.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe(bet.id);
    });

    it("prepends new bets to history", () => {
      service.recordBet(makeBet({ symbol: "FIRST" }));
      const second = service.recordBet(makeBet({ symbol: "SECOND" }));
      const history = service.getHistory();
      expect(history[0].symbol).toBe("SECOND");
      expect(history[1].symbol).toBe("FIRST");
    });
  });

  describe("getHistory", () => {
    it("returns empty array when storage is empty", () => {
      expect(service.getHistory()).toHaveLength(0);
    });

    it("survives corrupt localStorage data", () => {
      localStorage.setItem(STORAGE_KEY, "not valid json");
      expect(service.getHistory()).toHaveLength(0);
    });

    it("survives non-array localStorage data", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bets: [] }));
      expect(service.getHistory()).toHaveLength(0);
    });
  });

  describe("resolveBet", () => {
    it("updates bet status to RESOLVED and sets outcome", () => {
      const bet = service.recordBet(makeBet());
      service.resolveBet(bet.id, "WIN");
      const history = service.getHistory();
      expect(history[0].status).toBe("RESOLVED");
      expect(history[0].outcome).toBe("WIN");
      expect(history[0].resolvedAt).toBeGreaterThan(0);
    });

    it("does nothing for unknown id", () => {
      service.recordBet(makeBet());
      expect(() => service.resolveBet("nonexistent", "LOSS")).not.toThrow();
      expect(service.getHistory()[0].status).toBe("PENDING");
    });
  });

  describe("clearHistory", () => {
    it("removes all bets", () => {
      service.recordBet(makeBet());
      service.recordBet(makeBet({ symbol: "TSLA" }));
      service.clearHistory();
      expect(service.getHistory()).toHaveLength(0);
    });
  });
});
