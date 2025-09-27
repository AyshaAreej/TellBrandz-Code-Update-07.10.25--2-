import React, { useState, useEffect } from 'react';
import TutorialOverlay from './TutorialOverlay';
import { useOnboarding } from '@/hooks/useOnboarding';

interface TellFormTutorialProps {
  isFormVisible: boolean;
}

const TellFormTutorial: React.FC<TellFormTutorialProps> = ({ isFormVisible }) => {
  const { shouldShowTutorial, markTutorialViewed } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tutorialSteps = [
    {
      id: 'type-select',
      title: 'Choose Your Story Type',
      description: 'Select BrandBeat for positive experiences or BrandBlast for concerns and complaints.',
      targetSelector: '[data-tutorial="experience-type"]',
      position: 'bottom' as const
    },
    {
      id: 'brand-name',
      title: 'Enter Brand Name',
      description: 'Type the name of the brand you want to review. Be specific to help others find it easily.',
      targetSelector: '[data-tutorial="brand-name"]',
      position: 'bottom' as const
    },
    {
      id: 'title',
      title: 'Write a Clear Title',
      description: 'Create a brief, descriptive title that summarizes your experience.',
      targetSelector: '[data-tutorial="title"]',
      position: 'bottom' as const
    },
    {
      id: 'description',
      title: 'Share Your Story',
      description: 'Provide detailed information about your experience. Be honest and constructive.',
      targetSelector: '[data-tutorial="description"]',
      position: 'top' as const
    },
    {
      id: 'image',
      title: 'Add Visual Evidence',
      description: 'Upload an image to support your story (optional but recommended).',
      targetSelector: '[data-tutorial="image-upload"]',
      position: 'top' as const
    }
  ];

  useEffect(() => {
    if (isFormVisible && shouldShowTutorial()) {
      // Small delay to ensure form is rendered
      setTimeout(() => {
        setIsActive(true);
      }, 500);
    } else {
      setIsActive(false);
    }
  }, [isFormVisible, shouldShowTutorial]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    markTutorialViewed();
  };

  const handleComplete = () => {
    setIsActive(false);
    markTutorialViewed();
    setCurrentStep(0);
  };

  if (!isActive) return null;

  return (
    <TutorialOverlay
      step={tutorialSteps[currentStep]}
      onNext={handleNext}
      onSkip={handleSkip}
      isLastStep={currentStep === tutorialSteps.length - 1}
    />
  );
};

export default TellFormTutorial;