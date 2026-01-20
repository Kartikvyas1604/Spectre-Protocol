"use client";

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Eye, EyeOff, Lock, RefreshCw, Wallet, TrendingUp, History, ShieldCheck } from 'lucide-react';
import { fetchAndDecryptBalance, formatAddress } from '@/lib/crypto';
import { useArcium } from '@/components/providers/ArciumProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function PrivateUserView() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isReady } = useArcium();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (publicKey) {
      loadBalance();
    }
  }, [publicKey]);

  const loadBalance = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      // Mock keypair for now
      const mockKeypair = { secret: 'mock' };
      const val = await fetchAndDecryptBalance(connection, publicKey, mockKeypair);
      setBalance(val);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
     return (
        <Card className="flex flex-col items-center justify-center p-12 text-neutral-500 border-dashed bg-white/5">
            <Lock className="w-10 h-10 mb-4 text-neutral-600" />
            <p className="text-sm font-medium">Connect wallet to decrypt vault</p>
        </Card>
     );
  }

  return (
    <div className="space-y-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-black p-1 rounded-xl border border-primary/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.1)]">
            <div className="bg-[#0A0A0A] p-5 rounded-lg relative overflow-hidden group h-full">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                 
                 <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className="flex items-center gap-2 text-primary">
                         <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
                            <ShieldCheck className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-wider text-primary/90">Decrypted Vault</span>
                     </div>
                     <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-neutral-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                     >
                         {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                     </button>
                 </div>
    
                 <div className="flex items-end justify-between relative z-10">
                    <div className="flex flex-col gap-1">
                         <span className="text-xs text-neutral-500 font-medium">Available Balance</span>
                         <AnimatePresence mode="wait">
                           {loading ? (
                             <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-10 w-32 bg-white/10 rounded animate-pulse"
                             />
                           ) : showBalance ? (
                             <motion.div 
                                key="balance"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-baseline gap-2"
                             >
                                <span className="text-4xl font-bold text-white tracking-tight font-mono">
                                    {balance?.toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-neutral-400">USDC</span>
                             </motion.div>
                           ) : (
                               <motion.div 
                                 key="hidden"
                                 initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                 className="text-4xl font-bold text-white blur-md select-none tracking-tight font-mono"
                               >
                                  50,000
                               </motion.div>
                           )}
                         </AnimatePresence>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={loadBalance}
                      disabled={loading}
                      className="text-neutral-400 hover:text-white"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                 </div>
            </div>
        </div>

        {/* Private Activity Feed */}
        <div className="rounded-xl border border-primary/10 overflow-hidden bg-[#0A0A0A]">
             <div className="px-5 py-3 border-b border-primary/10 flex justify-between items-center bg-primary/5">
                 <span className="text-primary/80 text-xs font-bold tracking-wide flex items-center gap-2">
                     <History className="w-3 h-3"/> DECRYPTED ACTIVITY
                 </span>
                 <span className="text-[10px] text-primary/50 uppercase tracking-wider border border-primary/10 px-2 py-0.5 rounded-full">
                     Keyholder Only
                 </span>
             </div>
             <div className="divide-y divide-white/5">
                 <div className="p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                     <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
                             <TrendingUp className="w-4 h-4" />
                         </div>
                         <div>
                             <div className="text-sm text-white font-medium">Trade Executed</div>
                             <div className="text-[10px] text-neutral-500 uppercase tracking-wide">2 minutes ago</div>
                         </div>
                     </div>
                     <div className="text-right">
                         <div className="text-primary text-sm font-mono font-medium">+ 2,500 USDC</div>
                         <div className="text-[10px] text-neutral-500">Strategy A</div>
                     </div>
                 </div>
                 
                 <div className="p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                     <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 ring-1 ring-white/5">
                             <Lock className="w-4 h-4" />
                         </div>
                         <div>
                             <div className="text-sm text-white font-medium">Fee Settlement</div>
                             <div className="text-[10px] text-neutral-500 uppercase tracking-wide">1 hour ago</div>
                         </div>
                     </div>
                     <div className="text-right">
                         <div className="text-neutral-300 text-sm font-mono font-medium">- 34.20 USDC</div>
                         <div className="text-[10px] text-primary/40">via Arcium MPC</div>
                     </div>
                 </div>
             </div>
        </div>
        
        <div className="flex justify-center items-center gap-2 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="text-[10px] text-neutral-600 flex items-center gap-1.5 uppercase tracking-wider font-medium">
                 <ShieldCheck className="w-3 h-3" />
                 End-to-end encrypted
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
    </div>
  );
}
