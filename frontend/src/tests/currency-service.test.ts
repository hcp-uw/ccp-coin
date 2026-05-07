import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalStorageCurrencyService } from "@/services/betting/LocalStorageCurrencyService";
import { INITIAL_BALANCE } from "@/types/betting-history";

const STORAGE_KEY = "ccp_currency_balance";

describe("LocalStorageCurrencyService", () => {
  let service: LocalStorageCurrencyService;

  beforeEach(() => {
    localStorage.clear();
    service = new LocalStorageCurrencyService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("getBalance", () => {
    it("returns INITIAL_BALANCE when storage is empty", () => {
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });

    it("survives corrupt localStorage data", () => {
      localStorage.setItem(STORAGE_KEY, "not a number");
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });

    it("survives non-numeric localStorage data", () => {
      localStorage.setItem(STORAGE_KEY, "abc");
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });
  });

  describe("deduct", () => {
    it("deducts amount from balance and returns true", () => {
      const result = service.deduct(50);
      expect(result).toBe(true);
      expect(service.getBalance()).toBe(INITIAL_BALANCE - 50);
    });

    it("returns false when amount exceeds balance", () => {
      const result = service.deduct(INITIAL_BALANCE + 1);
      expect(result).toBe(false);
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });

    it("returns false for zero amount", () => {
      expect(service.deduct(0)).toBe(false);
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });

    it("returns false for negative amount", () => {
      expect(service.deduct(-10)).toBe(false);
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });
  });

  describe("credit", () => {
    it("increases balance by amount", () => {
      service.credit(100);
      expect(service.getBalance()).toBe(INITIAL_BALANCE + 100);
    });

    it("does nothing for zero amount", () => {
      service.credit(0);
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });

    it("does nothing for negative amount", () => {
      service.credit(-50);
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });
  });

  describe("reset", () => {
    it("resets balance to INITIAL_BALANCE", () => {
      service.deduct(200);
      service.reset();
      expect(service.getBalance()).toBe(INITIAL_BALANCE);
    });
  });
});
