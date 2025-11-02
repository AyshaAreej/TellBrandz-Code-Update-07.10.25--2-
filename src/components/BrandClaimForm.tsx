import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Eye, EyeOff, Upload, X, Search, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBrands } from '@/hooks/useBrands';

interface BrandClaimFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const BrandClaimForm: React.FC<BrandClaimFormProps> = ({ onBack, onSuccess }) => {
  const { brands } = useBrands();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, url: string}>>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const selectedBrand = brands.find(b => b.id === formData.brandId);

  const handleBrandSelect = (brandId: string) => {
    setFormData({ ...formData, brandId });
    setShowBrandDropdown(false);
    setBrandSearch('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `brand-claims/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('tell-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tell-images')
          .getPublicUrl(fileName);

        return { name: file.name, url: publicUrl };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...results]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let publicProfileLink = formData.publicProfileLink.trim();
      
      if (publicProfileLink && !publicProfileLink.startsWith('http://') && !publicProfileLink.startsWith('https://')) {
        publicProfileLink = 'https://' + publicProfileLink;
      }

      const trimmedFormData = {
        ...formData,
        fullName: formData.fullName.trim(),
        professionalEmail: formData.professionalEmail.trim(),
        password: formData.password.trim(),
        companyId: formData.companyId.trim(),
        verificationDocuments: formData.verificationDocuments.trim(),
        publicProfileLink: publicProfileLink
      };

      if (!trimmedFormData.brandId || !trimmedFormData.fullName || !trimmedFormData.professionalEmail || !trimmedFormData.password || !trimmedFormData.publicProfileLink) {
        throw new Error('Brand, full name, email, password, and LinkedIn profile link are required');
      }

      const documentUrls = uploadedFiles.map(f => f.url).join(',');
      const verificationDocuments = documentUrls || trimmedFormData.verificationDocuments;

      const { data, error: functionError } = await supabase.functions.invoke('brand-user', {
        body: {
          action: 'claim',
          email: trimmedFormData.professionalEmail,
          fullName: trimmedFormData.fullName,
          brandId: trimmedFormData.brandId,
          companyId: trimmedFormData.companyId,
          verificationDocuments: verificationDocuments,
          publicProfileLink: trimmedFormData.publicProfileLink
        }
      });

      if (functionError) throw functionError;

      setShowSuccessDialog(true);
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

  if (showSuccessDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Thank you for claiming your brand access. Allow us between 24 to 72 hours to verify your claim and approve your access. You will be notified by email.
              </p>
              <Button 
                onClick={onSuccess}
                className="w-full mt-6"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
                <Label htmlFor="brand">Brand *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="brand"
                    type="text"
                    placeholder="Search for a brand..."
                    value={showBrandDropdown ? brandSearch : (selectedBrand?.name || '')}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    onFocus={() => setShowBrandDropdown(true)}
                    onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                    className="pl-9"
                  />
                  
                  {showBrandDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                          <button
                            key={brand.id}
                            type="button"
                            onMouseDown={() => handleBrandSelect(brand.id)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {brand.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">No brands found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="full-name">Full Name *</Label>
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
                <Label htmlFor="professional-email">Professional Email *</Label>
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
                    placeholder="Create a strong password"
                    required
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
                {passwordStrength.strength > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
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
                <Label htmlFor="public-profile">LinkedIn Profile Link (MANDATORY)</Label>
                <Input
                  id="public-profile"
                  type="url"
                  value={formData.publicProfileLink}
                  onChange={(e) => setFormData({...formData, publicProfileLink: e.target.value})}
                  placeholder="linkedin.com/company/yourcompany"
                  required
                />
              </div>

              <div>
                <Label htmlFor="verification-docs">Verification Documents</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Documents'}
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <span className="truncate" title={file.name}>{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Textarea
                    id="verification-docs-text"
                    value={formData.verificationDocuments}
                    onChange={(e) => setFormData({...formData, verificationDocuments: e.target.value})}
                    placeholder="Or describe any documents or proof of employment you can provide"
                    rows={2}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !formData.brandId || !formData.fullName || !formData.professionalEmail || !formData.password}
              >
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