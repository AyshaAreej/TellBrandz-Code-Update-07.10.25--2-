import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Zap, Shield, Building2, ChevronDown, X } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface EnhancedMobileMenuProps {
  onAuthClick: () => void;
  onTellStoryClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedMobileMenu: React.FC<EnhancedMobileMenuProps> = ({ 
  onAuthClick, 
  onTellStoryClick, 
  isOpen, 
  onClose 
}) => {
  const { setCurrentView, user } = useAppContext();
  const { userProfile } = useUserProfile();
  const { isAdmin } = useAdmin();
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => setIsMenuVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAuthClick = () => {
    onAuthClick();
    onClose();
  };

  const handleTellStoryClick = () => {
    onTellStoryClick();
    onClose();
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
    onClose();
  };

  const popularBrands = [
    'MTN Nigeria', 'GTBank', 'Jumia', 'First Bank', 'Airtel',
    'Access Bank', 'UBA', 'Dangote', 'Shoprite', 'Uber'
  ];

  if (!isMenuVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-out Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-yellow-400">
          <div className="flex items-center space-x-2">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754154891392_46e4ce7e.png" 
              alt="TellBrandz" 
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-white font-bold text-lg">Menu</span>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <SearchBar 
              className="w-full" 
              onSearch={() => onClose()} 
            />
          </div>

          {/* Brands Section */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsBrandsOpen(!isBrandsOpen)}
              className="w-full justify-between px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 h-auto rounded-none"
            >
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-3" />
                <span className="font-medium">Popular Brands</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBrandsOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <div className={`overflow-hidden transition-all duration-300 ${isBrandsOpen ? 'max-h-96' : 'max-h-0'}`}>
              <div className="bg-gray-50">
                {popularBrands.slice(0, 6).map((brand, index) => (
                  <Link
                    key={index}
                    to={`/brand/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))}`}
                    onClick={onClose}
                    className="block px-10 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-200 last:border-b-0"
                  >
                    {brand}
                  </Link>
                ))}
                <Link
                  to="/brands"
                  onClick={onClose}
                  className="block px-10 py-3 text-sm text-orange-600 hover:bg-orange-100 font-medium"
                >
                  View All Brands →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t bg-gray-50 space-y-3">
          {user && isAdmin && (
            <Button
              variant="outline"
              onClick={handleAdminClick}
              className="w-full text-red-600 border-red-300 hover:bg-red-50 h-12"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={handleAuthClick}
            className="w-full text-gray-700 border-gray-300 hover:bg-gray-100 h-12 flex items-center justify-center gap-2"
          >
            {user ? (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage 
                    src={userProfile?.profile_photo_url || 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757129321085_96dfb1d7.png'} 
                    alt="Profile" 
                  />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                Dashboard
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
          
          <Button
            onClick={handleTellStoryClick}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:from-orange-600 hover:to-yellow-500 font-semibold h-12 shadow-lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            Tell Your Story
          </Button>
        </div>
      </div>
    </>
  );
};

export default EnhancedMobileMenu;