import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Building2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BrandSuggestion {
  name: string;
  domain: string;
  logoUrl: string;
}

interface BrandAutocompleteProps {
  value: string;
  onChange: (brandName: string, logoUrl?: string) => void;
  placeholder?: string;
  required?: boolean;
}

const BrandAutocomplete: React.FC<BrandAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search for a brand...",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<BrandSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate placeholder SVG
  const generatePlaceholder = (brandName: string) => {
    const initial = brandName.charAt(0).toUpperCase();
    const colors = [
      '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
      '#EF4444', '#06B6D4', '#6366F1', '#84CC16', '#F97316'
    ];
    const colorIndex = brandName.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="${bgColor}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="#FFFFFF">
          ${initial}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Fetch brand suggestions from Supabase Edge Function
  const fetchBrandSuggestions = async (searchTerm: string): Promise<BrandSuggestion[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('brand-search', {
        body: { searchTerm },
      });

      if (error) {
        console.error('Error fetching brands:', error);
        return [];
      }

      if (data.success && data.brands) {
        return data.brands;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch brand suggestions:', error);
      return [];
    }
  };

  // Search and fetch suggestions with debounce
  useEffect(() => {
    const searchBrands = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      
      try {
        const brands = await fetchBrandSuggestions(inputValue);
        setSuggestions(brands);
        setShowDropdown(true);
        setImageErrors(new Set()); // Reset image errors on new search
      } catch (error) {
        console.error('Error searching brands:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
        setSelectedIndex(-1);
      }
    };

    const timeoutId = setTimeout(searchBrands, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectBrand(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        break;
    }
  };

  const selectBrand = (brand: BrandSuggestion) => {
    setInputValue(brand.name);
    onChange(brand.name, brand.logoUrl);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleCustomBrand = () => {
    onChange(inputValue);
    setShowDropdown(false);
  };

  const handleImageError = (brandDomain: string, brandName: string) => {
    setImageErrors(prev => new Set(prev).add(brandDomain));
  };

  const getLogoSrc = (brand: BrandSuggestion) => {
    // If image failed to load, use placeholder
    if (imageErrors.has(brand.domain)) {
      return generatePlaceholder(brand.name);
    }
    
    // If logoUrl is already a data URI (placeholder), use it
    if (brand.logoUrl?.startsWith('data:')) {
      return brand.logoUrl;
    }
    
    // Otherwise use the provided logo URL
    return brand.logoUrl || generatePlaceholder(brand.name);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="brand-search">Brand Name</Label>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          id="brand-search"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          className="pl-10"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm">Searching brands...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No brands found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((brand, index) => (
                <li
                  key={`${brand.domain}-${index}`}
                  onClick={() => selectBrand(brand)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    index === selectedIndex
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Logo with error handling */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={getLogoSrc(brand)}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                        onError={() => handleImageError(brand.domain, brand.name)}
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>

                    {/* Brand Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {brand.name}
                      </p>
                      {brand.domain && (
                        <p className="text-xs text-gray-500 truncate">
                          {brand.domain}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {inputValue === brand.name && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Custom brand option */}
          {inputValue.length >= 2 && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={handleCustomBrand}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>
                  Use "<span className="font-medium text-gray-900">{inputValue}</span>" as custom brand
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandAutocomplete;