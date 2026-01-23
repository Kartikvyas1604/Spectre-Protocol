'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { StrategyMarketplace } from '@/components/StrategyMarketplace';
import { PortfolioTracker } from '@/components/PortfolioTracker';
import { ClientWalletButton } from '@/components/ClientWalletButton';
import { Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('portfolio');
  
  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-primary/30 relative">
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
            <div className={`absolute top-0 center w-full h-[500px] blur-[120px] rounded-full opacity-20 transform -translate-y-1/2 transition-colors duration-1000 ${
                activeTab === 'portfolio' ? 'bg-primary/5' : 'bg-purple-500/5'
            }`}></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-10"></div>
        </div>

        {/* Navigation Bar */}
        <header className="border-b border-white/5 sticky top-0 bg-black/50 backdrop-blur-xl z-50">
            <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('portfolio')}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all duration-500"></div>
                        <div className="w-10 h-10 bg-card border border-white/10 rounded-xl flex items-center justify-center relative z-10">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-white block leading-none">SPECTRE</span>
                        <span className="text-[10px] text-neutral-500 tracking-[0.2em] font-medium">PROTOCOL</span>
                    </div>
                </div>
                
                <nav className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
                    {['Portfolio', 'Strategies'].map((item) => (
                        <button 
                            key={item}
                            onClick={() => setActiveTab(item.toLowerCase().replace(' ', '-'))}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeTab === item.toLowerCase().replace(' ', '-')
                                    ? 'bg-primary text-black shadow-lg'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {publicKey && (
                        <Button
                            onClick={() => router.push('/trader')}
                            variant="outline"
                            size="sm"
                            className="border-primary/20 text-primary hover:bg-primary/10"
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            Trader Dashboard
                        </Button>
                    )}
                    <ClientWalletButton />
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-16 relative z-10">
            {activeTab === 'portfolio' && <PortfolioTracker />}
            {activeTab === 'strategies' && <StrategyMarketplace />}
        </main>
    </div>
  );
}
