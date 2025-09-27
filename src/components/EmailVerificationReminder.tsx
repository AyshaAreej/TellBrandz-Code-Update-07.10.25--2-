import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EmailVerificationReminderProps {
  email?: string;
  onVerified?: () => void;
}

const EmailVerificationReminder: React.FC<EmailVerificationReminderProps> = ({ 
  email, 
  onVerified 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    // Check verification status periodically
    const checkVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email_confirmed_at) {
          setIsVerified(true);
          onVerified?.();
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval);
  }, [onVerified]);

  const handleResendVerification = async () => {
    if (!email || countdown > 0) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setLastSent(new Date());
      setCountdown(60); // 1 minute cooldown
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Email verified successfully! You can now sign in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">
              Verify Your Email
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your email and click the link to activate your account.
            </p>
            
            <div className="mt-3 flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
              </Button>
              
              {lastSent && (
                <div className="flex items-center text-xs text-yellow-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Last sent: {lastSent.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <p className="text-xs text-yellow-600 mt-2">
              Don't see the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationReminder;