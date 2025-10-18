import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AwardAnnouncementProps {
  brandName: string;
  awardTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  onClose: () => void;
  brandSlug?: string;
}

const AwardAnnouncement: React.FC<AwardAnnouncementProps> = ({ 
  brandName, 
  awardTier, 
  onClose,
  brandSlug 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getAnnouncementText = (tier: string) => {
    const messages = {
      bronze: `🎉 Congratulations to ${brandName} for earning the Bronze BrandBeat Award! Your positive customer feedback in Nigeria is valued!`,
      silver: `🌟 Big news! ${brandName} has reached a Silver milestone with their BrandBeats! Thank you, customers!`,
      gold: `🏆 ${brandName} just received the Gold BrandBeat Award! A testament to their great service in Nigeria.`,
      platinum: `🚀 Incredible achievement! ${brandName} has earned the Platinum BrandBeat Award! One million positive stories!`
    };
    return messages[tier as keyof typeof messages];
  };

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const handleBrandClick = () => {
    if (brandSlug) {
      window.location.href = `/brand/${brandSlug}`;
    }
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Alert className="max-w-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
        <Trophy className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            {getAnnouncementText(awardTier).split(brandName).map((part, index, array) => 
              index < array.length - 1 ? (
                <React.Fragment key={index}>
                  {part}
                  <button
                    onClick={handleBrandClick}
                    className="font-semibold text-blue-600 hover:text-blue-800 underline"
                  >
                    {brandName}
                  </button>
                </React.Fragment>
              ) : part
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-4 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AwardAnnouncement;