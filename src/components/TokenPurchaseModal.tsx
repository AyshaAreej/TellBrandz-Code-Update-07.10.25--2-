import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Coins } from 'lucide-react';

interface TokenPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  brandId: string;
  onSuccess: () => void;
}

export default function TokenPurchaseModal({ open, onClose, brandId, onSuccess }: TokenPurchaseModalProps) {
  const [amount, setAmount] = useState(1000);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const tokenPackages = [
    { tokens: 100, price: 10000, label: 'Starter' },
    { tokens: 500, price: 45000, label: 'Professional' },
    { tokens: 1000, price: 80000, label: 'Enterprise' },
  ];

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('token-purchase', {
        body: {
          action: 'initiate',
          brandId,
          amount: amount * 100, // Convert tokens to Naira (100 Naira per token)
          email
        }
      });

      if (error) throw error;

      if (data.status && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to initiate purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            Purchase Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {tokenPackages.map((pkg) => (
              <Button
                key={pkg.tokens}
                variant={amount === pkg.tokens ? 'default' : 'outline'}
                onClick={() => setAmount(pkg.tokens)}
                className="flex flex-col h-auto py-3"
              >
                <span className="text-xs">{pkg.label}</span>
                <span className="font-bold">{pkg.tokens}</span>
                <span className="text-xs">₦{pkg.price.toLocaleString()}</span>
              </Button>
            ))}
          </div>

          <div>
            <Label>Custom Amount (Tokens)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min={1}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Total: ₦{(amount * 100).toLocaleString()}
            </p>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading || !email || amount < 1}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
