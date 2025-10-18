import { useState, useEffect } from 'react';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasCreatedFirstTell: boolean;
  hasViewedTutorial: boolean;
}

const ONBOARDING_STORAGE_KEY = 'tellbrandz_onboarding';

export const useOnboarding = () => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(() => {
    // Check for new storage key first
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          hasCompletedOnboarding: false,
          hasCreatedFirstTell: false,
          hasViewedTutorial: false
        };
      }
    }

    // Check for old storage key and migrate if found
    const oldStored = localStorage.getItem('brandbeats_onboarding');
    if (oldStored) {
      try {
        const oldState = JSON.parse(oldStored);
        // Remove old storage
        localStorage.removeItem('brandbeats_onboarding');
        // Save to new storage key
        localStorage.setItem(ONBOARDING_STORAGE_KEY, oldStored);
        return oldState;
      } catch {
        // If parsing fails, start fresh
      }
    }

    return {
      hasCompletedOnboarding: false,
      hasCreatedFirstTell: false,
      hasViewedTutorial: false
    };
  });

  const updateOnboardingState = (updates: Partial<OnboardingState>) => {
    const newState = { ...onboardingState, ...updates };
    setOnboardingState(newState);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
  };

  const markOnboardingComplete = () => {
    updateOnboardingState({ hasCompletedOnboarding: true });
  };

  const markFirstTellCreated = () => {
    updateOnboardingState({ hasCreatedFirstTell: true });
  };

  const markTutorialViewed = () => {
    updateOnboardingState({ hasViewedTutorial: true });
  };

  const resetOnboarding = () => {
    const resetState = {
      hasCompletedOnboarding: false,
      hasCreatedFirstTell: false,
      hasViewedTutorial: false
    };
    setOnboardingState(resetState);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(resetState));
  };

  const shouldShowOnboarding = () => {
    return !onboardingState.hasCompletedOnboarding;
  };

  const shouldShowTutorial = () => {
    return !onboardingState.hasViewedTutorial && onboardingState.hasCompletedOnboarding;
  };

  return {
    onboardingState,
    markOnboardingComplete,
    markFirstTellCreated,
    markTutorialViewed,
    resetOnboarding,
    shouldShowOnboarding,
    shouldShowTutorial
  };
};