export type SlipDirection = "MORE" | "LESS";

export type SlipPick = {
  symbol: string;
  name: string;
  direction: SlipDirection;
  price: string;
  stake: number;
};

export type Slip = {
  picks: SlipPick[];
  totalStake: number;
  potentialPayout: number;
};
