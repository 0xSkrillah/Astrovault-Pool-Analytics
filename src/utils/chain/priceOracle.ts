import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const SKIP_ORACLE = "neutron1ckehwwfgsqsxkzw3qxffw4f56zg8yqgm4x3fdwvjkw8xjqh5qszqc4zcvn";

export async function getTokenPrice(symbol: string): Promise<number | null> {
  try {
    const client = await CosmWasmClient.connect('https://rpc-neutron.imperator.co');
    const response = await client.queryContractSmart(SKIP_ORACLE, {
      price: { ticker: `${symbol}/USD` }
    });
    
    return Number(response.price) / Math.pow(10, response.decimals);
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

export async function getTokenPrices(symbols: string[]): Promise<Record<string, number>> {
  try {
    const client = await CosmWasmClient.connect('https://rpc-neutron.imperator.co');
    const tickers = symbols.map(s => `${s}/USD`);
    
    const response = await client.queryContractSmart(SKIP_ORACLE, {
      prices: { tickers }
    });

    const prices: Record<string, number> = {};
    
    for (const [ticker, data] of Object.entries(response.prices)) {
      const symbol = ticker.split('/')[0];
      prices[symbol] = Number(data.price) / Math.pow(10, data.decimals);
    }

    return prices;
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return {};
  }
}