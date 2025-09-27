import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentServiceProps {
  tellId: string;
  brandId: string;
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

export const PaymentService: React.FC<PaymentServiceProps> = ({
  tellId,
  brandId,
  amount,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Create payment session with Paystack
      const { data, error } = await supabase.functions.invoke('payment-processing', {
        body: {
          action: 'initialize',
          tellId,
          brandId,
          amount: amount * 100, // Convert to kobo
          email: 'brand@example.com', // Should be brand email
          callback_url: `${window.location.origin}/payment-callback`
        }
      });

      if (error) throw error;

      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Resolution Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            Resolution fee for Tell #{tellId.slice(0, 8)}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={initiatePayment} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay with Paystack'
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onPaymentCancel}
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Payment will only be processed after customer confirms satisfaction
        </p>
      </CardContent>
    </Card>
  );
};