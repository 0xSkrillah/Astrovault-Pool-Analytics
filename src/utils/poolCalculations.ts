import { AssetInfo } from './assets/types';

export interface PoolAsset {
  info: {
    token?: {
      contract_addr: string;
    };
    native_token?: {
      denom: string;
    };
  };
  amount: string;
}

export function calculatePoolTVL(
  pool: {
    poolAssets: PoolAsset[];
    totalShares?: string;
  },
  getAssetInfo: (asset: PoolAsset) => AssetInfo | undefined
): number {
  if (!pool.poolAssets || !pool.totalShares) return 0;

  let totalValue = 0;
  
  for (const asset of pool.poolAssets) {
    const assetInfo = getAssetInfo(asset);
    if (!assetInfo?.price) continue;

    const amount = parseFloat(asset.amount);
    const value = (amount / Math.pow(10, assetInfo.decimals)) * assetInfo.price;
    totalValue += value;
  }

  return totalValue;
}

export function calculateWeightedAverageAPR(positions: Array<{ stakedAmount: string; apr: number }>) {
  let totalValue = 0;
  let weightedSum = 0;

  positions.forEach(position => {
    const value = parseFloat(position.stakedAmount);
    totalValue += value;
    weightedSum += value * position.apr;
  });

  return totalValue > 0 ? weightedSum / totalValue : 0;
}

export function getAPRExplanation(positions: Array<{ stakedAmount: string; apr: number; tokens: string[] }>) {
  const total = positions.reduce((sum, pos) => sum + parseFloat(pos.stakedAmount), 0);
  
  const breakdown = positions.map(pos => {
    const amount = parseFloat(pos.stakedAmount);
    const weight = (amount / total) * 100;
    return `${pos.tokens.join('-')}: ${pos.apr}% × ${weight.toFixed(2)}% weight`;
  });

  return {
    formula: "Weighted APR = Σ(Pool APR × Pool TVL Weight)",
    breakdown,
    note: "Each pool's contribution is weighted by its share of your total TVL"
  };
}