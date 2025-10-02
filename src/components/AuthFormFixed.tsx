import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import EmailVerification from './EmailVerification';
import Header from './Header';
import Footer from './Footer';

interface AuthFormFixedProps {
  onBack?: () => void;
  showHeader?: boolean;
  redirectTo?: string;
}

const AuthFormFixed: React.FC<AuthFormFixedProps> = ({ onBack, showHeader = true, redirectTo }) => {
  const { signIn, signUp, setCurrentView } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });

  // Get URL parameters for mode and returnTo
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'login';
  const returnTo = urlParams.get('returnTo') || redirectTo;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await signIn(loginData.email, loginData.password);
      setSuccess('Successfully signed in!');
      
      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await signUp(signupData.email, signupData.password, signupData.fullName);
      
      try {
        await supabase.functions.invoke('branded-email-service', {
          body: {
            type: 'welcome_email',
            userEmail: signupData.email,
            userName: signupData.fullName || signupData.email.split('@')[0]
          }
        });
      } catch (emailError) {
        console.log('Welcome email failed to send:', emailError);
      }
      
      if (result.needsConfirmation) {
        setVerificationEmail(signupData.email);
        setShowEmailVerification(true);
      } else {
        setSuccess('Account created and signed in successfully!');
        
        if (returnTo) {
          setTimeout(() => {
            navigate(returnTo);
          }, 1500);
        } else if (onBack) {
          setTimeout(() => onBack(), 1500);
        } else {
          setTimeout(() => navigate('/'), 1500);
        }
      }
      
      setSignupData({ email: '', password: '', fullName: '' });
    } catch (error) {
      console.error('Signup failed:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      setSuccess('Password reset link has been sent to your email!');
      setForgotPasswordEmail('');
      
      // Go back to login after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (showEmailVerification) {
    if (!showHeader) {
      return (
        <EmailVerification
          email={verificationEmail}
          onBack={() => setShowEmailVerification(false)}
          onResendSuccess={() => setSuccess('Verification email sent!')}
          returnTo={returnTo}
        />
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onAuthClick={() => navigate('/auth')} />
        <main className="flex-1">
          <EmailVerification
            email={verificationEmail}
            onBack={() => setShowEmailVerification(false)}
            onResendSuccess={() => setSuccess('Verification email sent!')}
            returnTo={returnTo}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Forgot Password View
  if (showForgotPassword) {
    const forgotPasswordContent = (
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => setShowForgotPassword(false)} 
          className="mb-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <p className="text-gray-600">Enter your email to receive a password reset link</p>
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
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );

    if (!showHeader) {
      return (
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4 min-h-screen">
          {forgotPasswordContent}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onAuthClick={() => navigate('/auth')} />
        <main className="flex-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
          {forgotPasswordContent}
        </main>
        <Footer />
      </div>
    );
  }

  // Main Auth Form
  const authFormContent = (
    <div className="w-full max-w-md">
      <Button 
        variant="ghost" 
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }
        }} 
        className="mb-4 text-white hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to TellBrandz</CardTitle>
          <p className="text-gray-600">Join the community for real accountability</p>
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
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="login-password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentView('brand-claim')}
                  disabled={loading}
                >
                  Claim Your Brand Access
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentView('brand-claim')}
                  disabled={loading}
                >
                  Claim Your Brand Access
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  if (!showHeader) {
    return (
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4 min-h-screen">
        {authFormContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAuthClick={() => navigate('/auth')} />
      <main className="flex-1 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        {authFormContent}
      </main>
      <Footer />
    </div>
  );
};

export default AuthFormFixed;