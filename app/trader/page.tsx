'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Zap,
  Shield,
  ArrowLeft,
  Loader2,
  Clock,
  Activity
} from 'lucide-react';
import { SpectreSDK } from '@/lib/spectre-sdk';
import { formatSOL, shortenAddress } from '@/lib/helpers';
import { useRouter } from 'next/navigation';

export default function TraderDashboard() {
  const router = useRouter();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [myStrategy, setMyStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  
  // Trade form state
  const [asset, setAsset] = useState('SOL/USDC');
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  useEffect(() => {
    loadTraderStrategy();
  }, [wallet.publicKey]);

  const loadTraderStrategy = async () => {
    if (!wallet.publicKey) {
      setLoading(false);
      return;
    }

    try {
      const sdk = new SpectreSDK(connection, wallet);
      const strategies = await sdk.getAllStrategies();
      
      // Find strategy owned by current wallet
      const owned = strategies.find(s => s.trader.equals(wallet.publicKey!));
      setMyStrategy(owned);
    } catch (error) {
      console.error('Failed to load strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStrategy = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    const name = prompt('Enter strategy name:');
    const description = prompt('Enter strategy description:');
    const feeInput = prompt('Enter performance fee (%):', '10');
    
    if (!name || !description || !feeInput) return;

    const feeBps = Math.floor(parseFloat(feeInput) * 100);
    if (isNaN(feeBps) || feeBps < 0 || feeBps > 10000) {
      alert('Invalid fee percentage (must be 0-100%)');
      return;
    }

    setLoading(true);
    try {
      const sdk = new SpectreSDK(connection, wallet);
      await sdk.initializeStrategy(wallet.publicKey, name, description, feeBps);
      alert('Strategy created successfully!');
      await loadTraderStrategy();
    } catch (error) {
      console.error('Strategy creation failed:', error);
      alert('Failed to create strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    if (!myStrategy) {
      alert('Please create a strategy first');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Invalid amount');
      return;
    }

    setExecuting(true);
    try {
      const sdk = new SpectreSDK(connection, wallet);
      const amountLamports = Math.floor(amountNum * 1_000_000_000); // Convert SOL to lamports
      
      // For demo purposes, simulate profit/loss
      const profitOrLoss = direction === 'long' 
        ? Math.floor(amountLamports * 0.05) // 5% profit for long
        : Math.floor(amountLamports * -0.03); // 3% loss for short
      
      // Note: In production, you'd get the actual position key for each subscriber
      // For now, we'll execute against the strategy itself
      await sdk.executeTrade(
        wallet.publicKey,
        myStrategy.publicKey,
        amountLamports,
        profitOrLoss
      );

      // Add to local history
      setTradeHistory([
        {
          asset,
          amount: amountNum,
          direction,
          timestamp: Date.now(),
          status: 'executed'
        },
        ...tradeHistory
      ]);

      alert('Trade executed successfully!');
      setAmount('');
      await loadTraderStrategy();
    } catch (error) {
      console.error('Trade execution failed:', error);
      alert('Failed to execute trade. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  if (!wallet.publicKey) {
    return (
      <div className="min-h-screen bg-black text-foreground flex items-center justify-center">
        <Card className="bg-card/50 border-white/10 max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Trader Dashboard</h2>
            <p className="text-neutral-400 mb-6">
              Connect your wallet to access trader features
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full opacity-10"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 bg-black/50 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-white/10"></div>
            <h1 className="text-xl font-bold text-white">Trader Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : !myStrategy ? (
          <Card className="bg-card/50 border-white/10 max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <Activity className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Your Strategy</h2>
              <p className="text-neutral-400 mb-6">
                Set up your trading strategy to start attracting subscribers
              </p>
              <Button onClick={handleCreateStrategy} className="bg-primary text-black hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Create Strategy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Strategy Overview */}
            <Card className="bg-card/50 border-white/10">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-white">Your Strategy</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Strategy Name</p>
                    <p className="text-white font-semibold">{myStrategy.name}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Total Subscribers</p>
                    <p className="text-white font-semibold">{myStrategy.totalSubscribers}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Volume Traded</p>
                    <p className="text-white font-semibold">
                      {formatSOL(myStrategy.totalVolumeTraded.toNumber())} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm mb-1">Fees Earned</p>
                    <p className="text-green-500 font-semibold">
                      {formatSOL(myStrategy.totalFeesEarned.toNumber())} SOL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Execute Trade */}
              <Card className="bg-card/50 border-white/10">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-white">Execute Trade</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleExecuteTrade} className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-400 mb-2 block">
                        Trading Pair
                      </label>
                      <select
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                      >
                        <option value="SOL/USDC">SOL/USDC</option>
                        <option value="SOL/USDT">SOL/USDT</option>
                        <option value="ETH/USDC">ETH/USDC</option>
                        <option value="BTC/USDC">BTC/USDC</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-400 mb-2 block">
                        Amount (SOL)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-neutral-400 mb-2 block">
                        Direction
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDirection('long')}
                          className={`px-4 py-3 rounded-lg border transition-all ${
                            direction === 'long'
                              ? 'bg-green-500/20 border-green-500 text-green-500'
                              : 'bg-black border-white/10 text-neutral-400 hover:border-white/20'
                          }`}
                        >
                          <TrendingUp className="w-4 h-4 inline mr-2" />
                          Long
                        </button>
                        <button
                          type="button"
                          onClick={() => setDirection('short')}
                          className={`px-4 py-3 rounded-lg border transition-all ${
                            direction === 'short'
                              ? 'bg-red-500/20 border-red-500 text-red-500'
                              : 'bg-black border-white/10 text-neutral-400 hover:border-white/20'
                          }`}
                        >
                          <TrendingDown className="w-4 h-4 inline mr-2" />
                          Short
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={executing || !amount}
                      className="w-full bg-primary text-black hover:bg-primary/90"
                    >
                      {executing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Execute Trade
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Trade History */}
              <Card className="bg-card/50 border-white/10">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-white">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {tradeHistory.length === 0 ? (
                    <p className="text-neutral-400 text-center py-8">
                      No trades executed yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {tradeHistory.slice(0, 10).map((trade, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-black/50 border border-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {trade.direction === 'long' ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <div>
                              <p className="text-white font-medium">{trade.asset}</p>
                              <p className="text-sm text-neutral-500">
                                {trade.amount} SOL
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              trade.direction === 'long' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {trade.direction.toUpperCase()}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
