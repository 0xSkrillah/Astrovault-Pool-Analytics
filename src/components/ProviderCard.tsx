import React from 'react';
import { Copy, ArrowUpRight, Info } from 'lucide-react';
import { calculateWeightedAverageAPR, getAPRExplanation } from '../utils/poolCalculations';
import { formatCurrency } from '../utils/calculations';
import { formatTokenPair } from '../utils/tokenUtils';
import { Tooltip } from './ui/tooltip';

interface Position {
  poolId: string;
  chainId: string;
  tokens: string[];
  stakedAmount: string;
  apr: number;
}

interface ProviderCardProps {
  address: string;
  totalValueLocked: number;
  positions: Position[];
  rank: number;
}

export function ProviderCard({ address, totalValueLocked, positions, rank }: ProviderCardProps) {
  const weightedAPR = calculateWeightedAverageAPR(positions);
  const aprExplanation = getAPRExplanation(positions);
  const poolNames = positions.map(p => formatTokenPair(p.tokens));

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-blue-600">#{rank}</span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">{address}</h3>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalValueLocked)}
            </p>
            <p className="text-sm text-gray-500">Total Value Locked</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Staking in:</p>
          <p className="text-sm text-gray-600">{poolNames.join(', ')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Total Pools</p>
            <p className="text-lg font-semibold text-gray-900">{positions.length}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-gray-700">Weighted APR</p>
              <Tooltip
                content={
                  <div className="space-y-2">
                    <p className="font-medium">{aprExplanation.formula}</p>
                    <div className="space-y-1">
                      {aprExplanation.breakdown.map((line, i) => (
                        <p key={i} className="text-xs">{line}</p>
                      ))}
                    </div>
                    <p className="text-xs italic mt-2">{aprExplanation.note}</p>
                  </div>
                }
              >
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {weightedAPR.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-2">
            {positions.map(position => (
              <a
                key={position.poolId}
                href={`https://app.astrovault.io/pool/${position.poolId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{formatTokenPair(position.tokens)}</p>
                  <p className="text-xs text-gray-600">APR: {position.apr.toFixed(2)}%</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}