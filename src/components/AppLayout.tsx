import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { useAdmin } from '@/hooks/useAdmin';
import Header from './Header';
import HomePage from './HomePage';
import TellFormEnhanced from './TellFormEnhanced';
import AuthFormFixed from './AuthFormFixed';
import BrandClaimForm from './BrandClaimForm';
import { UserProfile } from './UserProfile';
import { BrandProfile } from './BrandProfile';
import { AdminPanel } from './AdminPanel';
import TellerDashboard from './TellerDashboard';
import { BrandDashboard } from './BrandDashboard';
import AdvancedSearchEngine from './AdvancedSearchEngine';
import Footer from './Footer';
import { InstallPrompt } from './InstallPrompt';


const AppLayout: React.FC = () => {
  const { currentView, setCurrentView, user, logout } = useAppContext();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setCurrentView('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTellStoryClick = () => {
    setCurrentView('tell-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage 
          onCreateTell={() => { setCurrentView('tell-form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onAuthClick={handleAuthClick}
          onBrowseStories={() => { navigate('/browse-stories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />;
      case 'tell-form':
        return <TellFormEnhanced onBack={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
      case 'auth':
        return <AuthFormFixed onBack={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} showHeader={false} />;
      case 'brand-claim':
        return <BrandClaimForm 
          onBack={() => { setCurrentView('auth'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          onSuccess={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />;
      case 'search':
        return <div className="container mx-auto py-8"><AdvancedSearchEngine /></div>;
      case 'profile':
        // Determine user type based on verification status and brand_id
        const isVerifiedBrand = user?.verification_status === 'approved' && user?.brand_id;
        const isBrand = user?.user_metadata?.user_type === 'brand';
        
        if (isVerifiedBrand) {
          return <BrandDashboard />;
        } else if (isBrand) {
          return <BrandProfile />;
        } else if (user) {
          return <TellerDashboard />;
        } else {
          return <UserProfile />;
        }
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage 
          onCreateTell={() => { setCurrentView('tell-form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onAuthClick={handleAuthClick}
          onBrowseStories={() => { navigate('/browse-stories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />;
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <Header 
        onAuthClick={handleAuthClick}
      />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
};

export default AppLayout;
