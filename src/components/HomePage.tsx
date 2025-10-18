import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Plus, Search, TrendingUp, MessageSquare, Heart, CheckCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import TellCardWithUserPhoto from './TellCardWithUserPhoto';
import FeaturesSection from './FeaturesSection';
import AwardAnnouncement from './AwardAnnouncement';
import TrendingBrands from './TrendingBrands';
import AwardNotificationBanner from './AwardNotificationBanner';

import DynamicHeroBanner from './DynamicHeroBanner';
import { useLocation } from '@/hooks/useLocation';
import { useTells } from '@/hooks/useTells';
// Interface for Tell data
interface Tell {
  id: string;
  type: 'BrandBlast' | 'BrandBeat';
  title: string;
  description: string;
  brand: string;
  author: string;
  date: string;
  location: string;
  verified: boolean;
  upvotes: number;
  comments: number;
}

interface Brand {
  name: string;
  tellsCount: number;
  type: string;
}

interface HomePageProps {
  onCreateTell?: () => void;
  onAuthClick?: () => void;
  onBrowseStories?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCreateTell, onAuthClick, onBrowseStories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedCountry } = useLocation();
  const { tells, loading, refetch } = useTells(selectedCountry);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Refresh tells when component mounts or country changes
  React.useEffect(() => {
    refetch();
  }, [selectedCountry, refetch]);

  const handleLike = (tellId: string) => {
    console.log('Liked tell:', tellId);
    // In a real app, this would update the backend
  };

  const handleComment = (tellId: string, comment: string) => {
    console.log('Comment on tell:', tellId, comment);
    // In a real app, this would add the comment to the backend
  };

  return (
    <div className="min-h-screen">
      <AwardNotificationBanner />
      <DynamicHeroBanner 
        onCreateTell={onCreateTell}
        onBrowseStories={onBrowseStories}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Recent Stories, Find Brands, and Trending Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Stories - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Recent Stories</h2>
                <p className="text-gray-600 max-w-2xl">
                  Discover the latest brand experiences shared by our community. Real stories from real customers.
                </p>
              </div>

              {!tells || tells.length === 0 ? (
                <div className="text-center py-12 md:py-20 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">No Stories Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Be the first to share your brand experience and help others make informed decisions!
                  </p>
                  <div className="space-y-4">
                    <Button 
                      onClick={onCreateTell}
                      className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-6 py-3 text-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Share Your First Story
                    </Button>
                    <p className="text-sm text-gray-500">
                      Help build the community by sharing your experiences
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Carousel Navigation - Above the cards */}
                  <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 h-8 w-8"
                        onClick={() => {
                          const carousel = document.querySelector('[data-carousel="recent-stories"]');
                          const prevButton = carousel?.querySelector('[data-carousel-prev]') as HTMLButtonElement;
                          prevButton?.click();
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 h-8 w-8"
                        onClick={() => {
                          const carousel = document.querySelector('[data-carousel="recent-stories"]');
                          const nextButton = carousel?.querySelector('[data-carousel-next]') as HTMLButtonElement;
                          nextButton?.click();
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stories Container - 3 cards stacked vertically */}
                  <Carousel className="w-full" data-carousel="recent-stories">
                    <CarouselContent className="-ml-4">
                      {Array.from({ length: Math.ceil((tells || []).length / 3) }).map((_, pageIndex) => (
                        <CarouselItem key={pageIndex} className="pl-4 basis-full">
                          <div className="space-y-4">
                             {(tells || []).slice(pageIndex * 3, pageIndex * 3 + 3).map((tell, index) => (
                               <TellCardWithUserPhoto
                                 key={tell.id}
                                 tell={{
                                   ...tell,
                                   content: tell.description,
                                   tell_type: tell.type, // Use the actual type from the data
                                   user_name: `User ${tell.user_id}`,
                                   rating: Math.floor(Math.random() * 5) + 1, // Random rating for demo
                                   likes_count: Math.floor(Math.random() * 50),
                                   comments_count: Math.floor(Math.random() * 20)
                                 }} 
                                 onClick={() => console.log('Tell clicked:', tell.id)}
                               />
                             ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden" data-carousel-prev />
                    <CarouselNext className="hidden" data-carousel-next />
                  </Carousel>
                  
                  {tells.length > 3 && (
                    <div className="text-center mt-6">
                      <Button 
                        onClick={onBrowseStories}
                        variant="outline" 
                        className="px-8 py-3"
                      >
                        View All Stories
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Find Brands Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Find Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search for a brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                  {brands.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h4 className="font-semibold text-gray-700 mb-2">No Brands Yet</h4>
                      <p className="text-sm mb-4">Start sharing experiences to build the directory!</p>
                      <Button 
                        onClick={onCreateTell}
                        size="sm"
                        className="bg-yellow-400 text-black hover:bg-yellow-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Brand
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(brands || []).slice(0, 5).map((brand) => (
                        <Link 
                          key={brand.name} 
                          to={`/brand/${brand.name.toLowerCase()}`}
                          className="block p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-sm text-gray-600">{brand.tellsCount} tells • {brand.type}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <Link to="/brands">
                      <Button variant="outline" className="w-full">
                        View All Brands
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Brands Section */}
              <TrendingBrands />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;