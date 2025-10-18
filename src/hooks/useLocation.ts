import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface LocationData {
  country: string;
  countryName: string;
  city: string;
  region: string;
  ip: string;
  timezone: string;
}

const LOCATION_STORAGE_KEY = 'user_selected_country';

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved country preference
  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (saved) {
      setSelectedCountry(saved);
    }
  }, []);

  // Detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('geolocation-service');
        
        // The geolocation service now always returns 200 OK with fallback data
        if (data) {
          setLocation(data);
          
          // Set default country if none selected
          if (!selectedCountry && data.country) {
            setSelectedCountry(data.country);
          }
          
          // Clear any previous errors
          setError(null);
        } else {
          throw new Error('No location data received');
        }
      } catch (err) {
        console.log('Location detection error:', err);
        setError(err instanceof Error ? err.message : 'Failed to detect location');
        
        // Fallback to US - this should rarely happen now
        const fallbackLocation = {
          country: 'US',
          countryName: 'United States',
          city: '',
          region: '',
          ip: '',
          timezone: ''
        };
        setLocation(fallbackLocation);
        
        if (!selectedCountry) {
          setSelectedCountry('US');
        }
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, [selectedCountry]);

  const updateSelectedCountry = (country: string) => {
    setSelectedCountry(country);
    localStorage.setItem(LOCATION_STORAGE_KEY, country);
  };

  return {
    location,
    selectedCountry,
    updateSelectedCountry,
    loading,
    error
  };
}