import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';


const BrandDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const popularBrands = [
    'MTN Nigeria', 'GTBank', 'Jumia', 'First Bank', 'Airtel',
    'Access Bank', 'UBA', 'Dangote', 'Shoprite', 'Uber'
  ];

  const filteredBrands = popularBrands.filter(brand =>
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors"
      >
        <Building2 className="h-4 w-4" />
        <span>Brands</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {searchQuery ? (
            <div className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Search Results</div>
              {filteredBrands.length > 0 ? (
                <div className="space-y-1">
                  {filteredBrands.map((brand, index) => (
                    <Link
                      key={index}
                      to={`/brand/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No brands found</p>
              )}
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Popular Brands
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {(popularBrands || []).slice(0, 6).map((brand, index) => (
                    <Link
                      key={index}
                      to={`/brand/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-3">Browse by Category</div>
                <div className="space-y-1">
                  {[
                    { name: 'Telecommunications', icon: '📱', count: 15 },
                    { name: 'Banking & Finance', icon: '💳', count: 25 },
                    { name: 'E-commerce', icon: '🛒', count: 12 },
                    { name: 'Transportation', icon: '🚗', count: 8 },
                    { name: 'Food & Beverage', icon: '🍽️', count: 18 },
                    { name: 'Fashion & Retail', icon: '👕', count: 14 },
                    { name: 'Healthcare', icon: '🏥', count: 10 },
                    { name: 'Education', icon: '📚', count: 9 },
                    { name: 'Real Estate', icon: '🏠', count: 7 },
                    { name: 'Technology', icon: '💻', count: 16 },
                    { name: 'Entertainment', icon: '🎬', count: 11 },
                    { name: 'Energy & Utilities', icon: '⚡', count: 6 },
                    { name: 'Insurance', icon: '🛡️', count: 8 },
                    { name: 'Manufacturing', icon: '🏭', count: 13 },
                    { name: 'Travel & Tourism', icon: '✈️', count: 5 },
                    { name: 'Beauty & Cosmetics', icon: '💄', count: 12 }
                  ].map((category, index) => (
                    <Link
                      key={index}
                      to={`/brands?category=${encodeURIComponent(category.name)}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{category.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4">
                <Link
                  to="/brands"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  View All Brands
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandDropdown;
