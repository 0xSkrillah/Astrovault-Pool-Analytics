export function calculateWeightedAverageAPR(positions: Array<{ stakedAmount: string; apr: number }>) {
  let totalValue = 0;
  let weightedSum = 0;

  positions.forEach(position => {
    const value = parseFloat(position.stakedAmount);
    totalValue += value;
    weightedSum += value * position.apr;
  });

  return totalValue > 0 ? weightedSum / totalValue : 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}