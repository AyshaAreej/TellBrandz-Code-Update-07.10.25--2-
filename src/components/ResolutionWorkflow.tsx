import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PaymentService } from './PaymentService';
import { CustomerConsentForm } from './CustomerConsentForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { MessageSquare, CreditCard, CheckCircle } from 'lucide-react';

interface ResolutionWorkflowProps {
  tellId: string;
  brandId: string;
  tellTitle: string;
  tellContent: string;
  customerEmail: string;
  isCustomer?: boolean;
  isBrand?: boolean;
}

type WorkflowStep = 'initial' | 'brand_response' | 'customer_consent' | 'payment' | 'completed';

export const ResolutionWorkflow: React.FC<ResolutionWorkflowProps> = ({
  tellId,
  brandId,
  tellTitle,
  tellContent,
  customerEmail,
  isCustomer = false,
  isBrand = false
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('initial');
  const [brandResponse, setBrandResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const RESOLUTION_FEE = 5000; // ₦50 in kobo

  const handleBrandResponse = async () => {
    if (!brandResponse.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a response to the customer',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('resolution-management', {
        body: {
          action: 'initiate_resolution',
          tellId,
          brandId,
          brandResponse
        }
      });

      if (error) throw error;

      setCurrentStep('customer_consent');
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the customer for review',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerConsent = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = async () => {
    try {
      const { error } = await supabase.functions.invoke('resolution-management', {
        body: {
          action: 'complete_resolution',
          tellId,
          resolutionData: { paymentReference: 'payment_ref_123' }
        }
      });

      if (error) throw error;

      setCurrentStep('completed');
      toast({
        title: 'Resolution Complete!',
        description: 'The tell has been successfully marked as resolved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete resolution',
        variant: 'destructive',
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'initial':
        if (isBrand) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Respond to Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">Original Tell</Badge>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">{tellTitle}</h4>
                    <p className="text-sm mt-1">{tellContent}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Your Response</label>
                  <Textarea
                    placeholder="Explain how you plan to resolve this issue..."
                    value={brandResponse}
                    onChange={(e) => setBrandResponse(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={handleBrandResponse} disabled={loading}>
                  Send Response to Customer
                </Button>
              </CardContent>
            </Card>
          );
        }
        return <p>Waiting for brand response...</p>;

      case 'customer_consent':
        if (isCustomer) {
          return (
            <CustomerConsentForm
              tellId={tellId}
              brandResponse={brandResponse}
              onConsentGiven={handleCustomerConsent}
              onConsentDenied={() => setCurrentStep('initial')}
            />
          );
        }
        return <p>Waiting for customer consent...</p>;

      case 'payment':
        if (isBrand) {
          return (
            <PaymentService
              tellId={tellId}
              brandId={brandId}
              amount={RESOLUTION_FEE / 100}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={() => setCurrentStep('customer_consent')}
            />
          );
        }
        return <p>Brand is processing payment...</p>;

      case 'completed':
        return (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resolution Complete!</h3>
              <p className="text-muted-foreground">
                This tell has been successfully resolved and will be marked as such on the brand's profile.
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
};