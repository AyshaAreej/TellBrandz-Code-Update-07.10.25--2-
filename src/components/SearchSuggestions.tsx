import React from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect, onClose }) => {
  // Get recent searches from localStorage
  const getRecentSearches = () => {
    try {
      const stored = localStorage.getItem('recentSearches');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error parsing recent searches:', error);
      return [];
    }
  };

  const recentSearches = getRecentSearches().slice(0, 4);
  const trendingBrands = ['First Bank', 'Dangote', 'Shoprite', 'Uber'];
  const brandSuggestions = [
    'MTN Nigeria', 'Airtel Nigeria', 'GTBank', 'Access Bank',
    'Jumia', 'Konga', 'First Bank', 'UBA', 'Zenith Bank'
  ];

  const filteredSuggestions = brandSuggestions.filter(brand =>
    brand.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  if (!query && recentSearches.length === 0 && trendingBrands.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
      {query && filteredSuggestions.length > 0 && (
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Suggestions</div>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(suggestion);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {!query && recentSearches.length > 0 && (
        <div className="p-2 border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Recent Searches</div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(search);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{search}</span>
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Trending</div>
          {trendingBrands.map((brand, index) => (
            <Link
              key={index}
              to={`/brands?search=${encodeURIComponent(brand)}`}
              onClick={onClose}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 block"
            >
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span>{brand}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;