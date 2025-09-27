import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EmailVerificationProps {
  email: string;
  onResendSuccess?: () => void;
  onBack?: () => void;
  returnTo?: string | null;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onResendSuccess, 
  onBack,
  returnTo
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setMessage('Verification email sent! Please check your inbox.');
      onResendSuccess?.();
    } catch (error) {
      console.error('Error resending verification:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <p className="text-gray-600">We've sent a verification link to:</p>
            <p className="font-semibold text-blue-600">{email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{message}</AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                <p>Click the verification link in your email to activate your account and access your dashboard.</p>
                <p className="mt-2">Didn't receive the email? Check your spam folder.</p>
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </Button>

              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;