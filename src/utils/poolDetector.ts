import { Pool, StakingPosition } from './types';
import { resolveTokenFromContract, resolveTokenFromIBC, resolveAssetName } from './tokenUtils';
import { CosmWasmQuerier } from './chain/cosmwasm';

export class PoolDetector {
  private pools: Pool[];
  private cosmWasmQuerier: CosmWasmQuerier;

  constructor(pools: Pool[]) {
    this.pools = pools.filter(pool => !pool.disabled);
    this.cosmWasmQuerier = new CosmWasmQuerier();
  }

  async getStakedPositions(walletAddress: string): Promise<StakingPosition[]> {
    const positions: StakingPosition[] = [];

    for (const pool of this.pools) {
      try {
        if (!pool.lp_staking || !pool.contextChainId) {
          continue;
        }

        const stakingResponse = await this.cosmWasmQuerier.queryStakingPosition(
          pool.contextChainId,
          pool.lp_staking,
          walletAddress
        );
        
        const balance = stakingResponse.balance;
        if (balance && balance !== '0') {
          const tokens = this.getPoolTokens(pool);
          
          positions.push({
            poolId: pool.poolId,
            uniqueId: `${pool.contextChainId}-${pool.poolId}`,
            stakedAmount: this.formatAmount(balance),
            rewards: (stakingResponse.rewards || []).map(reward => ({
              asset: this.resolveRewardAsset(reward.info),
              amount: this.formatAmount(reward.amount)
            })),
            apr: pool.percentageAPRs[0] || 0,
            tokens,
            chainId: pool.contextChainId
          });
        }
      } catch (error) {
        console.error(`Error querying pool ${pool.poolId}:`, error);
      }
    }

    return positions;
  }

  private getPoolTokens(pool: Pool): string[] {
    if (!pool.poolAssets) return ['UNKNOWN', 'UNKNOWN'];

    return pool.poolAssets.map(asset => {
      if (!asset.info) return 'UNKNOWN';
      
      if (asset.info.token?.contract_addr) {
        return resolveTokenFromContract(asset.info.token.contract_addr);
      } else if (asset.info.native_token?.denom) {
        return resolveTokenFromIBC(asset.info.native_token.denom);
      }
      return 'UNKNOWN';
    });
  }

  private resolveRewardAsset(info: any): string {
    if (!info) return 'UNKNOWN';
    
    if (info.token?.contract_addr) {
      return resolveTokenFromContract(info.token.contract_addr);
    }
    if (info.native_token?.denom) {
      return resolveTokenFromIBC(info.native_token.denom);
    }
    return 'UNKNOWN';
  }

  private formatAmount(amount: string): string {
    try {
      const num = parseFloat(amount);
      return num.toFixed(6);
    } catch {
      return '0.000000';
    }
  }
}