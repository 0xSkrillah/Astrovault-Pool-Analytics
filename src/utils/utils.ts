
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidAddress(address: string): boolean {
  // Basic validation for Cosmos-based addresses
  return /^[a-z0-9]{39,59}$/.test(address);
}

export function formatError(error: any): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  return 'An unknown error occurred';
}
