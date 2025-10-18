import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface TrendingBrand {
  id: string;
  name: string;
  brand_beats: number;
  recent_activity: number;
  category: string;
  logo_url?: string;
  trending_score: number;
}

const TrendingBrands: React.FC = () => {
  const [trendingBrands, setTrendingBrands] = useState<TrendingBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetchTrendingBrands();
  }, []);

  const fetchTrendingBrands = async () => {
    setLoading(true);
    try {
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('brands')
        .select('count')
        .limit(1);

      if (testError) {
        console.warn('Supabase connection issue, using demo data');
        setDemoMode(true);
        setLoading(false);
        return;
      }

      // Try edge function first
      try {
        const { data, error } = await supabase.functions.invoke('trending-algorithm');
        
        if (error) throw error;
        
        if (data?.brands) {
          setTrendingBrands(data.brands);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Trending algorithm unavailable, using fallback');
      }
      
      // Fallback to basic database query
      try {
        const { data: brandsData, error: dbError } = await supabase
          .from('brands')
          .select('*')
          .eq('is_verified', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (dbError) throw dbError;

        const trendingData = brandsData?.map(brand => ({
          id: brand.id,
          name: brand.name,
          brand_beats: brand.brand_beats || 0,
          recent_activity: Math.floor(Math.random() * 10),
          category: brand.category || 'General',
          logo_url: brand.logo_url,
          trending_score: (brand.brand_beats || 0) * 0.7
        })) || [];

        setTrendingBrands(trendingData);
      } catch (fallbackError) {
        console.warn('Fallback query failed, using demo mode');
        setDemoMode(true);
      }
    } catch (error) {
      console.warn('All queries failed, using demo mode');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingBrands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="font-semibold text-gray-700 mb-2">No Trending Brands Yet</h4>
            <p className="text-sm mb-4">Be the first to share experiences and create trending brands!</p>
            <div className="text-xs text-gray-400">
              Brands become trending based on BrandBeats and recent activity
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {trendingBrands.slice(0, 5).map((brand, index) => (
                <Link 
                  key={brand.id}
                  to={`/brand/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{brand.name}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {brand.brand_beats.toLocaleString()} BrandBeats
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {brand.recent_activity} recent
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {brand.category}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Based on BrandBeats and recent activity
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingBrands;