import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, Building2, Star, TrendingUp, Filter, GitCompare, Grid, List, Heart, Download } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import AdvancedBrandFilters from './AdvancedBrandFilters';
import BrandComparison from './BrandComparison';
import { BrandExport } from './BrandExport';
import { useBrandFavorites } from './BrandFavorites';
import { MobileGestures } from './MobileGestures';

interface BrandDirectoryProps {
  showHeader?: boolean;
}
const BrandDirectory: React.FC<BrandDirectoryProps> = ({ showHeader = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const { favorites, isFavorite, toggleFavorite } = useBrandFavorites();
  
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [] as string[],
    ratingRange: [1, 5] as number[],
    reviewRange: [0, 5000] as number[],
    locations: [] as string[]
  });

  // State for brands - will be populated from real data
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // This would be replaced with actual API call
        setBrands([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  const categories = [
    'all', 'Telecommunications', 'Banking & Finance', 'E-commerce', 
    'Manufacturing', 'Transportation', 'Food & Beverage'
  ];

  const filteredBrands = brands
    .filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
      const matchesAdvancedCategories = advancedFilters.categories.length === 0 || 
        advancedFilters.categories.includes(brand.category);
      const matchesRating = brand.rating >= advancedFilters.ratingRange[0] && 
        brand.rating <= advancedFilters.ratingRange[1];
      const matchesReviews = brand.reviews >= advancedFilters.reviewRange[0] && 
        brand.reviews <= advancedFilters.reviewRange[1];
      const matchesLocation = advancedFilters.locations.length === 0 || 
        advancedFilters.locations.includes(brand.location || '');
      
      return matchesSearch && matchesCategory && matchesAdvancedCategories && 
        matchesRating && matchesReviews && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviews - a.reviews;
        default: return a.name.localeCompare(b.name);
      }
    });

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      categories: [],
      ratingRange: [1, 5],
      reviewRange: [0, 5000],
      locations: []
    });
  };

  const handleRefresh = () => {
    // Simulate data refresh
    setSearchQuery('');
    setSelectedCategory('all');
    clearAdvancedFilters();
  };

  const handleSwipeLeft = () => {
    const tabs = ['directory', 'compare', 'favorites'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    const tabs = ['directory', 'compare', 'favorites'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <MobileGestures
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onPullToRefresh={handleRefresh}
      enablePullToRefresh={true}
    >
      <div className="min-h-screen bg-gray-50">
        {showHeader && <Header />}
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Brand Directory</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Discover, explore, and compare brands across various categories</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-full sm:max-w-lg">
              <TabsTrigger value="directory" className="text-xs sm:text-sm">Directory</TabsTrigger>
              <TabsTrigger value="compare" className="text-xs sm:text-sm">Compare</TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs sm:text-sm">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="directory" className="space-y-4 sm:space-y-6">
              {/* Search and Basic Filters */}
              <div className="flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="reviews">Sort by Reviews</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={showFilters ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-xs sm:text-sm"
                      >
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Advanced </span>Filters
                      </Button>
                      
                      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Export
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md mx-auto">
                          <BrandExport
                            brands={filteredBrands}
                            selectedBrands={selectedBrands}
                            onClose={() => setShowExportDialog(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant={viewMode === 'grid' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Filters - Mobile Optimized */}
                {showFilters && (
                  <div className="w-full">
                    <Card className="p-3 sm:p-4">
                      <AdvancedBrandFilters
                        filters={advancedFilters}
                        onFiltersChange={setAdvancedFilters}
                        onClearFilters={clearAdvancedFilters}
                      />
                    </Card>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {filteredBrands.length} of {brands.length} brands
              </div>
              {/* Brand Grid/List - Mobile Optimized */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
                : "space-y-3 sm:space-y-4"
              }>
                {filteredBrands.map(brand => (
                  <Card key={brand.id} className={`hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                  }`}>
                    <CardHeader className={`${viewMode === 'list' ? 'sm:flex-shrink-0 pb-2 sm:pb-3' : 'pb-2 sm:pb-3'} p-3 sm:p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="text-xl sm:text-2xl">{brand.logo}</div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite({
                                id: brand.id.toString(),
                                name: brand.name,
                                category: brand.category,
                                rating: brand.rating
                              });
                            }}
                            className="p-1 h-auto"
                          >
                            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              isFavorite(brand.id.toString()) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400'
                            }`} />
                          </Button>
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {brand.category.length > 12 ? brand.category.substring(0, 12) + '...' : brand.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-sm sm:text-lg leading-tight">{brand.name}</CardTitle>
                    </CardHeader>
                    <CardContent className={`${viewMode === 'list' ? 'sm:flex-1' : ''} p-3 sm:p-6 pt-0`}>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-xs sm:text-sm font-medium">{brand.rating}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">({brand.reviews} reviews)</span>
                      </div>
                      {viewMode === 'list' && (
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          <p>📍 {brand.location} • Est. {brand.established}</p>
                          <p>Satisfaction: {brand.satisfaction}%</p>
                        </div>
                      )}
                      <Link to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm py-1 sm:py-2">
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBrands.length === 0 && !loading && (
                <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-sm">
                  <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">No Brands Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {searchQuery || selectedCategory !== 'all' 
                      ? "Try adjusting your search or filter criteria to find brands."
                      : "Be the first to add brands to our directory by sharing your experiences!"
                    }
                  </p>
                  <div className="space-y-4">
                    <Link to="/create-tell">
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-3 text-lg">
                        <Building2 className="h-5 w-5 mr-2" />
                        Add Your First Brand
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Help build the directory by sharing your brand experiences
                    </p>
                  </div>
                </div>
              )}

            </TabsContent>
            
            <TabsContent value="compare">
              <BrandComparison availableBrands={brands} />
            </TabsContent>
            
            <TabsContent value="favorites">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold">Your Favorite Brands</h2>
                  <Badge variant="secondary" className="w-fit">{favorites.length} favorites</Badge>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-sm">
                    <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">No Favorites Yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Start exploring brands and click the heart icon to add them to your favorites. 
                      Build your personalized collection of trusted brands!
                    </p>
                    <div className="space-y-4">
                      <Link to="/brands">
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-3 text-lg">
                          <Heart className="h-5 w-5 mr-2" />
                          Explore Brands
                        </Button>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Discover brands and save your favorites for quick access
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {favorites.map(brand => (
                      <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                          <div className="flex items-center justify-between">
                            <div className="text-xl sm:text-2xl">
                              {brands.find(b => b.id.toString() === brand.id)?.logo || '🏢'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(brand)}
                                className="p-1 h-auto"
                              >
                                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                              </Button>
                              <Badge variant="secondary" className="text-xs px-2 py-1">
                                {brand.category.length > 12 ? brand.category.substring(0, 12) + '...' : brand.category}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-sm sm:text-lg leading-tight">{brand.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-xs sm:text-sm font-medium">{brand.rating}</span>
                            </div>
                          </div>
                          <Link to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm py-1 sm:py-2">
                              View Profile
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {showHeader && <Footer />}
    </div>
    </MobileGestures>
  );
};

export default BrandDirectory;
