import { CHAIN_CONFIGS, BACKUP_RPC_ENDPOINTS } from '../config';

interface EndpointStatus {
  endpoint: string;
  lastSuccess?: number;
  failures: number;
}

export class EndpointManager {
  private endpointStatus: Map<string, EndpointStatus[]> = new Map();

  constructor() {
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    Object.keys(CHAIN_CONFIGS).forEach(chainId => {
      const endpoints = [
        CHAIN_CONFIGS[chainId].rpcEndpoint,
        ...BACKUP_RPC_ENDPOINTS[chainId]
      ];

      this.endpointStatus.set(
        chainId,
        endpoints.map(endpoint => ({
          endpoint,
          failures: 0
        }))
      );
    });
  }

  getEndpoints(chainId: string): string[] {
    const status = this.endpointStatus.get(chainId) || [];
    return status
      .sort((a, b) => {
        // Prioritize endpoints with recent successes
        if (a.lastSuccess && b.lastSuccess) {
          return b.lastSuccess - a.lastSuccess;
        }
        // Then by number of failures
        return a.failures - b.failures;
      })
      .map(s => s.endpoint);
  }

  recordSuccess(endpoint: string): void {
    for (const status of this.endpointStatus.values()) {
      const endpointStatus = status.find(s => s.endpoint === endpoint);
      if (endpointStatus) {
        endpointStatus.lastSuccess = Date.now();
        endpointStatus.failures = 0;
        break;
      }
    }
  }

  recordFailure(endpoint: string): void {
    for (const status of this.endpointStatus.values()) {
      const endpointStatus = status.find(s => s.endpoint === endpoint);
      if (endpointStatus) {
        endpointStatus.failures++;
        break;
      }
    }
  }
}