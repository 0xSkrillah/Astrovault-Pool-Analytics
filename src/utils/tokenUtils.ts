import { assetRegistry } from './assets/assetRegistry';

export function resolveTokenFromContract(contractAddr: string): string {
  const asset = assetRegistry.getAssetByAddress(contractAddr);
  return asset?.symbol || 'TOKEN';
}

export function resolveTokenFromIBC(ibcDenom: string): string {
  const asset = assetRegistry.getAssetByDenom(ibcDenom);
  return asset?.symbol || 'IBC';
}

export function resolveAssetName(asset: string): string {
  const assetInfo = assetRegistry.resolveAsset(asset);
  return assetInfo?.symbol || asset;
}

export function formatTokenPair(tokens: string[]): string {
  return tokens.join('-');
}