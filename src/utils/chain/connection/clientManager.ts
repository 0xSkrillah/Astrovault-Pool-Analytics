import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { QueryClient } from '../types';
import { sleep } from '../../utils';

const CLIENT_TIMEOUT = 5000;
const MAX_AGE = 5 * 60 * 1000; // 5 minutes

interface CachedClient {
  client: QueryClient;
  timestamp: number;
}

export class ClientManager {
  private clients: Map<string, CachedClient> = new Map();

  async createClient(endpoint: string): Promise<QueryClient> {
    return Promise.race([
      CosmWasmClient.connect(endpoint),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Connection timeout to ${endpoint}`)), CLIENT_TIMEOUT);
      })
    ]);
  }

  setClient(endpoint: string, client: QueryClient): void {
    this.clients.set(endpoint, {
      client,
      timestamp: Date.now()
    });
  }

  getClient(endpoint: string): QueryClient | null {
    const cached = this.clients.get(endpoint);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > MAX_AGE) {
      this.clients.delete(endpoint);
      return null;
    }

    return cached.client;
  }

  clearClient(endpoint: string): void {
    this.clients.delete(endpoint);
  }
}