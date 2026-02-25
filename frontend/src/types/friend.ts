import type { SlipDirection } from "./slip";

export type Friend = {
  id: string;
  username: string;
  avatarInitials: string;
  rank: number;
  accuracy: number;
  streak: number;
  coins: number;
  isCurrentUser?: boolean;
};

export type ActivityItem = {
  id: string;
  friendUsername: string;
  friendInitials: string;
  symbol: string;
  direction: SlipDirection;
  stake: number;
  outcome: "WIN" | "LOSS" | "PENDING";
  timestamp: string;
};

export type HeadToHead = {
  opponent: Friend;
  userCorrect: number;
  opponentCorrect: number;
  userStreak: number;
  opponentStreak: number;
};
