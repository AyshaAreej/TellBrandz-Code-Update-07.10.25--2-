import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from './Header';
import Footer from './Footer';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | boolean>(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      throw new Error('Reset token missing from URL');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const { data, error } = await supabase.functions.invoke('custom-auth-verification', {
      body: {
        action: 'reset-password',
        token,
        newPassword: password
      }
    });

    if (error || !data.success) {
      throw new Error(data?.error || error?.message || 'Failed to reset password');
    }

    setSuccess('Password updated successfully! Redirecting to login...');
    setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
  } catch (err) {
    console.error('Reset password error:', err);
    setError(err.message || 'Something went wrong resetting password');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAuthClick={() => navigate('/auth')} />
      <main className="flex-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Set New Password</CardTitle>
              <p className="text-gray-600">Enter your new password below</p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Password updated successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
              )}

              {!success && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;