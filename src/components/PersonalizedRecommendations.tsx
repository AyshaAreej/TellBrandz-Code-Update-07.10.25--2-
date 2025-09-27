import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, TrendingUp, Heart, Eye, Clock } from 'lucide-react';

interface RecommendedBrand {
  id: string;
  name: string;
  category: string;
  rating: number;
  reason: string;
  confidence: number;
  tags: string[];
}

export function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendedBrand[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    // Get user behavior from localStorage
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const favorites = JSON.parse(localStorage.getItem('brandFavorites') || '[]');
    const viewHistory = JSON.parse(localStorage.getItem('brandViewHistory') || '[]');

    // Extract interests from user behavior
    const interests = [...new Set([
      ...searchHistory.map((s: any) => s.query.toLowerCase()),
      ...favorites.map((f: any) => f.category?.toLowerCase()).filter(Boolean),
      ...viewHistory.map((v: any) => v.category?.toLowerCase()).filter(Boolean)
    ])].slice(0, 5);

    setUserInterests(interests);

    // Generate recommendations based on interests
    // Generate recommendations based on real user data
    // This would be replaced with actual API call
    setRecommendations([]);
  }, []);

  const getReasonIcon = (reason: string) => {
    if (reason.includes('interest')) return <Heart className="h-4 w-4" />;
    if (reason.includes('similar')) return <TrendingUp className="h-4 w-4" />;
    if (reason.includes('trending')) return <Eye className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personalized Recommendations</h2>
        <p className="text-muted-foreground">
          Brands curated based on your interests and activity
        </p>
      </div>

      {userInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userInterests.map(interest => (
                <Badge key={interest} variant="secondary" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map(brand => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{brand.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 w-fit">
                    {brand.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{brand.rating}</span>
                  </div>
                  <div className={`text-sm font-medium ${getConfidenceColor(brand.confidence)}`}>
                    {brand.confidence}% match
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                {getReasonIcon(brand.reason)}
                <p className="text-sm text-muted-foreground">{brand.reason}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {brand.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  View Brand
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-dashed">
          <CardContent className="p-12 text-center">
            <TrendingUp className="mx-auto h-16 w-16 text-blue-400 mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring brands, sharing experiences, and building your profile to get personalized 
              recommendations tailored just for you!
            </p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
                  <Heart className="h-4 w-4 mr-2" />
                  Explore Brands
                </Button>
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Share Experience
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                The more you engage, the better your recommendations become
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}