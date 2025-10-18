import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, AlertCircle, Smile, Frown, Meh } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalTells: number;
  avgRating: number;
  emotionalBreakdown: Record<string, number>;
  operationalBreakdown: Record<string, number>;
  trendData: Array<{ date: string; count: number }>;
}

export function AdvancedAnalyticsDashboard({ brandId }: { brandId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [brandId]);

  const loadAnalytics = async () => {
    try {
      const { data: brand } = await supabase
        .from('brands')
        .select('domain')
        .eq('id', brandId)
        .single();

      if (!brand) return;

      const { data: tells } = await supabase
        .from('tells')
        .select('*')
        .eq('brand_name', brand.domain)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (!tells) return;

      const emotionalBreakdown: Record<string, number> = {};
      const operationalBreakdown: Record<string, number> = {};

      tells.forEach(tell => {
        if (tell.emotional_tone) {
          emotionalBreakdown[tell.emotional_tone] = (emotionalBreakdown[tell.emotional_tone] || 0) + 1;
        }
        if (tell.operational_tags) {
          tell.operational_tags.forEach((tag: string) => {
            operationalBreakdown[tag] = (operationalBreakdown[tag] || 0) + 1;
          });
        }
      });

      setAnalytics({
        totalTells: tells.length,
        avgRating: tells.reduce((sum, t) => sum + (t.rating || 3), 0) / tells.length || 0,
        emotionalBreakdown,
        operationalBreakdown,
        trendData: []
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No data available</div>;

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy': return <Smile className="h-5 w-5 text-green-500" />;
      case 'anger': case 'frustration': return <Frown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tells (30d)</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTells}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgRating.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analytics.emotionalBreakdown['Anger'] || 0) + (analytics.emotionalBreakdown['Frustration'] || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emotional Tone Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.emotionalBreakdown).map(([emotion, count]) => (
              <div key={emotion} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getEmotionIcon(emotion)}
                  <span className="font-medium">{emotion}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.operationalBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalTells) * 100}%` }}
                      />
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
