export interface AssetInfo {
  isNative: boolean;
  id: string;
  decimals: number;
  symbol: string;
  price: number;
  price_24h_change?: number;
  contextChainId: string;
  totalSupply: string;
  address?: string;
  denom?: string;
}

export interface AssetResponse {
  ok: boolean;
  data: AssetInfo[];
}