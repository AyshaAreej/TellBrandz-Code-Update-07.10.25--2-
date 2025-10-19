import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, Zap, Shield, Menu, X, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAdmin } from '@/hooks/useAdmin';
import EnhancedMobileMenu from './EnhancedMobileMenu';
import BrandDropdown from './BrandDropdown';
import SearchBar from './SearchBar';
import { CountrySelector } from './CountrySelector';
import { useLocation } from '@/hooks/useLocation';

interface HeaderProps {
  onMenuClick?: () => void;
  onAuthClick?: () => void;
  isDashboard?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onAuthClick, isDashboard = false }) => {
  const { setCurrentView, user } = useAppContext();
  const { userProfile } = useUserProfile();
  const { isAdmin } = useAdmin();
  const { selectedCountry, updateSelectedCountry } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTellStoryClick = () => {
    window.location.href = '/share-experience';
  };

  return (
    <header className="bg-card text-card-foreground shadow-lg border-b border-border relative transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 flex-shrink-0">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754154891392_46e4ce7e.png" 
              alt="TellBrandz Logo" 
              className="h-8 w-8 md:h-10 md:w-10 rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-card-foreground">TellBrandz</span>
              <span className="text-[8px] md:text-[10px] text-muted-foreground">...just tell the brand</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <BrandDropdown />
            {user && isAdmin && (
              <Button
                variant="outline"
                onClick={() => setCurrentView('admin')}
                className="text-black border-red-500 hover:bg-red-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            {user ? (
              <Button
                variant="ghost"
                asChild
                className="text-black hover:bg-gray-100 flex items-center gap-2"
              >
                <Link to={isDashboard ? '/' : '/dashboard'}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage 
                      src={userProfile?.avatar_url || 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757129321085_96dfb1d7.png'} 
                      alt="Profile" 
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {isDashboard ? 'Explore' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onAuthClick}
                className="text-black hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          
            {!isDashboard && (
              <Button
                onClick={handleTellStoryClick}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
              >
                Tell Your Story
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-black hover:bg-gray-100 p-2"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <EnhancedMobileMenu
        onAuthClick={onAuthClick || (() => {})}
        onTellStoryClick={handleTellStoryClick}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDashboard={isDashboard}
      />
    </header>
  );
};

export default Header;