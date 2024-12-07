export const STAKING_QUERIES = {
  stakerInfo: (address: string) => ({
    staker_info: { staker: address }
  }),
  stakerBalance: (address: string) => ({
    balance: { address }
  }),
  pendingRewards: (address: string) => ({
    pending_rewards: { staker: address }
  })
} as const;

export function parseStakingResponse(response: any) {
  const balance = response.staked_amount || 
                 response.balance || 
                 response.staking_amount || 
                 '0';
                 
  const rewards = response.pending_rewards || 
                 response.rewards || 
                 response.unclaimed_rewards || 
                 [];

  return {
    balance,
    rewards: Array.isArray(rewards) ? rewards : []
  };
}