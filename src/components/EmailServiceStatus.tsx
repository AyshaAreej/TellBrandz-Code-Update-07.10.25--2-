import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EmailTestResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const EmailServiceStatus: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<EmailTestResult | null>(null);

  const sendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setLastResult({
        success: false,
        error: 'Please enter a valid email address'
      });
      return;
    }

    try {
      setSending(true);
      
      const { data, error } = await supabase.functions.invoke('email-notifications', {
        body: {
          type: 'welcome_email',
          userEmail: testEmail,
          userName: 'Test User'
        }
      });

      if (error) throw error;

      setLastResult({
        success: data.success,
        messageId: data.messageId,
        error: data.error
      });
    } catch (error) {
      console.error('Test email failed:', error);
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Email Service Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Mailjet Connected
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Test Email Service</label>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={sendTestEmail}
              disabled={sending}
              size="sm"
            >
              <Send className="h-4 w-4 mr-1" />
              {sending ? 'Sending...' : 'Test'}
            </Button>
          </div>
        </div>

        {lastResult && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {lastResult.success ? 'Email Sent Successfully' : 'Email Failed'}
              </span>
            </div>
            
            {lastResult.success && lastResult.messageId && (
              <p className="text-xs text-gray-600">
                Message ID: {lastResult.messageId}
              </p>
            )}
            
            {!lastResult.success && lastResult.error && (
              <p className="text-xs text-red-600">
                Error: {lastResult.error}
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Email types supported:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Award notifications to brands</li>
            <li>Welcome emails to new users</li>
            <li>Account verification emails</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailServiceStatus;