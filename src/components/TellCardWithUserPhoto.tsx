import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, ThumbsUp, ThumbsDown, MessageCircle, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface Tell {
  id: string;
  title: string;
  content: string;
  brand_name: string;
  category: string;
  rating: number;
  created_at: string;
  location?: string;
  user_id: string;
  user_name?: string;
  likes_count?: number;
  comments_count?: number;
  tell_type?: 'BrandBeat' | 'BrandBlast';
}

interface TellCardWithUserPhotoProps {
  tell: Tell;
  onClick?: () => void;
}

const TELLER_PLACEHOLDER = "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png";

export default function TellCardWithUserPhoto({ tell, onClick }: TellCardWithUserPhotoProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        // First check if this is the current user's tell
        if (userProfile && tell.user_id === userProfile.id) {
          setUserPhoto(userProfile.profile_photo_url || TELLER_PLACEHOLDER);
          setLoading(false);
          return;
        }

        // Otherwise fetch from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('profile_photo_url, full_name')
          .eq('id', tell.user_id)
          .single();

        if (!userError && userData?.profile_photo_url) {
          setUserPhoto(userData.profile_photo_url);
        } else {
          setUserPhoto(TELLER_PLACEHOLDER);
        }
      } catch (error) {
        // On any error, use placeholder
        setUserPhoto(TELLER_PLACEHOLDER);
      } finally {
        setLoading(false);
      }
    };

    if (tell.user_id) {
      fetchUserPhoto();
    } else {
      setUserPhoto(TELLER_PLACEHOLDER);
      setLoading(false);
    }
  }, [tell.user_id, userProfile]); // Add userProfile as dependency

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTellTypeColor = (tellType: string) => {
    if (tellType === 'BrandBeat') return 'bg-purple-100 text-purple-800';
    if (tellType === 'BrandBlast') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:shadow-xl hover:-translate-y-1" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Left side - User photo and content */}
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={loading ? TELLER_PLACEHOLDER : (userPhoto || TELLER_PLACEHOLDER)} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {tell.user_name?.charAt(0) || 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {/* Tell type indicator and Teller name */}
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-gray-900">
                  {tell.user_name || 'Anonymous Teller'}
                </div>
                {tell.tell_type === 'BrandBlast' ? (
                  <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <ThumbsDown className="w-3 h-3" />
                    <span>BrandBlast</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <ThumbsUp className="w-3 h-3" />
                    <span>BrandBeat</span>
                  </div>
                )}
              </div>
              
              {/* Brand name */}
              <div className="text-sm font-medium text-blue-600 mb-2">
                {tell.brand_name}
              </div>
              
              {/* Tell title */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tell.title}
              </h3>
              
              {/* Truncated tell message */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {tell.content || "This is a sample tell message that has been truncated to show how the content appears in the card. The full message would contain more details about the brand experience shared by the user."}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(tell.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{tell.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{tell.comments_count || 0}</span>
                </div>
                <Badge className={`${getRatingColor(tell.rating)} border-0 font-medium ml-auto`}>
                  ⭐ {tell.rating}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Right side - Brand logo */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757139582017_987fbdbd.jpg" 
                alt={`${tell.brand_name} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}