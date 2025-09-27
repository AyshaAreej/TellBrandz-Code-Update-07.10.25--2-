import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  step: TutorialStep;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  onNext,
  onSkip,
  isLastStep
}) => {
  const getTargetElement = () => {
    return document.querySelector(step.targetSelector);
  };

  const getOverlayPosition = () => {
    const target = getTargetElement();
    if (!target) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    switch (step.position) {
      case 'top':
        return {
          top: rect.top + scrollTop - 10,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: rect.bottom + scrollTop + 10,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.left + scrollLeft - 10,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.right + scrollLeft + 10,
          transform: 'translate(0, -50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  const highlightTarget = () => {
    const target = getTargetElement();
    if (target) {
      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  React.useEffect(() => {
    highlightTarget();
    return () => {
      const target = getTargetElement();
      if (target) {
        target.classList.remove('tutorial-highlight');
      }
    };
  }, [step]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" />
      <Card 
        className="fixed z-50 w-80 shadow-lg"
        style={getOverlayPosition()}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm">{step.title}</h4>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">{step.description}</p>
          <Button onClick={onNext} size="sm" className="w-full">
            {isLastStep ? 'Finish' : 'Next'}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TutorialOverlay;