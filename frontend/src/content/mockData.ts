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
