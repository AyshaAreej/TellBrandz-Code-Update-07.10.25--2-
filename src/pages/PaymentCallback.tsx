import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, X, Loader2 } from 'lucide-react';

export const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference found');
        return;
      }

      try {
        // Verify payment with backend
        const { data, error } = await supabase.functions.invoke('payment-processing', {
          body: {
            action: 'verify',
            reference
          }
        });

        if (error) throw error;

        if (data.success) {
          // Complete the resolution process
          const tellId = data.data.metadata?.tellId;
          if (tellId) {
            await supabase.functions.invoke('resolution-management', {
              body: {
                action: 'complete_resolution',
                tellId,
                resolutionData: { paymentReference: reference }
              }
            });
          }

          setStatus('success');
          setMessage('Payment successful! The tell has been marked as resolved.');
          
          toast({
            title: 'Payment Successful',
            description: 'The resolution has been completed successfully.',
          });
        } else {
          setStatus('failed');
          setMessage('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment');
        
        toast({
          title: 'Payment Error',
          description: 'There was an issue verifying your payment.',
          variant: 'destructive',
        });
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  const handleContinue = () => {
    navigate('/brand-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Processing Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          )}
          
          {status === 'success' && (
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
          )}
          
          {status === 'failed' && (
            <X className="h-12 w-12 mx-auto text-red-500" />
          )}
          
          <p className="text-muted-foreground">{message}</p>
          
          {status !== 'loading' && (
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;