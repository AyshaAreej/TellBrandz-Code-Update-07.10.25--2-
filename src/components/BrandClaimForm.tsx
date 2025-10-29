import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBrands } from '@/hooks/useBrands';
import EmailVerification from './EmailVerification';

interface BrandClaimFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const BrandClaimForm: React.FC<BrandClaimFormProps> = ({ onBack, onSuccess }) => {
  const { brands } = useBrands();
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [formData, setFormData] = useState({
    brandId: '',
    fullName: '',
    professionalEmail: '',
    password: '',
    companyId: '',
    verificationDocuments: '',
    publicProfileLink: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.brandId || !formData.fullName || !formData.professionalEmail || !formData.password) {
        throw new Error('Brand, full name, email, and password are required');
      }

      // Call brand-user edge function to create user and send verification email
      const { data, error: functionError } = await supabase.functions.invoke('brand-user', {
        body: {
          action: 'signup',
          email: formData.professionalEmail,
          password: formData.password,
          fullName: formData.fullName,
          brandId: formData.brandId,
          companyId: formData.companyId,
          verificationDocuments: formData.verificationDocuments,
          publicProfileLink: formData.publicProfileLink
        }
      });

      if (functionError) throw functionError;

      setVerificationEmail(formData.professionalEmail);
      setShowEmailVerification(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit brand claim';
      setError(errorMessage);
      console.error('Error submitting brand claim:', err);
    } finally {
      setLoading(false);
    }
  };
    const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      text: strengthTexts[Math.min(strength, 4)],
      color: colors[Math.min(strength, 4)]
    };
  };

  const passwordStrength = getPasswordStrength();

  if (showEmailVerification) {
    return (
      <EmailVerification
        email={verificationEmail}
        onBack={() => setShowEmailVerification(false)}
        onResendSuccess={() => alert('Verification email sent to your professional email!')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={onBack} className="mb-4 text-white hover:bg-white/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Claim Brand Profile</CardTitle>
            <p className="text-gray-600">Verify your brand representation</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select value={formData.brandId} onValueChange={(value) => setFormData({...formData, brandId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="professional-email">Professional Email</Label>
                <Input
                  id="professional-email"
                  type="email"
                  value={formData.professionalEmail}
                  onChange={(e) => setFormData({...formData, professionalEmail: e.target.value})}
                  placeholder="your.name@company.com"
                  required
                />
              </div>

             <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

              <div>
                <Label htmlFor="company-id">Company ID (Optional)</Label>
                <Input
                  id="company-id"
                  type="text"
                  value={formData.companyId}
                  onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                  placeholder="Employee ID or Badge Number"
                />
              </div>

              <div>
                <Label htmlFor="public-profile">Public Profile Link</Label>
                <Input
                  id="public-profile"
                  type="url"
                  value={formData.publicProfileLink}
                  onChange={(e) => setFormData({...formData, publicProfileLink: e.target.value})}
                  placeholder="LinkedIn, company website, etc."
                />
              </div>

              <div>
                <Label htmlFor="verification-docs">Verification Documents</Label>
                <Textarea
                  id="verification-docs"
                  value={formData.verificationDocuments}
                  onChange={(e) => setFormData({...formData, verificationDocuments: e.target.value})}
                  placeholder="Describe any documents or proof of employment you can provide"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !formData.brandId}>
                {loading ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandClaimForm;