import { QueryClient } from './types';
import { ClientManager } from './connection/clientManager';
import { EndpointManager } from './connection/endpointManager';
import { sleep } from '../utils';

const RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

export class ConnectionManager {
  private clientManager: ClientManager;
  private endpointManager: EndpointManager;

  constructor() {
    this.clientManager = new ClientManager();
    this.endpointManager = new EndpointManager();
  }

  async getClient(chainId: string): Promise<QueryClient> {
    const endpoints = this.endpointManager.getEndpoints(chainId);
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      for (const endpoint of endpoints) {
        try {
          // Check for cached client first
          let client = this.clientManager.getClient(endpoint);
          
          if (!client) {
            client = await this.clientManager.createClient(endpoint);
            this.clientManager.setClient(endpoint, client);
          }

          this.endpointManager.recordSuccess(endpoint);
          return client;
        } catch (error) {
          console.warn(`Failed to connect to ${endpoint}:`, error);
          this.endpointManager.recordFailure(endpoint);
          this.clientManager.clearClient(endpoint);
          
          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAY * attempt);
          }
        }
      }
    }

    throw new Error(`Failed to connect to any RPC endpoint for ${chainId}`);
  }

  clearClient(chainId: string): void {
    const endpoints = this.endpointManager.getEndpoints(chainId);
    endpoints.forEach(endpoint => this.clientManager.clearClient(endpoint));
  }
}