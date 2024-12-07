import { getAllPools, getStakerInfo, getStakerPosition, getPoolReserves } from './queries/poolQueries';
import { getTokenPrices } from './priceOracle';
import { resolveTokenFromContract, resolveTokenFromIBC } from '../tokenUtils';
import { assetRegistry } from '../assets/assetRegistry';

export interface LiquidityPosition {
  poolId: string;
  chainId: string;
  tokens: string[];
  stakedAmount: string;
  apr: number;
  tvl: number;
}

export interface LiquidityProvider {
  address: string;
  totalValueLocked: number;
  positions: LiquidityPosition[];
}

export async function getTopLiquidityProviders(
  chains = ['archway-1', 'neutron-1']
): Promise<LiquidityProvider[]> {
  // Initialize asset registry first
  await assetRegistry.initialize();
  
  const providersMap = new Map<string, LiquidityProvider>();

  for (const chainId of chains) {
    try {
      const pools = await getAllPools(chainId);
      
      for (const pool of pools) {
        if (!pool.stakingContract) continue;

        // Get stakers for this pool
        const { stakers } = await getStakerInfo(chainId, pool.stakingContract);
        if (!stakers.length) continue;

        const reserves = await getPoolReserves(chainId, pool.address);
        const tokens = reserves.map(asset => {
          if (asset.info.token?.contract_addr) {
            return resolveTokenFromContract(asset.info.token.contract_addr);
          }
          return resolveTokenFromIBC(asset.info.native_token?.denom || '');
        });

        const prices = await getTokenPrices(tokens);
        
        // Calculate pool TVL
        let poolTVL = 0;
        reserves.forEach((asset, i) => {
          const assetInfo = assetRegistry.resolveAsset(tokens[i]);
          if (!assetInfo) return;

          const amount = Number(asset.amount) / Math.pow(10, assetInfo.decimals);
          const price = prices[tokens[i]] || 0;
          poolTVL += (amount * price);
        });

        // Skip pools with no TVL
        if (poolTVL === 0) continue;

        // Process each staker
        for (const staker of stakers) {
          const position = await getStakerPosition(chainId, pool.stakingContract, staker);
          
          const stakerShare = Number(position.stakedAmount) / Number(pool.totalShares);
          const positionTVL = poolTVL * stakerShare;

          // Calculate APR based on reward rates and prices
          const apr = calculateAPR(position.rewards, prices, poolTVL);

          const provider = providersMap.get(staker) || {
            address: staker,
            totalValueLocked: 0,
            positions: []
          };

          provider.totalValueLocked += positionTVL;
          provider.positions.push({
            poolId: pool.address,
            chainId,
            tokens,
            stakedAmount: position.stakedAmount,
            apr,
            tvl: positionTVL
          });

          providersMap.set(staker, provider);
        }
      }
    } catch (error) {
      console.error(`Failed to process chain ${chainId}:`, error);
    }
  }

  return Array.from(providersMap.values())
    .sort((a, b) => b.totalValueLocked - a.totalValueLocked)
    .slice(0, 10);
}

function calculateAPR(
  rewards: any[],
  prices: Record<string, number>,
  poolTVL: number
): number {
  if (poolTVL === 0) return 0;

  const annualRewardValue = rewards.reduce((total, reward) => {
    const token = resolveTokenFromContract(reward.info.token?.contract_addr || '') ||
                 resolveTokenFromIBC(reward.info.native_token?.denom || '');
    const price = prices[token] || 0;
    
    const assetInfo = assetRegistry.resolveAsset(token);
    if (!assetInfo) return total;

    const amount = Number(reward.amount) / Math.pow(10, assetInfo.decimals);
    return total + (amount * price * 52); // Weekly rewards to annual
  }, 0);

  return (annualRewardValue / poolTVL) * 100;
}