import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import TellerDashboard from '@/components/TellerDashboard';
import { BrandDashboard } from '@/components/BrandDashboard';
import { BrandProfile } from '@/components/BrandProfile';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?returnTo=/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  // Determine user type and show appropriate dashboard
  const isVerifiedBrand = user?.verification_status === 'approved' && user?.brand_id;
  const isBrand = user?.user_metadata?.user_type === 'brand';

  const renderDashboard = () => {
    if (isVerifiedBrand) {
      return <BrandDashboard />;
    } else if (isBrand) {
      return <BrandProfile />;
    } else {
      return <TellerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAuthClick={() => navigate('/auth')} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;