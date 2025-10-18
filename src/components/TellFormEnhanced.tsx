import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, Image, Video, FileText } from 'lucide-react';
import { useTells } from '@/hooks/useTells';
import { supabase } from '@/lib/supabase';
import { BrandLogoFetcher } from './BrandLogoFetcher';
import SuccessNotification from './SuccessNotification';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  url?: string;
  type: 'image' | 'video';
  uploading: boolean;
}

interface TellFormEnhancedProps {
  onBack?: () => void;
}

const TellFormEnhanced: React.FC<TellFormEnhancedProps> = ({ onBack }) => {
  const { submitTell } = useTells();
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'BrandBlast' as 'BrandBlast' | 'BrandBeat',
    title: '',
    description: '',
    brand_name: '',
  });

  const uploadFile = async (file: File, mediaId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${mediaId}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('tell-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('tell-images')
        .getPublicUrl(fileName);
      
      setMediaFiles(prev => prev.map(media => 
        media.id === mediaId 
          ? { ...media, url: publicUrl, uploading: false }
          : media
      ));
    } catch (error) {
      console.error('File upload failed:', error);
      setMediaFiles(prev => prev.map(media => 
        media.id === mediaId 
          ? { ...media, uploading: false }
          : media
      ));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const mediaId = `${Date.now()}_${Math.random()}`;
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        const newMedia: MediaFile = {
          id: mediaId,
          file,
          preview: reader.result as string,
          type: isVideo ? 'video' : 'image',
          uploading: true
        };
        
        setMediaFiles(prev => [...prev, newMedia]);
        uploadFile(file, mediaId);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const removeMedia = (mediaId: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const uploadedUrls = mediaFiles
        .filter(media => media.url)
        .map(media => media.url!);
      
      await submitTell({
        ...formData,
        evidence_urls: uploadedUrls,
        image_url: uploadedUrls[0] || '' // Keep backward compatibility
      });
      
      // Show success notification
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        type: 'BrandBlast',
        title: '',
        description: '',
        brand_name: '',
      });
      setMediaFiles([]);
      
      // Navigate back after delay
      setTimeout(() => {
        onBack?.();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit tell:', error);
      alert('Failed to submit experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasUploadingFiles = mediaFiles.some(media => media.uploading);

  return (
    <>
      <SuccessNotification
        show={showSuccess}
        message="Experience shared successfully! Thank you for your feedback."
        onClose={() => setShowSuccess(false)}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
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
                <div>
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
                <div>
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

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief title for your experience"
                    required
                  />
                </div>

                <div>
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

                <div>
                  <Label>Upload Images & Videos (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="media-upload"
                        multiple
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload images and videos
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports JPG, PNG, MP4, MOV files
                        </p>
                      </label>
                    </div>

                    {/* Media Previews */}
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {mediaFiles.map((media) => (
                          <div key={media.id} className="relative">
                            {media.type === 'image' ? (
                              <div className="relative">
                                <img
                                  src={media.preview}
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute top-2 left-2">
                                  <Image className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-0.5" />
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <video
                                  src={media.preview}
                                  className="w-full h-32 object-cover rounded-lg"
                                  controls={false}
                                />
                                <div className="absolute top-2 left-2">
                                  <Video className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-0.5" />
                                </div>
                              </div>
                            )}
                            
                            {media.uploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                <div className="text-white text-sm">Uploading...</div>
                              </div>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || hasUploadingFiles}
                >
                  {loading ? 'Submitting...' : hasUploadingFiles ? 'Uploading files...' : 'Submit Experience'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TellFormEnhanced;