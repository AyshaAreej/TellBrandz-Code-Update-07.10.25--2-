import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AwardBadge from './AwardBadge';
import { supabase } from '@/lib/supabase';

interface Award {
  id: string;
  award_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  award_name: string;
  date_achieved: string;
  brand_beats_count: number;
}

interface BrandAchievementsProps {
  brandId: string;
  brandName: string;
}

const BrandAchievements: React.FC<BrandAchievementsProps> = ({ brandId, brandName }) => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('award-management', {
          body: { action: 'get_awards', brandId }
        });

        if (error) throw error;
        
        if (data?.success) {
          setAwards(data.awards || []);
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [brandId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brand Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading awards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {awards.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {awards.map((award) => (
              <AwardBadge 
                key={award.id} 
                award={award} 
                brandName={brandName} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">
            {brandName} has not yet received any BrandBeat awards. Stay tuned for their future achievements!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandAchievements;