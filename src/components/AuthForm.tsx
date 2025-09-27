import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { PasswordReset } from './PasswordReset';
import ConnectionTest from './ConnectionTest';
import AuthStatus from './AuthStatus';
import BrandClaimForm from './BrandClaimForm';
import EmailVerificationReminder from './EmailVerificationReminder';
import SocialLogin from './SocialLogin';
interface AuthFormProps {
  onBack?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onBack }) => {
  const { signIn, signUp } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
      // Don't call onBack immediately, let the auth state change handle navigation
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUp(signupData.email, signupData.password, signupData.fullName);
      
      if (result.needsConfirmation) {
        setVerificationEmail(signupData.email);
        setShowEmailVerification(true);
      } else {
        alert('Account created and signed in successfully!');
      }
      
      // Clear form
      setSignupData({ email: '', password: '', fullName: '' });
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const [showBrandClaim, setShowBrandClaim] = useState(false);

  if (showBrandClaim) {
    return (
      <BrandClaimForm 
        onBack={() => setShowBrandClaim(false)}
        onSuccess={() => {
          setShowBrandClaim(false);
          onBack?.();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowBrandClaim(true)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Claim Brand Profile
          </Button>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to TellBrandz</CardTitle>
            <p className="text-gray-600">Join the community for real accountability</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
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
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <SocialLogin 
              onSuccess={() => onBack?.()}
              onError={(error) => alert(error)}
            />
          </CardContent>
        </Card>
        
        {showEmailVerification && (
          <EmailVerificationReminder 
            email={verificationEmail}
            onVerified={() => {
              setShowEmailVerification(false);
              onBack?.();
            }}
          />
        )}
        
        <ConnectionTest />
        <AuthStatus />
      </div>
    </div>
  );
};

export default AuthForm;
