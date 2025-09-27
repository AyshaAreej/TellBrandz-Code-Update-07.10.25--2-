import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, BarChart3, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TrendingData {
  overall_trending: any[];
  category_trending: Record<string, any[]>;
  timeframe: string;
  total_brands_analyzed: number;
  generated_at: string;
}

const EnhancedTrendingDashboard: React.FC = () => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');

  const fetchTrendingData = async (selectedTimeframe: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('trending-algorithm', {
        body: { timeframe: selectedTimeframe, limit: 10 }
      });

      if (error) throw error;

      if (data?.success) {
        setTrendingData(data.data);
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData(timeframe);
  }, [timeframe]);

  const timeframeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Enhanced Trending Analytics
            </div>
            <div className="flex space-x-2">
              {timeframeOptions.map(option => (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Analyzing trends...</p>
            </div>
          ) : trendingData ? (
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overall">Overall Trending</TabsTrigger>
                <TabsTrigger value="categories">By Category</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {trendingData.total_brands_analyzed}
                    </div>
                    <div className="text-sm text-gray-600">Brands Analyzed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {timeframe.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">Time Period</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {trendingData.overall_trending.map((brand, index) => (
                    <div key={brand.brand_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{brand.brand_name}</div>
                          <div className="text-sm text-gray-600">
                            {brand.total_tells} tells • {brand.positivity_rate}% positive
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          Score: {brand.trending_score}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {brand.brand_category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-4">
                {Object.entries(trendingData.category_trending).map(([category, brands]) => (
                  <Card key={category}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {brands.map((brand: any, index: number) => (
                          <div key={brand.brand_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">#{index + 1}</span>
                              <span className="text-sm">{brand.brand_name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {brand.trending_score}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No trending data available</p>
              <Button 
                onClick={() => fetchTrendingData(timeframe)} 
                className="mt-2"
                size="sm"
              >
                Refresh Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTrendingDashboard;