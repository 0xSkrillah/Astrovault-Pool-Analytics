import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { CHAIN_CONFIGS } from '../config';

const FACTORY_CONTRACTS = {
  'archway-1': 'archway1f6jlx7d5y9qcc3lzzqtcs5dlr5zw4q0kk5qh9k6d46v46q6t4d4qxw9k8s',
  'neutron-1': 'neutron1eeyntmsq448c68ez06jsy6h2mtjke5tpuplw4mkwqlg6qjyftrhqhrk2t5'
};

export interface PoolInfo {
  address: string;
  lpToken: string;
  assets: string[];
  totalShares: string;
  stakingContract?: string;
}

export async function getAllPools(chainId: string): Promise<PoolInfo[]> {
  try {
    const client = await CosmWasmClient.connect(CHAIN_CONFIGS[chainId].rpcEndpoint);
    const factoryContract = FACTORY_CONTRACTS[chainId];

    // Query all pools from factory
    const { pairs: pools } = await client.queryContractSmart(factoryContract, {
      pairs: { limit: 50 }
    });

    const poolInfos = await Promise.all(pools.map(async (poolAddr: string) => {
      try {
        // Query pool configuration
        const poolConfig = await client.queryContractSmart(poolAddr, {
          config: {}
        });

        // Query pool state
        const poolState = await client.queryContractSmart(poolAddr, {
          state: {}
        });

        // Query staking contract if it exists
        const stakingContract = await client.queryContractSmart(poolAddr, {
          staking_contract: {}
        }).catch(() => null);

        return {
          address: poolAddr,
          lpToken: poolConfig.lp_token_address,
          assets: poolState.assets.map(a => a.info),
          totalShares: poolState.total_shares,
          stakingContract: stakingContract?.address
        };
      } catch (error) {
        console.warn(`Failed to get info for pool ${poolAddr}:`, error);
        return null;
      }
    }));

    return poolInfos.filter((pool): pool is PoolInfo => pool !== null);
  } catch (error) {
    console.error(`Failed to get pools for ${chainId}:`, error);
    return [];
  }
}

export async function getStakerInfo(
  chainId: string, 
  stakingContract: string
): Promise<{ stakers: string[] }> {
  try {
    const client = await CosmWasmClient.connect(CHAIN_CONFIGS[chainId].rpcEndpoint);
    
    const response = await client.queryContractSmart(stakingContract, {
      list_stakers: { 
        limit: 20,
        start_after: null
      }
    });

    return {
      stakers: response.stakers
    };
  } catch (error) {
    console.error(`Failed to get stakers for ${stakingContract}:`, error);
    return { stakers: [] };
  }
}

export async function getStakerPosition(
  chainId: string,
  stakingContract: string,
  stakerAddress: string
) {
  try {
    const client = await CosmWasmClient.connect(CHAIN_CONFIGS[chainId].rpcEndpoint);
    
    const [stakeInfo, rewardsInfo] = await Promise.all([
      client.queryContractSmart(stakingContract, {
        staker_info: { 
          staker: stakerAddress 
        }
      }),
      client.queryContractSmart(stakingContract, {
        pending_rewards: { 
          staker: stakerAddress 
        }
      })
    ]);

    return {
      stakedAmount: stakeInfo.staked_amount,
      rewards: rewardsInfo.pending_rewards || []
    };
  } catch (error) {
    console.error(`Failed to get position for ${stakerAddress}:`, error);
    return {
      stakedAmount: "0",
      rewards: []
    };
  }
}

export async function getPoolReserves(
  chainId: string,
  poolAddress: string
) {
  try {
    const client = await CosmWasmClient.connect(CHAIN_CONFIGS[chainId].rpcEndpoint);
    
    const { assets } = await client.queryContractSmart(poolAddress, {
      state: {}
    });

    return assets;
  } catch (error) {
    console.error(`Failed to get reserves for ${poolAddress}:`, error);
    return [];
  }
}