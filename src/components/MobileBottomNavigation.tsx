import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search, Zap, User, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

interface MobileBottomNavigationProps {
  onTellStoryClick: () => void;
  onAuthClick: () => void;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  onTellStoryClick,
  onAuthClick
}) => {
  const location = useLocation();
  const { user, setCurrentView } = useAppContext();

  const isActive = (path: string) => location.pathname === path;

  const handleSearchClick = () => {
    setCurrentView('search');
  };

  const handleProfileClick = () => {
    if (user) {
      setCurrentView('profile');
    } else {
      onAuthClick();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {/* Home */}
        <Link to="/" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full transition-colors ${
            isActive('/') ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-orange-600'
          }`}>
            <Home className="h-5 w-5" />
          </div>
          <span className={`text-xs mt-1 ${
            isActive('/') ? 'text-orange-600 font-medium' : 'text-gray-500'
          }`}>
            Home
          </span>
        </Link>

        {/* Brands */}
        <Link to="/brands" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full transition-colors ${
            isActive('/brands') ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-orange-600'
          }`}>
            <Building2 className="h-5 w-5" />
          </div>
          <span className={`text-xs mt-1 ${
            isActive('/brands') ? 'text-orange-600 font-medium' : 'text-gray-500'
          }`}>
            Brands
          </span>
        </Link>

        {/* Tell Story - Center Button */}
        <Button
          onClick={onTellStoryClick}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 rounded-full p-3 shadow-lg transform hover:scale-105 transition-all"
        >
          <Zap className="h-6 w-6" />
        </Button>

        {/* Search */}
        <button 
          onClick={handleSearchClick}
          className="flex flex-col items-center p-2"
        >
          <div className={`p-2 rounded-full transition-colors ${
            location.pathname.includes('/search') ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-orange-600'
          }`}>
            <Search className="h-5 w-5" />
          </div>
          <span className={`text-xs mt-1 ${
            location.pathname.includes('/search') ? 'text-orange-600 font-medium' : 'text-gray-500'
          }`}>
            Search
          </span>
        </button>

        {/* Profile */}
        <button 
          onClick={handleProfileClick}
          className="flex flex-col items-center p-2"
        >
          <div className={`p-2 rounded-full transition-colors ${
            location.pathname.includes('/profile') || location.pathname.includes('/auth') ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:text-orange-600'
          }`}>
            <User className="h-5 w-5" />
          </div>
          <span className={`text-xs mt-1 ${
            location.pathname.includes('/profile') || location.pathname.includes('/auth') ? 'text-orange-600 font-medium' : 'text-gray-500'
          }`}>
            {user ? 'Profile' : 'Login'}
          </span>
        </button>
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </div>
  );
};

export default MobileBottomNavigation;