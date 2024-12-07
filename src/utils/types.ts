export interface PriceData {
  price: string;
  decimals: number;
  timestamp: number;
}

export interface TokenInfo {
  symbol: string;
  decimals: number;
  price: number | null;
}