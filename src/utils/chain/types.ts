export interface ChainConfig {
  chainId: string;
  rpcEndpoint: string;
  restEndpoint: string;
  prefix: string;
  gasPrice: string;
}

export interface QueryClient {
  queryContractSmart(contractAddr: string, queryMsg: object): Promise<any>;
}

export interface StakingQueryResponse {
  balance: string;
  rewards: {
    info: {
      token?: {
        contract_addr: string;
      };
      native_token?: {
        denom: string;
      };
    };
    amount: string;
  }[];
}

export interface StakingError extends Error {
  code?: number;
  contractError?: boolean;
}