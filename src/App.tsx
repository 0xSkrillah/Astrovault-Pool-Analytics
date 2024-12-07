import React from 'react';
import { TooltipProvider } from './components/ui/tooltip';
import { LiquidityLeaderboard } from './components/LiquidityLeaderboard';

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Astrovault Pool Detector</h1>
          </div>
          <LiquidityLeaderboard />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;