import React from 'react';
import { useNavigate } from 'react-router-dom';
import TellFormEnhanced from '@/components/TellFormEnhanced';
import { useAuth } from '@/hooks/useAuth';
import AuthFormFixed from '@/components/AuthFormFixed';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ShareExperience = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    navigate('/');
  };

  // If user is not authenticated, show auth form first
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onAuthClick={() => navigate('/auth')} />
        <main className="flex-1">
          <AuthFormFixed redirectTo="/share-experience" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAuthClick={() => navigate('/auth')} />
      <main className="flex-1">
        <TellFormEnhanced onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
};

export default ShareExperience;