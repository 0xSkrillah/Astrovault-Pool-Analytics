import { AssetInfo } from './types';

class AssetRegistry {
  private assets: Map<string, AssetInfo> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const response = await fetch('https://ext.astrovault.io/asset');
      const data = await response.json();
      
      if (data.ok && Array.isArray(data.data)) {
        data.data.forEach(asset => {
          const key = this.getAssetKey(asset);
          this.assets.set(key, asset);

          // Also index by symbol for quick lookups
          this.assets.set(asset.symbol, asset);
        });
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize asset registry:', error);
      throw error;
    }
  }

  private getAssetKey(asset: AssetInfo): string {
    if (asset.address) return asset.address;
    if (asset.denom) return asset.denom;
    return asset.id;
  }

  getAssetByAddress(address: string): AssetInfo | undefined {
    return this.assets.get(address);
  }

  getAssetByDenom(denom: string): AssetInfo | undefined {
    return this.assets.get(denom);
  }

  getAssetBySymbol(symbol: string): AssetInfo | undefined {
    return this.assets.get(symbol);
  }

  resolveAsset(identifier: string): AssetInfo | undefined {
    return this.getAssetByAddress(identifier) || 
           this.getAssetByDenom(identifier) || 
           this.getAssetBySymbol(identifier);
  }
}

export const assetRegistry = new AssetRegistry();