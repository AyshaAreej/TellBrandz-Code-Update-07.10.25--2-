import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Building2 } from 'lucide-react';

interface BrandLogoFetcherProps {
  brandName: string;
  onLogoFetched?: (logoUrl: string | null) => void;
  className?: string;
}

export const BrandLogoFetcher: React.FC<BrandLogoFetcherProps> = ({
  brandName,
  onLogoFetched,
  className = "w-12 h-12"
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!brandName || brandName.length < 2) {
      setLogoUrl(null);
      setError(false);
      return;
    }

    const fetchLogo = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const { data, error } = await supabase.functions.invoke('brand-logo-fetcher', {
          body: { brandName }
        });

        if (error) throw error;

        if (data.success && data.logoUrl) {
          setLogoUrl(data.logoUrl);
          onLogoFetched?.(data.logoUrl);
        } else {
          setError(true);
          onLogoFetched?.(null);
        }
      } catch (err) {
        console.error('Failed to fetch brand logo:', err);
        setError(true);
        onLogoFetched?.(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchLogo, 500);
    return () => clearTimeout(timeoutId);
  }, [brandName, onLogoFetched]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg border`}>
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !logoUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg border`}>
        <Building2 className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-white rounded-lg border overflow-hidden`}>
      <img
        src={logoUrl}
        alt={`${brandName} logo`}
        className="w-full h-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};