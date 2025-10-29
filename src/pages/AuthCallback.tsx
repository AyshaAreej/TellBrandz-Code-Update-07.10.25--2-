import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Processing authentication...');

 useEffect(() => {
  const handleAuthCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const type = urlParams.get('type');
      const returnTo = urlParams.get('returnTo');

      // Handle brand verification
      if (token && type === 'brand_verify') {
        setMessage('Verifying your email address...');
        
        const { data, error } = await supabase.functions.invoke('brand-user', {
          body: {
            action: 'verify',
            token
          }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || error?.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
      // Handle regular signup verification
      else if (token && type === 'signup') {
        setMessage('Verifying your email address...');
        
        const { data, error } = await supabase.functions.invoke('custom-auth-verification', {
          body: {
            action: 'verify',
            token
          }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || error?.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      }
      // Handle regular auth callback
      else {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Successfully signed in! Redirecting...');
          
          setTimeout(() => {
            if (returnTo) {
              navigate(returnTo, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 2000);
        } else {
          throw new Error('No session found');
        }
      }
    } catch (error: any) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');
      
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 3000);
    }
  };

  handleAuthCallback();
}, [navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <h2 className="text-xl font-semibold">Processing...</h2>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Success!</h2>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-semibold text-red-800">Error</h2>
              </>
            )}
            
            <p className="text-gray-600">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;