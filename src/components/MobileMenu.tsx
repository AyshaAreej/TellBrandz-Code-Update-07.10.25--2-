import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Zap, Shield, Building2, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface MobileMenuProps {
  onAuthClick: () => void;
  onTellStoryClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  onAuthClick, 
  onTellStoryClick, 
  isOpen, 
  onClose 
}) => {
  const { setCurrentView, user } = useAppContext();
  const { isAdmin } = useAdmin();
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  if (!isOpen) return null;

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

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden max-h-screen overflow-y-auto">
      <div className="container mx-auto px-4 py-4 space-y-3">
        {/* Mobile Search Bar */}
        <div className="w-full">
          <SearchBar 
            className="w-full text-sm" 
            onSearch={() => onClose()} 
          />
        </div>
        
        {/* Brands Dropdown */}
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={() => setIsBrandsOpen(!isBrandsOpen)}
            className="w-full text-black hover:bg-gray-100 justify-between h-12 text-sm"
          >
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Brands
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isBrandsOpen && (
            <div className="mt-2 pl-4 space-y-1 max-h-48 overflow-y-auto">
              {popularBrands.slice(0, 5).map((brand, index) => (
                <Link
                  key={index}
                  to={`/brand/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  {brand}
                </Link>
              ))}
              <Link
                to="/brands"
                onClick={onClose}
                className="block px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded font-medium"
              >
                View All Brands →
              </Link>
            </div>
          )}
        </div>
        
        {user && isAdmin && (
          <Button
            variant="outline"
            onClick={handleAdminClick}
            className="w-full text-black border-red-500 hover:bg-red-50 h-12 text-sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={handleAuthClick}
          className="w-full text-black hover:bg-gray-100 h-12 text-sm"
        >
          <User className="h-4 w-4 mr-2" />
          {user ? 'Sign Out' : 'Sign In'}
        </Button>
        <Button
          onClick={handleTellStoryClick}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold h-12 text-sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Tell Your Story
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;