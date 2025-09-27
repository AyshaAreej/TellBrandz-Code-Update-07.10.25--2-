import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AwardBadge from './AwardBadge';

interface AdminAward {
  id: string;
  brand_id: string;
  award_name: string;
  award_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  brand_beats_count: number;
  date_achieved: string;
  brand_name: string;
}

const AdminAwardsPanel: React.FC = () => {
  const [awards, setAwards] = useState<AdminAward[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('awards')
        .select(`
          id,
          brand_id,
          award_name,
          award_tier,
          brand_beats_count,
          date_achieved,
          brands!inner(name)
        `)
        .order('date_achieved', { ascending: false });

      if (error) throw error;
      
      const formattedAwards = data?.map(award => ({
        ...award,
        brand_name: award.brands.name
      })) || [];
      
      setAwards(formattedAwards);
    } catch (error) {
      console.error('Error fetching awards:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch awards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'bg-amber-100 text-amber-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading awards...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Awards</CardTitle>
      </CardHeader>
      <CardContent>
        {awards.length === 0 ? (
          <p className="text-muted-foreground">No awards have been granted yet.</p>
        ) : (
          <div className="space-y-4">
            {awards.map((award) => (
              <div key={award.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <AwardBadge 
                    award={{
                      id: award.id,
                      award_tier: award.award_tier,
                      award_name: award.award_name,
                      date_achieved: award.date_achieved,
                      brand_beats_count: award.brand_beats_count
                    }}
                    brandName={award.brand_name}
                  />
                  <div>
                    <p className="font-medium">{award.brand_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {award.brand_beats_count.toLocaleString()} BrandBeats
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Achieved: {new Date(award.date_achieved).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getTierColor(award.award_tier)}>
                  {award.award_tier.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAwardsPanel;