import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SummaryData {
  text: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export function BrandExecutiveSummary({ brandId }: { brandId: string }) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, [brandId]);

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('brand-dashboard-data', {
        body: { action: 'getMetrics', brandId }
      });

      if (error) throw error;

      // Generate AI summary based on metrics
      const severity = data.critical > 5 ? 'CRITICAL' : data.critical > 2 ? 'WARNING' : 'NORMAL';
      const trend = data.avgRating > 3.5 ? 'up' : data.avgRating < 2.5 ? 'down' : 'stable';
      
      setSummary({
        text: `In the last 48 hours: ${data.critical} critical issues detected. Average rating: ${data.avgRating.toFixed(1)}/5. ${severity === 'CRITICAL' ? 'Immediate attention required.' : 'Performance within normal range.'}`,
        severity,
        trend,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Card><CardContent className="p-6">Loading...</CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Executive Summary
          <Badge variant={summary?.severity === 'CRITICAL' ? 'destructive' : 'default'}>
            {summary?.severity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          {summary?.severity === 'CRITICAL' && <AlertCircle className="text-red-500 mt-1" />}
          {summary?.trend === 'up' && <TrendingUp className="text-green-500 mt-1" />}
          {summary?.trend === 'down' && <TrendingDown className="text-red-500 mt-1" />}
          <p className="text-sm">{summary?.text}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(summary?.lastUpdated || '').toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
}
