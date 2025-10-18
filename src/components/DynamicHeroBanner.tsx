import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageSquare, TrendingUp } from 'lucide-react';
import { BrandShowcaseSlide } from './BrandShowcaseSlide';
import { supabase } from '@/lib/supabase';
import { CountrySelector } from './CountrySelector';
import { useLocation } from '@/hooks/useLocation';

interface DynamicHeroBannerProps {
  onCreateTell?: () => void;
  onBrowseStories?: () => void;
}

interface FeaturedTell {
  id: string;
  tellTitle: string;
  tellSlug: string;
  type: 'brand_blast' | 'brand_beat';
  brandLogo: string;
  brandName: string;
  tellerPhoto: string;
  tellerFirstName: string;
  tellerLocation: string;
  brandBlastsCount: number;
  brandBeatsCount: number;
  commentsLink: string;
}

const DynamicHeroBanner: React.FC<DynamicHeroBannerProps> = ({ onCreateTell, onBrowseStories }) => {
  const { selectedCountry, updateSelectedCountry } = useLocation();
  const [currentState, setCurrentState] = useState(0); // 0 = State 1, 1 = State 2
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [featuredTells, setFeaturedTells] = useState<FeaturedTell[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data in case API fails
  const fallbackTells: FeaturedTell[] = [
    {
      id: 'demo_brand_tell_1',
      tellTitle: 'Amazing Customer Service Experience',
      tellSlug: 'amazing-customer-service',
      type: 'brand_beat',
      brandLogo: '/placeholder.svg',
      brandName: 'TechCorp',
      tellerPhoto: 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png',
      tellerFirstName: 'Sarah',
      tellerLocation: 'New York',
      brandBlastsCount: 12,
      brandBeatsCount: 45,
      commentsLink: '/tell/amazing-customer-service#comments'
    },
    {
      id: 'sample_brand_experience_2',
      tellTitle: 'Disappointing Product Quality',
      tellSlug: 'disappointing-product',
      type: 'brand_blast',
      brandLogo: '/placeholder.svg',
      brandName: 'RetailCo',
      tellerPhoto: 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png',
      tellerFirstName: 'Mike',
      tellerLocation: 'California',
      brandBlastsCount: 34,
      brandBeatsCount: 8,
      commentsLink: '/tell/disappointing-product#comments'
    },
    {
      id: 'test_tell_example_3',
      tellTitle: 'Outstanding Product Innovation',
      tellSlug: 'outstanding-innovation',
      type: 'brand_beat',
      brandLogo: '/placeholder.svg',
      brandName: 'InnovaCorp',
      tellerPhoto: 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png',
      tellerFirstName: 'Alex',
      tellerLocation: 'Texas',
      brandBlastsCount: 5,
      brandBeatsCount: 67,
      commentsLink: '/tell/outstanding-innovation#comments'
    }
  ];

  // Fetch featured tells
  useEffect(() => {
    const fetchFeaturedTells = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('featured-tells');
        if (error) throw error;
        
        const fetchedTells = data?.data || [];
        setFeaturedTells(fetchedTells.length > 0 ? fetchedTells : fallbackTells);
      } catch (error) {
        console.error('Error fetching featured tells:', error);
        // Use fallback data if API fails
        setFeaturedTells(fallbackTells);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTells();
  }, []);

  // Main carousel timer (State 1 to State 2: 6s, State 2: 8s)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentState === 0) {
        setCurrentState(1);
        setCurrentBrandIndex(0);
      } else {
        setCurrentState(0);
      }
    }, currentState === 0 ? 6000 : 8000);

    return () => clearTimeout(timer);
  }, [currentState]);

  // Brand cycling timer for State 2
  useEffect(() => {
    if (currentState === 1 && featuredTells.length > 1) {
      const brandTimer = setInterval(() => {
        setCurrentBrandIndex(prev => (prev + 1) % featuredTells.length);
      }, 4000); // Change brand every 4 seconds within the 8-second State 2

      return () => clearInterval(brandTimer);
    }
  }, [currentState, featuredTells.length]);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
  };

  return (
    <div className="relative overflow-hidden">
      {/* Country Selector - Bottom Right Corner */}
      <div className="absolute bottom-6 right-6 z-30">
        <CountrySelector 
          selectedCountry={selectedCountry} 
          onCountryChange={updateSelectedCountry} 
        />
      </div>

      {/* State 1: Original Banner */}
      {currentState === 0 && (
        <div 
          className="relative py-20 bg-cover bg-center bg-no-repeat min-h-screen"
          style={backgroundStyle}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Digital Bureau for<br />
              <span className="text-yellow-400">Real Accountability</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto">
              Share your brand experiences, hold companies accountable, and help others 
              make informed decisions. Your voice matters in building better business practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/share-experience'}
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Share Your Experience
              </Button>
              <Button 
                onClick={onBrowseStories}
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-lg group"
              >
                <TrendingUp className="h-5 w-5 mr-2 text-white group-hover:text-black" />
                Browse Brand Stories
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* State 2: Brand Showcase - Always show when currentState is 1 */}
      {currentState === 1 && (
        <div 
          className="relative py-20 bg-cover bg-center bg-no-repeat min-h-screen"
          style={backgroundStyle}
        >
          <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
            {!loading && featuredTells.length > 0 ? (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-1">Featured Brand <span className="text-yellow-400">Tells</span></h2>
                  <p className="text-xl md:text-2xl text-white/80">Discover what people are saying about top brands</p>
                </div>
                <BrandShowcaseSlide {...featuredTells[currentBrandIndex]} />
              </>
            ) : (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading featured stories...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentState(currentState === 0 ? 1 : 0)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentState(currentState === 0 ? 1 : 0)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Indicators - Hidden on mobile */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 hidden sm:flex">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentState(index)}
            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
              currentState === index ? 'bg-yellow-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicHeroBanner;