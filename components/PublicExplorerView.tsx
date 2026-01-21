"use client";

import { Copy, ExternalLink, ShieldAlert, EyeOff } from 'lucide-react';
import { formatAddress } from '@/lib/crypto';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PublicExplorerView({ address }: { address?: string }) {
  if (!address) {
      return (
          <Card className="animate-pulse border-white/5 bg-neutral-900/50">
             <CardHeader className="space-y-2">
                 <div className="h-6 w-1/3 bg-white/5 rounded"></div>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div className="h-10 bg-white/5 rounded"></div>
                 <div className="h-20 bg-white/5 rounded"></div>
             </CardContent>
          </Card>
      )
  }

  return (
    <div className="space-y-4 font-mono text-sm">
        {/* Mocking a Solscan-like interface */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-card">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-neutral-400 text-xs font-medium tracking-wide">ON-CHAIN STATE</span>
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Solana Devnet
                </span>
            </div>
            <div className="p-5 space-y-6">
                
                <div className="space-y-1.5">
                    <span className="text-neutral-500 text-xs uppercase tracking-wider">Public Address</span>
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="font-mono">{formatAddress(address)}</span>
                        <div className="ml-auto flex gap-2 text-neutral-500">
                            <Copy className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
                            <ExternalLink className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                     <span className="text-neutral-500 text-xs uppercase tracking-wider">Token Extensions</span>
                     <div className="flex gap-2">
                         <span className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-1.5 font-medium">
                             <ShieldAlert className="w-3 h-3" />
                             Confidential Transfer
                         </span>
                     </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-neutral-500 text-xs uppercase tracking-wider">
                        <span>USDC Balance</span>
                        <span className="text-red-500 flex items-center gap-1.5 text-[10px] border border-red-500/20 px-1.5 rounded bg-red-500/5">
                            ENCRYPTED <ShieldAlert className="w-3 h-3"/>
                        </span>
                    </div>
                    
                    <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/10 flex justify-between items-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <span className="text-red-400 blur-sm select-none font-mono text-xl tracking-tighter">
                            ██,███.██
                        </span>
                        <EyeOff className="w-4 h-4 text-red-500/50" />
                    </div>
                </div>

            </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/10 bg-card">
             <div className="bg-white/5 px-4 py-2 border-b border-white/5">
                 <span className="text-neutral-400 text-xs font-medium tracking-wide uppercase">Confirmed Blocks</span>
             </div>
             <div className="divide-y divide-white/5">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="p-3 flex justify-between items-center text-xs hover:bg-white/5 transition-colors">
                         <span className="text-blue-400 font-mono">
                             {formatAddress(`Signature${i}xxxxxxxx`)}
                         </span>
                         <span className="text-neutral-500 flex items-center gap-1">
                             <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                             Encrypted Instruction
                         </span>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
}
