import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SpectreSDK, Strategy } from '../spectre-sdk';

export interface StrategyData {
  publicKey: string;
  trader: string;
  name: string;
  description: string;
  performanceFeeBps: number;
  totalSubscribers: number;
  totalVolumeTraded: number;
  totalFeesEarned: number;
  isActive: boolean;
  createdAt: number;
}

export function useStrategies() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadStrategies();
  }, [connection, wallet.publicKey]);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sdk = new SpectreSDK(connection, wallet);
      const fetchedStrategies = await sdk.getAllStrategies();
      
      const mappedStrategies: StrategyData[] = fetchedStrategies.map(s => ({
        publicKey: s.publicKey.toString(),
        trader: s.trader.toString(),
        name: s.name,
        description: s.description,
        performanceFeeBps: s.performanceFeeBps,
        totalSubscribers: s.totalSubscribers,
        totalVolumeTraded: s.totalVolumeTraded.toNumber(),
        totalFeesEarned: s.totalFeesEarned.toNumber(),
        isActive: s.isActive,
        createdAt: s.createdAt.toNumber(),
      }));
      
      setStrategies(mappedStrategies);
    } catch (err) {
      console.error('Failed to load strategies:', err);
      setError(err as Error);
      // Set empty array on error
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshStrategies = () => {
    loadStrategies();
  };

  return { strategies, loading, error, refreshStrategies };
}
