
import { SlinkyPriceQuerier } from './chain/slinky';
import { PRICE_SYMBOLS } from './tokenMappings';

const priceQuerier = new SlinkyPriceQuerier();
const priceCache: Map<string, {price: number, timestamp: number}> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getTokenPrice(symbol: string): Promise<number | null> {
  const now = Date.now();
  const cached = priceCache.get(symbol);
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.price;
  }

  const priceSymbol = PRICE_SYMBOLS[symbol] || symbol;
  const price = await priceQuerier.getPrice(priceSymbol);
  
  if (price !== null) {
    priceCache.set(symbol, {
      price,
      timestamp: now
    });
  }

  return price;
}

export async function getTokenPrices(symbols: string[]): Promise<Record<string, number>> {
  const now = Date.now();
  const uncachedSymbols = symbols.filter(symbol => {
    const cached = priceCache.get(symbol);
    return !cached || (now - cached.timestamp) >= CACHE_DURATION;
  });

  if (uncachedSymbols.length > 0) {
    const priceSymbols = uncachedSymbols.map(s => PRICE_SYMBOLS[s] || s);
    const prices = await priceQuerier.getPrices(priceSymbols);
    
    for (const [symbol, price] of Object.entries(prices)) {
      const originalSymbol = uncachedSymbols[priceSymbols.indexOf(symbol)];
      priceCache.set(originalSymbol, {
        price,
        timestamp: now
      });
    }
  }

  const result: Record<string, number> = {};
  for (const symbol of symbols) {
    const cached = priceCache.get(symbol);
    if (cached) {
      result[symbol] = cached.price;
    }
  }
  
  return result;
}

export function calculateTVL(amount: string, price: number | null, decimals: number = 6): number {
  if (!price) return 0;
  return (parseFloat(amount) / Math.pow(10, decimals)) * price;
}
