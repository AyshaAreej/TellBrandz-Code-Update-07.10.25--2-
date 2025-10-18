import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Globe, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  verified: boolean;
  brand_blasts: number;
  brand_beats: number;
  created_at: string;
  tells?: Tell[];
}

interface Tell {
  id: string;
  title: string;
  description: string;
  type: 'blast' | 'beat';
  status: string;
  created_at: string;
  users: {
    username: string;
    avatar_url?: string;
  };
}

export default function BrandProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBrandProfile();
    }
  }, [slug]);

  const fetchBrandProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('brand-management', {
        body: { action: 'get_by_slug', slug }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setBrand(data.brand);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brand profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brand profile...</p>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brand Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This brand profile does not exist.'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Brand Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center p-2">
                <img
                  src={brand.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${brand.name}`}
                  alt={`${brand.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                  {brand.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                {brand.description && (
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  {brand.website_url && (
                    <a 
                      href={brand.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-600"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(brand.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Metrics */}
        {/* Brand Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brand Blasts</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{brand.brand_blasts}</div>
              <p className="text-xs text-muted-foreground">Negative mentions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brand Beats</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{brand.brand_beats}</div>
              <p className="text-xs text-muted-foreground">Positive mentions</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tells */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tells</CardTitle>
          </CardHeader>
          <CardContent>
            {brand.tells && brand.tells.length > 0 ? (
              <div className="space-y-4">
                {brand.tells.map((tell, index) => (
                  <div key={tell.id}>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={tell.users.avatar_url} alt={tell.users.username} />
                        <AvatarFallback>
                          {tell.users.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{tell.users.username}</span>
                          <Badge 
                            variant={tell.type === 'blast' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {tell.type === 'blast' ? 'Blast' : 'Beat'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(tell.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1">{tell.title}</h3>
                        <p className="text-sm text-gray-600">{tell.description}</p>
                      </div>
                    </div>
                    
                    {index < brand.tells.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tells yet for this brand.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}