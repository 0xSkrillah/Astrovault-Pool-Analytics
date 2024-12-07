import { ConnectionManager } from './connection';
import { STAKING_QUERIES, parseStakingResponse } from './queries/stakingQueries';
import { StakingQueryResponse } from './types';
import { sleep } from '../utils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class CosmWasmQuerier {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = new ConnectionManager();
  }

  async queryContractSmart(
    chainId: string,
    contract: string,
    queryMsg: object
  ): Promise<any> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const client = await this.connectionManager.getClient(chainId);
        return await client.queryContractSmart(contract, queryMsg);
      } catch (error) {
        if (attempt === MAX_RETRIES) throw error;
        console.warn(`Query attempt ${attempt} failed, retrying...`);
        await sleep(RETRY_DELAY * attempt);
        this.connectionManager.clearClient(chainId);
      }
    }
  }

  async queryStakingPosition(
    chainId: string,
    stakingContract: string,
    walletAddress: string
  ): Promise<StakingQueryResponse> {
    try {
      const queryPromises = [
        this.queryContractSmart(chainId, stakingContract, STAKING_QUERIES.stakerInfo(walletAddress)),
        this.queryContractSmart(chainId, stakingContract, STAKING_QUERIES.stakerBalance(walletAddress)),
        this.queryContractSmart(chainId, stakingContract, STAKING_QUERIES.pendingRewards(walletAddress))
      ];

      const results = await Promise.allSettled(queryPromises);
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const response = result.value;
          if (response.staked_amount || response.balance || response.staking_amount) {
            return parseStakingResponse(response);
          }
        }
      }

      return {
        balance: '0',
        rewards: []
      };
    } catch (error) {
      console.error(`Query failed for ${stakingContract} on ${chainId}:`, error);
      return {
        balance: '0',
        rewards: []
      };
    }
  }
}