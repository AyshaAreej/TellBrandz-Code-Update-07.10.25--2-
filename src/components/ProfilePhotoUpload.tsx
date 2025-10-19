import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate?: (photoUrl: string) => void;
}

export function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string | undefined>(currentPhotoUrl);
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateProfilePhoto } = useUserProfile();

  // Keep local preview in sync if parent/context updates the url
  useEffect(() => {
    setDisplayUrl(currentPhotoUrl);
  }, [currentPhotoUrl]);

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!user?.id) {
        throw new Error('Please sign in before uploading a profile photo.');
      }
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.includes('.') ? file.name.split('.').pop() : 'png';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tell-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || `image/${fileExt}`
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('tell-images')
        .getPublicUrl(filePath);

      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Update global context and local preview
      updateProfilePhoto(data.publicUrl);
      setDisplayUrl(data.publicUrl);
      
      // Call local callback if provided
      onPhotoUpdate?.(data.publicUrl);
      
      toast({
        title: 'Success',
        description: 'Profile photo updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error uploading photo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={displayUrl || 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png'} />
        <AvatarFallback>
          <Camera className="w-8 h-8 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      
      <div className="relative">
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={uploadPhoto}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button disabled={uploading} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>
    </div>
  );
}