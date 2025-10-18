import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Brand {
  id: string;
  name: string;
  category: string;
  logo_url?: string;
  description?: string;
  rating?: number;
}

interface BrandFavoritesProps {
  onBrandSelect?: (brand: Brand) => void;
  compact?: boolean;
}

export const BrandFavorites: React.FC<BrandFavoritesProps> = ({
  onBrandSelect,
  compact = false
}) => {
  const [favorites, setFavorites] = useState<Brand[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('brandFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const addToFavorites = (brand: Brand) => {
    const updated = [...favorites, brand];
    setFavorites(updated);
    localStorage.setItem('brandFavorites', JSON.stringify(updated));
  };

  const removeFromFavorites = (brandId: string) => {
    const updated = favorites.filter(b => b.id !== brandId);
    setFavorites(updated);
    localStorage.setItem('brandFavorites', JSON.stringify(updated));
  };

  const isFavorite = (brandId: string) => {
    return favorites.some(b => b.id === brandId);
  };

  const toggleFavorite = (brand: Brand) => {
    if (isFavorite(brand.id)) {
      removeFromFavorites(brand.id);
    } else {
      addToFavorites(brand);
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('brandFavorites');
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {(favorites || []).slice(0, 5).map(brand => (
          <div
            key={brand.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => onBrandSelect?.(brand)}
          >
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className="text-sm font-medium">{brand.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {brand.category}
            </Badge>
          </div>
        ))}
        {favorites.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm">
              View All ({favorites.length})
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Favorite Brands</span>
          <Badge variant="secondary">{favorites.length}</Badge>
        </CardTitle>
        {favorites.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFavorites}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No favorite brands yet</p>
            <p className="text-sm">Click the heart icon on brands to add them here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {favorites.map(brand => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onBrandSelect?.(brand)}
              >
                <div className="flex items-center space-x-3">
                  {brand.logo_url && (
                    <div className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{brand.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {brand.category}
                      </Badge>
                      {brand.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{brand.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(brand.id);
                  }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Export utility functions for use in other components
export const useBrandFavorites = () => {
  const [favorites, setFavorites] = useState<Brand[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('brandFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addToFavorites = (brand: Brand) => {
    const updated = [...favorites, brand];
    setFavorites(updated);
    localStorage.setItem('brandFavorites', JSON.stringify(updated));
  };

  const removeFromFavorites = (brandId: string) => {
    const updated = favorites.filter(b => b.id !== brandId);
    setFavorites(updated);
    localStorage.setItem('brandFavorites', JSON.stringify(updated));
  };

  const isFavorite = (brandId: string) => {
    return favorites.some(b => b.id === brandId);
  };

  const toggleFavorite = (brand: Brand) => {
    if (isFavorite(brand.id)) {
      removeFromFavorites(brand.id);
    } else {
      addToFavorites(brand);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  };
};