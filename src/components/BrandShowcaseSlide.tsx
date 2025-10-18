import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp } from 'lucide-react';
import { BeFirstModal } from './BeFirstModal';
import { isPlaceholderTell } from '@/utils/tellUtils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
interface BrandShowcaseSlideProps {
  id: string;
  brandLogo: string;
  brandName: string;
  tellTitle: string;
  tellSlug?: string;
  tellerPhoto: string;
  tellerFirstName: string;
  tellerLocation: string;
  brandBlastsCount: number;
  brandBeatsCount: number;
  type: 'brand_blast' | 'brand_beat';
  commentsLink: string;
}

export function BrandShowcaseSlide({
  id,
  brandLogo,
  brandName,
  tellTitle,
  tellSlug,
  tellerPhoto,
  tellerFirstName,
  tellerLocation,
  brandBlastsCount,
  brandBeatsCount,
  type,
  commentsLink
}: BrandShowcaseSlideProps) {
  const [showBeFirstModal, setShowBeFirstModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profile_photo_url')
        .eq('id', user?.id)
        .single();
      if (!error) setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const handleReadMore = () => {
    console.log(`Testing handleReadMore for ID: ${id}`);
    console.log(`Is placeholder: ${isPlaceholderTell(id)}`);
    
    if (isPlaceholderTell(id)) {
      // Placeholder tell - redirect to how it works page
      console.log('Navigating to /how-it-works#dummy-tell');
      navigate('/how-it-works#dummy-tell');
    } else {
      // Real tell - navigate to tell page
      const url = tellSlug ? `/tell/${tellSlug}` : `/tell/${id}`;
      console.log(`Navigating to real tell: ${url}`);
      navigate(url);
    }
  };
  
  const handleComments = () => {
    console.log(`Testing handleComments for ID: ${id}`);
    console.log(`Is placeholder: ${isPlaceholderTell(id)}`);
    
    if (isPlaceholderTell(id)) {
      // Placeholder tell - show modal
      console.log('Showing BeFirstModal');
      setShowBeFirstModal(true);
    } else {
      // Real tell - navigate to comments section
      const url = tellSlug ? `/tell/${tellSlug}#comments` : `/tell/${id}#comments`;
      console.log(`Navigating to real tell comments: ${url}`);
      navigate(url);
    }
  };
  
  const handleSignUp = () => {
    setShowBeFirstModal(false);
    // Store the current tell info for redirect after signup
    const tellInfo = {
      id,
      brandName,
      tellTitle,
      tellSlug,
      returnTo: tellSlug ? `/tell/${tellSlug}#comments` : `/tell/${id}#comments`
    };
    localStorage.setItem('pendingComment', JSON.stringify(tellInfo));
    // Navigate to signup with return URL
    navigate('/auth?mode=signup&returnTo=' + encodeURIComponent(tellInfo.returnTo));
  };

  return (
    <>
      <div className="container mx-auto px-8 md:px-4 text-center relative z-10 max-w-4xl">
        {/* Top row: Logo and data - Closer spacing on mobile */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-3">
          {/* Brand Logo - Larger */}
          <div className="flex-shrink-0">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1755697625237_4987f07a.jpg"
              alt={brandName}
              className="w-32 h-32 object-contain rounded-xl shadow-2xl bg-white/95 p-3"
            />
          </div>

          {/* Right side data stack - Spread to match logo height */}
          <div className="flex flex-col justify-between h-32 items-start py-2">
            {/* Brand counts */}
            <div className="flex items-center gap-4 text-white text-sm font-medium">
              <span>{brandBlastsCount} BrandBlasts</span>
              <span>{brandBeatsCount} BrandBeats</span>
            </div>
            
            {/* Type badge - Wider to match counts above */}
            {type === 'brand_blast' ? (
              <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-full text-sm w-full justify-center">
                <ThumbsDown className="w-4 h-4" />
                <span>BrandBlast</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm w-full justify-center">
                <ThumbsUp className="w-4 h-4" />
                <span>BrandBeat</span>
              </div>
            )}

            {/* Teller info - Larger profile */}
            {/* Teller info - Larger profile */}
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userProfile?.profile_photo_url || 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png'} alt={tellerFirstName} />
                <AvatarFallback>{tellerFirstName[0]}</AvatarFallback>
               </Avatar>
              <div className="text-white text-left text-sm">
                <div className="font-medium">{tellerFirstName}</div>
                <div className="opacity-75 text-xs">{tellerLocation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tell Title - Centralized */}
        <p className="text-lg md:text-xl text-gray-200 mb-6 text-center">
          "{tellTitle}"
        </p>
        
        {/* CTA Buttons - More space from tell title */}
        <div className="flex justify-center items-center gap-4">
          <Button 
            size="sm"
            className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-4 py-2 rounded-lg text-sm"
            onClick={handleReadMore}
          >
            Read More
          </Button>
          <Button 
            size="sm"
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black font-semibold px-4 py-2 rounded-lg text-sm"
            onClick={handleComments}
          >
            Comments
          </Button>
        </div>
      </div>
      
      <BeFirstModal 
        isOpen={showBeFirstModal}
        onClose={() => setShowBeFirstModal(false)}
        onSignUp={handleSignUp}
      />
    </>
  );
};