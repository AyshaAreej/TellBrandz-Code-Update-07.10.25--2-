import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CheckCircle, X, MessageSquare } from 'lucide-react';

interface CustomerConsentFormProps {
  tellId: string;
  brandResponse: string;
  onConsentGiven: () => void;
  onConsentDenied: () => void;
}

export const CustomerConsentForm: React.FC<CustomerConsentFormProps> = ({
  tellId,
  brandResponse,
  onConsentGiven,
  onConsentDenied
}) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConsent = async (satisfied: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('resolution-management', {
        body: {
          action: 'customer_consent',
          tellId,
          satisfied,
          customerFeedback: feedback
        }
      });

      if (error) throw error;

      toast({
        title: satisfied ? 'Thank you!' : 'Feedback recorded',
        description: satisfied 
          ? 'Your satisfaction has been recorded. The brand can now complete the resolution.'
          : 'Your feedback has been recorded. The brand will work to improve their response.',
      });

      if (satisfied) {
        onConsentGiven();
      } else {
        onConsentDenied();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record your response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Resolution Response Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant="outline" className="mb-2">Brand Response</Badge>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{brandResponse}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Your Feedback (Optional)</label>
          <Textarea
            placeholder="Share your thoughts on the brand's response..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleConsent(true)}
            disabled={loading}
            className="flex-1"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            I'm Satisfied
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleConsent(false)}
            disabled={loading}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Not Satisfied
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Only when you confirm satisfaction can the brand complete the resolution process
        </p>
      </CardContent>
    </Card>
  );
};