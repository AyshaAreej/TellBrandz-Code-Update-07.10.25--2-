import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const EmailConfirmationTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testEmailConfirmation = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Test the custom auth verification function
      const { data, error } = await supabase.functions.invoke('custom-auth-verification', {
        body: {
          action: 'signup',
          email: email,
          password: 'testpassword123',
          fullName: 'Test User'
        }
      });

      if (error) throw error;

      if (data.success) {
        setMessage('Test email sent successfully! Check your inbox for the verification link.');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Email test error:', error);
      setError(error.message || 'Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Confirmation Test
        </CardTitle>
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

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter email to test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={testEmailConfirmation}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Test Email Confirmation'}
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>This will send a test verification email to the provided address.</p>
          <p className="mt-1">The email will contain a link to: <code>/auth/callback?token=...&type=signup</code></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailConfirmationTest;