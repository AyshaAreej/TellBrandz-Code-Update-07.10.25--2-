import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Chrome, Facebook, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook' | 'twitter') => {
    setLoading(provider);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      // OAuth will redirect, so we don't need to handle success here
      console.log('OAuth initiated:', data);
      
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      onError?.(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(null);
    }
  };

  const socialProviders = [
    {
      name: 'Google',
      provider: 'google' as const,
      icon: Chrome,
      color: 'hover:bg-red-50 border-red-200 text-red-700',
      available: true
    },
    {
      name: 'GitHub',
      provider: 'github' as const,
      icon: Github,
      color: 'hover:bg-gray-50 border-gray-200 text-gray-700',
      available: true
    },
    {
      name: 'Facebook',
      provider: 'facebook' as const,
      icon: Facebook,
      color: 'hover:bg-blue-50 border-blue-200 text-blue-700',
      available: false // Often requires additional setup
    },
    {
      name: 'Twitter',
      provider: 'twitter' as const,
      icon: Twitter,
      color: 'hover:bg-sky-50 border-sky-200 text-sky-700',
      available: false // Often requires additional setup
    }
  ];

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            {socialProviders
              .filter(provider => provider.available)
              .map((provider) => {
                const Icon = provider.icon;
                const isLoading = loading === provider.provider;
                
                return (
                  <Button
                    key={provider.provider}
                    variant="outline"
                    onClick={() => handleSocialLogin(provider.provider)}
                    disabled={isLoading || loading !== null}
                    className={`w-full ${provider.color}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {isLoading ? 'Connecting...' : `Continue with ${provider.name}`}
                  </Button>
                );
              })}
          </div>

          {socialProviders.filter(p => !p.available).length > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                More options coming soon:
              </p>
              <div className="flex justify-center space-x-2">
                {socialProviders
                  .filter(provider => !provider.available)
                  .map((provider) => {
                    const Icon = provider.icon;
                    return (
                      <div
                        key={provider.provider}
                        className="p-2 rounded-full bg-gray-100 opacity-50"
                        title={`${provider.name} (Coming Soon)`}
                      >
                        <Icon className="h-4 w-4 text-gray-400" />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLogin;