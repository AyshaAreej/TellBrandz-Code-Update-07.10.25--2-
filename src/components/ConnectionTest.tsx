import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { supabase } from '@/lib/supabase';
import { Loader2, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'failed' | 'demo'>('testing');
  const [details, setDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('');

  const runTest = async () => {
    setIsLoading(true);
    setStatus('testing');
    setDetails('Testing connection...');

    try {
      // Check if we're in demo mode
      const isDemoMode = (supabase as any).supabaseUrl?.includes('demo') || 
                        (supabase as any).supabaseUrl?.includes('localhost');

      // Check real Supabase connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        setStatus('error');
        setDetails(`❌ Connection failed: ${error.message}`);
        setAuthStatus('Authentication unavailable');
        return;
      }

      // Test basic connectivity first
      const { data: healthCheck, error: healthError } = await supabase
        .from('_health_check')
        .select('*')
        .limit(1);

      if (healthError && healthError.code !== 'PGRST116') {
        // Try alternative connection test
        const { error: altError } = await supabase.auth.getSession();
        if (altError) {
          throw new Error(`Connection failed: ${altError.message}`);
        }
      }

      // Test auth service
      const { data: session, error: authError } = await supabase.auth.getSession();
      if (authError) {
        setAuthStatus(`Auth warning: ${authError.message}`);
      } else {
        setAuthStatus(session?.user ? `Authenticated as ${session.user.email}` : 'Not authenticated');
      }

      setStatus('success');
      setDetails('✅ Connection successful! Supabase is accessible.');

    } catch (error: any) {
      setStatus('failed');
      setDetails(`❌ Connection failed: ${error.message || 'Network error'}`);
      setAuthStatus('Authentication unavailable');
      console.error('Connection test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <WifiOff className="w-4 h-4" />;
      case 'demo': return <AlertCircle className="w-4 h-4" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'demo': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge className={`${getStatusColor()} text-white flex items-center gap-1`}>
            {getStatusIcon()}
            {status.toUpperCase()}
          </Badge>
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="text-sm">
          <p className="font-medium">Connection:</p>
          <p className="text-gray-600">{details}</p>
        </div>
        {authStatus && (
          <div className="text-sm">
            <p className="font-medium">Authentication:</p>
            <p className="text-gray-600">{authStatus}</p>
          </div>
        )}
        <Button 
          onClick={runTest} 
          size="sm" 
          variant="outline"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export { ConnectionTest };
export default ConnectionTest;