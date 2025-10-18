import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useTells } from '@/hooks/useTells';
import { supabase } from '@/lib/supabase';
import TellFormTutorial from './TellFormTutorial';
import { BrandLogoFetcher } from './BrandLogoFetcher';

interface TellFormProps {
  onBack?: () => void;
}

const TellForm: React.FC<TellFormProps> = ({ onBack }) => {
  const { submitTell } = useTells();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    type: 'BrandBlast' as 'BrandBlast' | 'BrandBeat',
    title: '',
    description: '',
    brand_name: '',
    image_url: '',
    age_range: '',
    occupation: '',
    income_range: '',
    education_level: '',
    household_size: undefined as number | undefined,
  });


  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('tell-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('tell-images')
        .getPublicUrl(fileName);
      
      setFormData({...formData, image_url: publicUrl});
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({...formData, image_url: ''});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitTell(formData);
      onBack?.();
    } catch (error) {
      console.error('Failed to submit tell:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TellFormTutorial isFormVisible={true} />
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-tutorial="experience-type">
                <Label>Experience Type</Label>
                <Select value={formData.type} onValueChange={(value: 'BrandBlast' | 'BrandBeat') => 
                  setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BrandBlast">BrandBlast (Complaint)</SelectItem>
                    <SelectItem value="BrandBeat">BrandBeat (Praise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div data-tutorial="brand-name">
                <Label htmlFor="brand">Brand Name</Label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      id="brand"
                      value={formData.brand_name}
                      onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                  {formData.brand_name && (
                    <BrandLogoFetcher 
                      brandName={formData.brand_name}
                      className="w-12 h-12 flex-shrink-0"
                    />
                  )}
                </div>
              </div>

              <div data-tutorial="title">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Brief title for your experience"
                  required
                />
              </div>

              <div data-tutorial="description">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your experience in detail"
                  rows={6}
                  required
                />
              </div>

              <div data-tutorial="image-upload">
                <Label>Upload Image (Optional)</Label>
                <div className="mt-2">
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {uploadingImage ? 'Uploading...' : 'Click to upload an image'}
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Optional: Help Us Understand Context</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Providing demographic information helps brands understand their customers better. All fields are optional.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age_range">Age Range</Label>
                    <Select value={formData.age_range} onValueChange={(v) => setFormData({...formData, age_range: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prefer not to say" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Prefer not to say</SelectItem>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55-64">55-64</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      placeholder="Prefer not to say"
                    />
                  </div>

                  <div>
                    <Label htmlFor="income_range">Income Range</Label>
                    <Select value={formData.income_range} onValueChange={(v) => setFormData({...formData, income_range: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prefer not to say" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Prefer not to say</SelectItem>
                        <SelectItem value="<25k">Less than $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="100k+">$100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="education_level">Education Level</Label>
                    <Select value={formData.education_level} onValueChange={(v) => setFormData({...formData, education_level: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Prefer not to say" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Prefer not to say</SelectItem>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="associate">Associate Degree</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="household_size">Household Size</Label>
                    <Input
                      id="household_size"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.household_size || ''}
                      onChange={(e) => setFormData({...formData, household_size: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Prefer not to say"
                    />
                  </div>
                </div>
              </div>


              <Button type="submit" className="w-full" disabled={loading || uploadingImage}>
                {loading ? 'Submitting...' : 'Submit Experience'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TellForm;
