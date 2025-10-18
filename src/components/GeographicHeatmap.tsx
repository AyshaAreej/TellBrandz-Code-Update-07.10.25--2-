import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface LocationData {
  country: string;
  city: string;
  count: number;
  avgRating: number;
}

export default function GeographicHeatmap({ brandId }: { brandId: string }) {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationData();
  }, [brandId, filter]);

  const loadLocationData = async () => {
    try {
      let query = supabase
        .from('tells')
        .select('location_country, location_city, rating')
        .eq('brand_id', brandId);

      if (filter === 'critical') {
        query = query.lte('rating', 2);
      } else if (filter === 'positive') {
        query = query.gte('rating', 4);
      }

      const { data } = await query;

      if (data) {
        const grouped = data.reduce((acc: any, tell) => {
          const key = `${tell.location_country}-${tell.location_city}`;
          if (!acc[key]) {
            acc[key] = {
              country: tell.location_country,
              city: tell.location_city,
              count: 0,
              totalRating: 0
            };
          }
          acc[key].count++;
          acc[key].totalRating += tell.rating;
          return acc;
        }, {});

        const result = Object.values(grouped).map((loc: any) => ({
          country: loc.country,
          city: loc.city,
          count: loc.count,
          avgRating: loc.totalRating / loc.count
        }));

        setLocations(result.sort((a, b) => b.count - a.count));
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (count: number, max: number) => {
    const intensity = count / max;
    if (intensity > 0.7) return 'bg-red-500';
    if (intensity > 0.4) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const maxCount = Math.max(...locations.map(l => l.count), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Geographic Distribution</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="critical">Critical (1-2★)</SelectItem>
              <SelectItem value="positive">Positive (4-5★)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-3">
            {locations.map((loc, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium">{loc.city}, {loc.country}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getIntensityColor(loc.count, maxCount)}`}
                        style={{ width: `${(loc.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <Badge variant="outline">{loc.count}</Badge>
                    <Badge variant={loc.avgRating >= 4 ? 'default' : 'destructive'}>
                      {loc.avgRating.toFixed(1)}★
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
