import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { SpectreSDK, UserPosition } from '../spectre-sdk';

export interface PositionData {
  publicKey: string;
  user: string;
  strategy: string;
  initialBalance: number;
  currentBalance: number;
  totalFeesPaid: number;
  lastFeeSettlement: number;
  subscribedAt: number;
  isActive: boolean;
  profitLoss: number;
  profitLossPercent: number;
}

export function useUserPositions() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      loadPositions();
    } else {
      setPositions([]);
      setLoading(false);
    }
  }, [connection, wallet.publicKey]);

  const loadPositions = async () => {
    if (!wallet.publicKey) return;

    try {
      setLoading(true);
      setError(null);
      
      const sdk = new SpectreSDK(connection, wallet);
      const fetchedPositions = await sdk.getUserPositions(wallet.publicKey);
      
      const mappedPositions: PositionData[] = fetchedPositions.map(p => {
        const initial = p.initialBalance.toNumber();
        const current = p.currentBalance.toNumber();
        const profitLoss = current - initial;
        const profitLossPercent = initial > 0 ? (profitLoss / initial) * 100 : 0;
        
        return {
          publicKey: p.publicKey.toString(),
          user: p.user.toString(),
          strategy: p.strategy.toString(),
          initialBalance: initial,
          currentBalance: current,
          totalFeesPaid: p.totalFeesPaid.toNumber(),
          lastFeeSettlement: p.lastFeeSettlement.toNumber(),
          subscribedAt: p.subscribedAt.toNumber(),
          isActive: p.isActive,
          profitLoss,
          profitLossPercent,
        };
      });
      
      setPositions(mappedPositions);
    } catch (err) {
      console.error('Failed to load positions:', err);
      setError(err as Error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshPositions = () => {
    loadPositions();
  };

  return { positions, loading, error, refreshPositions };
}
