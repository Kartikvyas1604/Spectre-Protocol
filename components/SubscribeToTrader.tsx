"use client";

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubscribeToTrader({ traderId }: { traderId: string }) {
  const { connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = async () => {
    if (!connected) return;
    
    setLoading(true);
    try {
        // Mock subscription Call
        console.log(`Subscribing to trader ${traderId}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubscribed(true);
        console.log('Subscribed!');
      
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (subscribed) {
      return (
        <Button variant="outline" className="text-primary border-primary/20 bg-primary/10 cursor-default">
            <Check className="w-4 h-4 mr-2" />
            Active Strategy
        </Button>
      )
  }
  
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleSubscribe}
      disabled={!connected}
      isLoading={loading}
      glow
    >
      {!loading && <UserPlus className="w-4 h-4 mr-2" />}
      {loading ? "Verifying..." : "Copy Strategy"}
    </Button>
  );
}
