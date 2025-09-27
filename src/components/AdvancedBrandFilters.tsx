import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface FilterProps {
  filters: {
    categories: string[];
    ratingRange: number[];
    reviewRange: number[];
    locations: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const AdvancedBrandFilters: React.FC<FilterProps> = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const categories = [
    'Telecommunications', 'Banking & Finance', 'E-commerce', 
    'Manufacturing', 'Transportation', 'Food & Beverage',
    'Healthcare', 'Technology', 'Retail', 'Energy'
  ];

  const locations = [
    'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan',
    'Kaduna', 'Jos', 'Enugu', 'Onitsha', 'Warri'
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked 
      ? [...filters.locations, location]
      : filters.locations.filter(l => l !== location);
    
    onFiltersChange({ ...filters, locations: newLocations });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <label htmlFor={category} className="text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Range */}
        <div>
          <h4 className="font-medium mb-3">
            Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]} stars
          </h4>
          <Slider
            value={filters.ratingRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, ratingRange: value })
            }
            max={5}
            min={1}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Review Count Range */}
        <div>
          <h4 className="font-medium mb-3">
            Min Reviews: {filters.reviewRange[0]}
          </h4>
          <Slider
            value={filters.reviewRange}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, reviewRange: value })
            }
            max={5000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>

        {/* Locations */}
        <div>
          <h4 className="font-medium mb-3">Locations</h4>
          <div className="grid grid-cols-2 gap-2">
            {locations.map(location => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) => 
                    handleLocationChange(location, checked as boolean)
                  }
                />
                <label htmlFor={location} className="text-sm">
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(filters.categories.length > 0 || filters.locations.length > 0) && (
          <div>
            <h4 className="font-medium mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleCategoryChange(category, false)}
                  />
                </Badge>
              ))}
              {filters.locations.map(location => (
                <Badge key={location} variant="outline" className="text-xs">
                  {location}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleLocationChange(location, false)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedBrandFilters;