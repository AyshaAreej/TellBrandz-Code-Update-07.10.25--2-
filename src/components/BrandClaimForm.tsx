import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2 } from 'lucide-react';
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
  const [verificationEmail, setVerificationEmail] = useState('');
  const [formData, setFormData] = useState({
    brandId: '',
    professionalEmail: '',
    companyId: '',
    verificationDocuments: '',
    publicProfileLink: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Send verification email to professional email
      const { error: emailError } = await supabase.functions.invoke('brand-management', {
        body: {
          action: 'send_verification_email',
          email: formData.professionalEmail,
          brandId: formData.brandId,
          userId: user.id
        }
      });

      if (emailError) throw emailError;

      const { error } = await supabase.from('brand_claims').insert({
        user_id: user.id,
        brand_id: formData.brandId,
        professional_email: formData.professionalEmail,
        company_id: formData.companyId,
        verification_documents: formData.verificationDocuments,
        public_profile_link: formData.publicProfileLink
      });

      if (error) throw error;

      // Update user verification status to pending
      await supabase.from('users').update({
        verification_status: 'pending'
      }).eq('id', user.id);

      setVerificationEmail(formData.professionalEmail);
      setShowEmailVerification(true);
    } catch (error) {
      console.error('Error submitting brand claim:', error);
      alert('Failed to submit brand claim: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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