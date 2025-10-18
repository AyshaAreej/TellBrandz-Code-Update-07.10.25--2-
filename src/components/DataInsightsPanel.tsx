import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface InsightsData {
  visibility_score: number;
  user_average: string;
  platform_average: string;
  industry: string;
}

export default function DataInsightsPanel({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('Retail');
  const { toast } = useToast();

  const industries = ['Retail', 'Technology', 'Food & Beverage', 'Healthcare', 'Finance', 'Entertainment'];

  useEffect(() => {
    fetchInsights();
  }, [userId, selectedIndustry]);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-insights', {
        body: { userId, industry: selectedIndustry }
      });

      if (error) throw error;
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-data-export', {
        body: { userId }
      });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tellbrandz-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast({
        title: 'Data exported successfully',
        description: 'Your data has been downloaded.'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Unable to export data. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Review Visibility Score
          </CardTitle>
          <CardDescription>
            Number of unique brands that have viewed your contextual review data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{insights?.visibility_score || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">brands have accessed your insights</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Industry Rating Comparison
          </CardTitle>
          <CardDescription>Compare your ratings with platform averages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Your Average</span>
                <span className="text-sm font-bold">{insights?.user_average || '0.00'} / 5.0</span>
              </div>
              <Progress value={parseFloat(insights?.user_average || '0') * 20} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Platform Average</span>
                <span className="text-sm font-bold">{insights?.platform_average || '0.00'} / 5.0</span>
              </div>
              <Progress value={parseFloat(insights?.platform_average || '0') * 20} className="h-2 opacity-60" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>Download all your data in JSON format</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportData} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download My Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
