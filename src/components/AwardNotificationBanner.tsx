import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AwardNotification {
  id: string;
  brand_name: string;
  award_name: string;
  award_tier: string;
  date_achieved: string;
}

const AwardNotificationBanner: React.FC = () => {
  const [notifications, setNotifications] = useState<AwardNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchRecentAwards();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
      
      // Auto-rotate through notifications every 5 seconds
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % notifications.length);
      }, 5000);

      // Auto-hide after 30 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(hideTimer);
      };
    }
  }, [notifications]);

  const fetchRecentAwards = async () => {
    try {
      // Check if we have a valid connection first
      const { data: testData, error: testError } = await supabase
        .from('awards')
        .select('count')
        .limit(1);

      if (testError) {
        console.warn('Supabase connection issue, skipping award notifications');
        return;
      }

      // Get awards from the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: awards, error } = await supabase
        .from('awards')
        .select(`
          id,
          award_name,
          award_tier,
          date_achieved,
          brands!inner(name)
        `)
        .gte('date_achieved', yesterday.toISOString())
        .order('date_achieved', { ascending: false })
        .limit(3);

      if (error) throw error;

      const formattedNotifications = awards?.map(award => ({
        id: award.id,
        brand_name: award.brands.name,
        award_name: award.award_name,
        award_tier: award.award_tier,
        date_achieved: award.date_achieved
      })) || [];

      setNotifications(formattedNotifications);
    } catch (error) {
      console.warn('Awards unavailable:', error);
      // Fail silently - don't show notifications if there's an API issue
    }
  };

  const getAwardEmoji = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '🏆';
      default: return '🌟';
    }
  };

  const getAwardMessage = (notification: AwardNotification) => {
    const emoji = getAwardEmoji(notification.award_tier);
    const messages = {
      bronze: `${emoji} Congratulations to ${notification.brand_name} for earning the Bronze BrandBeat Award! Your positive customer feedback in Nigeria is valued!`,
      silver: `${emoji} Big news! ${notification.brand_name} has reached a Silver milestone with their BrandBeats! Thank you, customers!`,
      gold: `${emoji} ${notification.brand_name} just received the Gold BrandBeat Award! A testament to their great service in Nigeria.`,
      platinum: `${emoji} Incredible achievement! ${notification.brand_name} has earned the Platinum BrandBeat Award! One million positive stories!`
    };
    
    return messages[notification.award_tier as keyof typeof messages] || 
           `${emoji} ${notification.brand_name} has earned a ${notification.award_name}!`;
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const currentNotification = notifications[currentIndex];

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
      <div className="container mx-auto px-4">
        <Alert className="border-0 bg-transparent text-black">
          <Trophy className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              {getAwardMessage(currentNotification)}{' '}
              <Link 
                to={`/brand/${currentNotification.brand_name.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-semibold underline hover:no-underline"
              >
                View {currentNotification.brand_name}'s Profile
              </Link>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 hover:bg-black/10 rounded p-1"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AwardNotificationBanner;