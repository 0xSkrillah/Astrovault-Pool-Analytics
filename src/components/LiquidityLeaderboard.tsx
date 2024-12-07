import React, { useEffect, useState } from 'react';
import { getTopLiquidityProviders, LiquidityProvider } from '../utils/chain/liquidityProvider';
import { ProviderCard } from './ProviderCard';

export function LiquidityLeaderboard() {
  const [providers, setProviders] = useState<LiquidityProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const topProviders = await getTopLiquidityProviders();
      setProviders(topProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to fetch liquidity providers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {providers.map((provider, index) => (
        <ProviderCard
          key={provider.address}
          rank={index + 1}
          provider={provider}
        />
      ))}
    </div>
  );
}