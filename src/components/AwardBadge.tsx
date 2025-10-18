import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Award {
  id: string;
  award_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  award_name: string;
  date_achieved: string;
  brand_beats_count: number;
}

interface AwardBadgeProps {
  award: Award;
  brandName: string;
}

const AwardBadge: React.FC<AwardBadgeProps> = ({ award, brandName }) => {
  const getAwardImage = (tier: string) => {
    const images = {
      bronze: "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754926915832_7006b4df.png",
      silver: "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754926914642_c6d3db5f.png", 
      gold: "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754926912645_cd63c8ea.png",
      platinum: "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754926910440_0519cb50.png"
    };
    return images[tier as keyof typeof images];
  };

  const getTooltipText = (tier: string, date: string) => {
    const messages = {
      bronze: `Bronze Award - Achieved on ${new Date(date).toLocaleDateString()}. Thank you to our customers for your positive feedback!`,
      silver: `Silver Award - Achieved on ${new Date(date).toLocaleDateString()}. We appreciate your continued support!`,
      gold: `Gold Award - Achieved on ${new Date(date).toLocaleDateString()}. We are committed to providing excellent experiences for our customers in Nigeria!`,
      platinum: `Platinum Award - Achieved on ${new Date(date).toLocaleDateString()}. A million thanks to our incredible community for sharing their positive stories!`
    };
    return messages[tier as keyof typeof messages];
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative group cursor-pointer">
            <img
              src={getAwardImage(award.award_tier)}
              alt={`${award.award_name} Badge`}
              className="w-16 h-16 hover:scale-110 transition-transform duration-200"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">
            {getTooltipText(award.award_tier, award.date_achieved)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AwardBadge;