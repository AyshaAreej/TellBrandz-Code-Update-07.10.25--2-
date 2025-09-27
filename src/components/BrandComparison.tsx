import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Users, X, Plus } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  logo: string;
  location?: string;
  established?: number;
  satisfaction?: number;
}

interface BrandComparisonProps {
  availableBrands: Brand[];
  initialBrands?: Brand[];
}

const BrandComparison: React.FC<BrandComparisonProps> = ({ 
  availableBrands, 
  initialBrands = [] 
}) => {
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>(initialBrands);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const addBrand = (brand: Brand) => {
    if (selectedBrands.length < 4 && !selectedBrands.find(b => b.id === brand.id)) {
      setSelectedBrands([...selectedBrands, brand]);
      setShowAddBrand(false);
    }
  };

  const removeBrand = (brandId: number) => {
    setSelectedBrands(selectedBrands.filter(b => b.id !== brandId));
  };

  const getComparisonMetrics = () => {
    if (selectedBrands.length === 0) return null;
    
    const avgRating = selectedBrands.reduce((sum, brand) => sum + brand.rating, 0) / selectedBrands.length;
    const totalReviews = selectedBrands.reduce((sum, brand) => sum + brand.reviews, 0);
    const topRated = selectedBrands.reduce((prev, current) => 
      prev.rating > current.rating ? prev : current
    );
    
    return { avgRating, totalReviews, topRated };
  };

  const metrics = getComparisonMetrics();

  if (selectedBrands.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12 px-4">
          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Compare Brands</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">Select brands to compare their ratings, reviews, and more</p>
          <Button onClick={() => setShowAddBrand(true)} size="sm" className="text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Add Brand to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Comparison Summary */}
      {metrics && (
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Comparison Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">
                  {metrics.avgRating.toFixed(1)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Average Rating</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {metrics.totalReviews.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Total Reviews</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-base sm:text-xl font-bold text-green-600 truncate">
                  {metrics.topRated.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Top Rated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand Comparison Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Brand Comparison</CardTitle>
          <div className="flex gap-2">
            {selectedBrands.length < 4 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddBrand(true)}
                className="text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Add Brand
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Brand</th>
                  {selectedBrands.map(brand => (
                    <th key={brand.id} className="text-center py-2 sm:py-3 px-2 sm:px-4 min-w-[150px] sm:min-w-[200px]">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-2xl">{brand.logo}</span>
                        <div className="text-center sm:text-left">
                          <div className="font-medium text-xs sm:text-sm leading-tight">{brand.name}</div>
                          <Badge variant="secondary" className="text-xs px-1 py-0.5 mt-1">
                            {brand.category.length > 8 ? brand.category.substring(0, 8) + '...' : brand.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBrand(brand.id)}
                          className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Rating</td>
                  {selectedBrands.map(brand => (
                    <td key={brand.id} className="text-center py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-xs sm:text-sm">{brand.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Reviews</td>
                  {selectedBrands.map(brand => (
                    <td key={brand.id} className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                      {brand.reviews.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">Satisfaction</td>
                  {selectedBrands.map(brand => (
                    <td key={brand.id} className="text-center py-2 sm:py-3 px-2 sm:px-4">
                      <div className="space-y-1 sm:space-y-2">
                        <Progress 
                          value={(brand.satisfaction || brand.rating * 20)} 
                          className="h-1 sm:h-2" 
                        />
                        <span className="text-xs">
                          {(brand.satisfaction || brand.rating * 20).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Brand Modal */}
      {showAddBrand && (
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Add Brand to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-64 sm:max-h-96 overflow-y-auto">
              {availableBrands
                .filter(brand => !selectedBrands.find(sb => sb.id === brand.id))
                .map(brand => (
                  <div
                    key={brand.id}
                    className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => addBrand(brand)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{brand.logo}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base truncate">{brand.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">{brand.category}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm">{brand.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowAddBrand(false)} size="sm" className="text-xs sm:text-sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrandComparison;