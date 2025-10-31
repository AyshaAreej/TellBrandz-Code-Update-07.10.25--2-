import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import TellerDashboard from '@/components/TellerDashboard';
import { BrandDashboard } from '@/components/BrandDashboard';
import { BrandProfile } from '@/components/BrandProfile';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // local state for full user record from "users" table
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?returnTo=/dashboard');
    }
  }, [user, loading, navigate]);

  // Fetch additional user details (brand_id, verification_status, etc.)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;

      try {
        setFetching(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null; // Redirects to auth if not logged in
  }

  // Extract user info
  const userType = userData.user_type;
  const verificationStatus = userData.verification_status;
  const brandId = userData.brand_id;

  // Logic based on fetched data
  const isVerifiedBrand = userType === 'brand' && verificationStatus === 'approved' && !!brandId;
  const isBrand = userType === 'brand' && verificationStatus !== 'approved';   
console.log('isBrand:', isBrand);
console.log('isverifiedBrand:', isVerifiedBrand);
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
      <Header onAuthClick={() => navigate('/auth')} isDashboard />
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
