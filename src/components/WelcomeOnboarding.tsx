import React from 'react';
import { MessageSquare, Star, Users, TrendingUp, Lightbulb, Heart } from 'lucide-react';
import OnboardingTutorial from './OnboardingTutorial';
import { useOnboarding } from '@/hooks/useOnboarding';

const WelcomeOnboarding: React.FC = () => {
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to TellBrandz!',
      description: 'Share your experiences with brands and help build a community of informed consumers.',
      icon: <Heart className="h-6 w-6 text-yellow-500" />
    },
    {
      id: 'brandbeat',
      title: 'What is a BrandBeat?',
      description: 'A BrandBeat is when you share positive experiences and praise about a brand. Help others discover great products and services!',
      icon: <Star className="h-6 w-6 text-green-500" />
    },
    {
      id: 'brandblast',
      title: 'What is a BrandBlast?',
      description: 'A BrandBlast is when you share concerns or complaints about a brand. Help others make informed decisions and encourage brands to improve.',
      icon: <MessageSquare className="h-6 w-6 text-red-500" />
    },
    {
      id: 'community',
      title: 'Join the Community',
      description: 'Browse stories from other users, discover trending brands, and build your reputation as a trusted reviewer.',
      icon: <Users className="h-6 w-6 text-blue-500" />
    },
    {
      id: 'impact',
      title: 'Make an Impact',
      description: 'Your stories help other consumers and encourage brands to maintain high standards. Every voice matters!',
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />
    },
    {
      id: 'start',
      title: 'Ready to Start?',
      description: 'Let\'s create your first story! Choose whether to share a positive BrandBeat or a constructive BrandBlast.',
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />
    }
  ];

  const handleComplete = () => {
    markOnboardingComplete();
  };

  return (
    <OnboardingTutorial
      isOpen={shouldShowOnboarding()}
      onClose={() => markOnboardingComplete()}
      steps={onboardingSteps}
      onComplete={handleComplete}
    />
  );
};

export default WelcomeOnboarding;