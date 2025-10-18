import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function BrandClaimFlow() {
  const [step, setStep] = useState(1);
  const [brandDomain, setBrandDomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create brand claim request
      const { error } = await supabase.from('brand_claims').insert({
        brand_domain: brandDomain,
        company_name: companyName,
        claimant_email: email,
        status: 'pending',
        user_id: user.id
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Claim Submitted!</h2>
          <p>We'll verify your claim and contact you within 24-48 hours.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Claim Your Brand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Claiming your brand gives you access to the Brand Dashboard, AI insights, and resolution tools.
          </AlertDescription>
        </Alert>
        <div className="space-y-3">
          <div>
            <Label>Brand Domain</Label>
            <Input placeholder="example.com" value={brandDomain} onChange={(e) => setBrandDomain(e.target.value)} />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div>
            <Label>Work Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleClaim} disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
