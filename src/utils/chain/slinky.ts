
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { CHAIN_CONFIGS } from './config';

const SLINKY_CONTRACT = "neutron1ckehwwfgsqsxkzw3qxffw4f56zg8yqgm4x3fdwvjkw8xjqh5qszqc4zcvn";

interface PriceData {
  price: string;
  decimals: number;
}

interface SlinkyPrice {
  price: number;
  timestamp: number;
}

export class SlinkyPriceQuerier {
  private client: CosmWasmClient | null = null;

  private async getClient(): Promise<CosmWasmClient> {
    if (!this.client) {
      const config = CHAIN_CONFIGS['neutron-1'];
      this.client = await CosmWasmClient.connect(config.rpcEndpoint);
    }
    return this.client;
  }

  async getPrice(symbol: string): Promise<number | null> {
    try {
      const client = await this.getClient();
      const response = await client.queryContractSmart(SLINKY_CONTRACT, {
        price: { ticker: symbol }
      });

      if (!response?.price) {
        return null;
      }

      const price = parseFloat(response.price) / Math.pow(10, response.decimals || 18);
      return price;
    } catch (error) {
      console.warn(`Failed to fetch Slinky price for ${symbol}:`, error);
      return null;
    }
  }

  async getPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      const client = await this.getClient();
      const response = await client.queryContractSmart(SLINKY_CONTRACT, {
        prices: { tickers: symbols }
      });

      const prices: Record<string, number> = {};
      
      if (response?.prices) {
        for (const [symbol, data] of Object.entries<PriceData>(response.prices)) {
          prices[symbol] = parseFloat(data.price) / Math.pow(10, data.decimals || 18);
        }
      }

      return prices;
    } catch (error) {
      console.warn('Failed to fetch Slinky prices:', error);
      return {};
    }
  }
}
