import type { Friend, ActivityItem, HeadToHead } from "@/types/friend";
import type { User } from "@/types/user";

export type Ticker = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  sparkline: number[];
};

export type AIInsight = {
  suggestion: "Up" | "Down";
  confidence: number;
  rationale: string[];
  sources: string[];
};

export type LeaderboardRow = {
  rank: number;
  name: string;
  streak: number;
  accuracy: string;
  coins: number;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type WatchlistTicker = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  pnl: number;
  sparkline: number[];
};

export type TrendingPick = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  morePct: number;
  aiConfidence: number;
  aiDirection: "MORE" | "LESS";
  sparkline: number[];
};

export const tickers: Ticker[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    price: "$189.32",
    change: "+1.2%",
    sparkline: [92, 95, 91, 96, 101, 98, 104, 110]
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: "$243.80",
    change: "-0.7%",
    sparkline: [120, 118, 116, 114, 116, 111, 109, 112]
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: "$416.12",
    change: "+0.4%",
    sparkline: [80, 82, 85, 84, 88, 92, 91, 95]
  }
];

export const aiInsights: Record<string, AIInsight> = {
  AAPL: {
    suggestion: "Up",
    confidence: 62,
    rationale: [
      "Price is holding above a recent consolidation range.",
      "Sector momentum remains steady into the close."
    ],
    sources: [
      "Company Investor Relations",
      "SEC filings",
      "Earnings call transcript",
      "Major financial news"
    ]
  },
  TSLA: {
    suggestion: "Down",
    confidence: 55,
    rationale: [
      "Volatility remains elevated after recent swings.",
      "Short-term sentiment looks mixed intraday."
    ],
    sources: [
      "Company Investor Relations",
      "SEC filings",
      "Earnings call transcript",
      "Major financial news"
    ]
  },
  MSFT: {
    suggestion: "Up",
    confidence: 58,
    rationale: [
      "Trendline support has held across multiple sessions.",
      "Large-cap tech flow is stabilizing."
    ],
    sources: [
      "Company Investor Relations",
      "SEC filings",
      "Earnings call transcript",
      "Major financial news"
    ]
  }
};

export const leaderboard: LeaderboardRow[] = [
  { rank: 1, name: "A. Park", streak: 9, accuracy: "68%", coins: 1920 },
  { rank: 2, name: "J. Davis", streak: 7, accuracy: "64%", coins: 1765 },
  { rank: 3, name: "T. Nguyen", streak: 6, accuracy: "62%", coins: 1650 },
  { rank: 4, name: "M. Patel", streak: 5, accuracy: "60%", coins: 1510 },
  { rank: 5, name: "S. Kim", streak: 4, accuracy: "59%", coins: 1435 }
];

export const faqs: FAQItem[] = [
  {
    question: "Is DubQuant only for UW students?",
    answer:
      "Yes. DubQuant is designed for the UW community and enrollment is limited to UW students."
  },
  {
    question: "Do I use real money?",
    answer:
      "No. It is a points-based simulation using DubCoins only."
  },
  {
    question: "How do daily allocations work?",
    answer:
      "You receive a fresh DubCoins allocation every morning and can place picks that day."
  },
  {
    question: "What counts as a win?",
    answer:
      "You win if your up or down prediction matches the close for that day."
  },
  {
    question: "Can I pick more than one stock?",
    answer:
      "You can allocate DubCoins across multiple picks, but each pick is binary: up or down."
  },
  {
    question: "Where does the market data come from?",
    answer:
      "DubQuant uses standard public market data providers. Exact sources are listed in-app."
  },
  {
    question: "Does AI make the picks for me?",
    answer:
      "No. AI is optional and only provides contextual hints you can choose to ignore."
  }
];

export const MOCK_USER: User = {
  id: "u1",
  username: "Isaiah",
  avatarInitials: "IR",
  balance: 500,
  streak: 7,
  rank: 4,
  accuracy: 68,
  xp: 2400,
  xpToNextLevel: 3000,
  level: 12,
};

export const MOCK_WATCHLIST_TICKERS: WatchlistTicker[] = [
  { symbol: "AAPL", name: "Apple", price: "$189.32", change: "+1.2%", pnl: 24, sparkline: [92,95,91,96,101,98,104,110] },
  { symbol: "TSLA", name: "Tesla", price: "$243.80", change: "-0.7%", pnl: -8, sparkline: [120,118,116,114,116,111,109,112] },
  { symbol: "MSFT", name: "Microsoft", price: "$416.12", change: "+0.4%", pnl: 12, sparkline: [80,82,85,84,88,92,91,95] },
  { symbol: "NVDA", name: "Nvidia", price: "$875.40", change: "+2.1%", pnl: 36, sparkline: [200,215,210,225,240,235,260,275] },
  { symbol: "AMZN", name: "Amazon", price: "$178.25", change: "-0.3%", pnl: -4, sparkline: [165,168,170,166,172,169,175,174] },
  { symbol: "META", name: "Meta", price: "$512.60", change: "+0.9%", pnl: 18, sparkline: [490,495,488,502,510,505,515,512] },
];

export const MOCK_TRENDING_PICKS: TrendingPick[] = [
  { symbol: "AAPL", name: "Apple", price: "$189.32", change: "+1.2%", morePct: 72, aiConfidence: 62, aiDirection: "MORE", sparkline: [92,95,91,96,101,98,104,110] },
  { symbol: "TSLA", name: "Tesla", price: "$243.80", change: "-0.7%", morePct: 38, aiConfidence: 55, aiDirection: "LESS", sparkline: [120,118,116,114,116,111,109,112] },
  { symbol: "MSFT", name: "Microsoft", price: "$416.12", change: "+0.4%", morePct: 65, aiConfidence: 58, aiDirection: "MORE", sparkline: [80,82,85,84,88,92,91,95] },
  { symbol: "NVDA", name: "Nvidia", price: "$875.40", change: "+2.1%", morePct: 81, aiConfidence: 74, aiDirection: "MORE", sparkline: [200,215,210,225,240,235,260,275] },
  { symbol: "AMZN", name: "Amazon", price: "$178.25", change: "-0.3%", morePct: 44, aiConfidence: 51, aiDirection: "LESS", sparkline: [165,168,170,166,172,169,175,174] },
  { symbol: "META", name: "Meta", price: "$512.60", change: "+0.9%", morePct: 68, aiConfidence: 63, aiDirection: "MORE", sparkline: [490,495,488,502,510,505,515,512] },
];

export const MOCK_FRIENDS: Friend[] = [
  { id: "f1", username: "A. Park", avatarInitials: "AP", rank: 1, accuracy: 68, streak: 9, coins: 1920 },
  { id: "f2", username: "J. Davis", avatarInitials: "JD", rank: 2, accuracy: 64, streak: 7, coins: 1765 },
  { id: "f3", username: "T. Nguyen", avatarInitials: "TN", rank: 3, accuracy: 62, streak: 6, coins: 1650 },
  { id: "u1", username: "Isaiah", avatarInitials: "IR", rank: 4, accuracy: 68, streak: 7, coins: 1580, isCurrentUser: true },
  { id: "f4", username: "M. Patel", avatarInitials: "MP", rank: 5, accuracy: 60, streak: 5, coins: 1510 },
  { id: "f5", username: "S. Kim", avatarInitials: "SK", rank: 6, accuracy: 59, streak: 4, coins: 1435 },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", friendUsername: "A. Park", friendInitials: "AP", symbol: "AAPL", direction: "MORE", stake: 100, outcome: "WIN", timestamp: "2m ago" },
  { id: "a2", friendUsername: "J. Davis", friendInitials: "JD", symbol: "TSLA", direction: "LESS", stake: 50, outcome: "PENDING", timestamp: "5m ago" },
  { id: "a3", friendUsername: "T. Nguyen", friendInitials: "TN", symbol: "NVDA", direction: "MORE", stake: 200, outcome: "WIN", timestamp: "12m ago" },
  { id: "a4", friendUsername: "M. Patel", friendInitials: "MP", symbol: "MSFT", direction: "MORE", stake: 75, outcome: "LOSS", timestamp: "18m ago" },
  { id: "a5", friendUsername: "S. Kim", friendInitials: "SK", symbol: "AMZN", direction: "LESS", stake: 150, outcome: "PENDING", timestamp: "24m ago" },
  { id: "a6", friendUsername: "A. Park", friendInitials: "AP", symbol: "META", direction: "MORE", stake: 100, outcome: "WIN", timestamp: "31m ago" },
  { id: "a7", friendUsername: "J. Davis", friendInitials: "JD", symbol: "AAPL", direction: "LESS", stake: 50, outcome: "LOSS", timestamp: "45m ago" },
  { id: "a8", friendUsername: "T. Nguyen", friendInitials: "TN", symbol: "TSLA", direction: "MORE", stake: 200, outcome: "WIN", timestamp: "1h ago" },
  { id: "a9", friendUsername: "M. Patel", friendInitials: "MP", symbol: "NVDA", direction: "LESS", stake: 75, outcome: "PENDING", timestamp: "1h ago" },
  { id: "a10", friendUsername: "S. Kim", friendInitials: "SK", symbol: "MSFT", direction: "MORE", stake: 150, outcome: "WIN", timestamp: "2h ago" },
];

export const MOCK_HEAD_TO_HEAD: HeadToHead = {
  opponent: { id: "f1", username: "A. Park", avatarInitials: "AP", rank: 1, accuracy: 68, streak: 9, coins: 1920 },
  userCorrect: 7,
  opponentCorrect: 5,
  userStreak: 7,
  opponentStreak: 9,
};
