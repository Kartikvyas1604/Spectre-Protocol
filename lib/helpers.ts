import { BN } from '@coral-xyz/anchor';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Format lamports to SOL with decimal places
 */
export function formatSOL(lamports: number | BN, decimals: number = 2): string {
  const amount = typeof lamports === 'number' ? lamports : lamports.toNumber();
  return (amount / LAMPORTS_PER_SOL).toFixed(decimals);
}

/**
 * Format number to currency string
 */
export function formatCurrency(amount: number, currency: string = 'SOL'): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M ${currency}`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K ${currency}`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format basis points to percentage
 */
export function formatFeeBps(bps: number): string {
  return `${(bps / 100).toFixed(1)}%`;
}

/**
 * Shorten wallet address
 */
export function shortenAddress(address: PublicKey | string, chars: number = 4): string {
  const str = typeof address === 'string' ? address : address.toBase58();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

/**
 * Get Solana explorer URL
 */
export function getExplorerUrl(
  address: string,
  type: 'address' | 'tx' = 'address',
  cluster: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): string {
  const clusterParam = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `https://explorer.solana.com/${type}/${address}${clusterParam}`;
}

/**
 * Calculate P&L percentage
 */
export function calculatePnLPercentage(initial: BN, current: BN): number {
  if (initial.isZero()) return 0;
  const pnl = current.sub(initial);
  return (pnl.toNumber() / initial.toNumber()) * 100;
}

/**
 * Get color for P&L display
 */
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return 'text-green-400';
  if (pnl < 0) return 'text-red-400';
  return 'text-neutral-400';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
