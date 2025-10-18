import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function HistoricAnalysisReports({ brandId, tokenBalance, onTokenDeduct }: any) {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const TOKEN_COST = 50;

  const requestAnalysis = async () => {
    if (tokenBalance < TOKEN_COST) {
      alert('Insufficient Tokens. Please top up your account.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('historic-analysis', {
        body: { brandId, dateStart, dateEnd }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
      onTokenDeduct(TOKEN_COST);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Historic Analysis Reports
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Generated Insight
            </Badge>
          </CardTitle>
          <Badge>{TOKEN_COST} Tokens</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
          <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        </div>
        <Button onClick={requestAnalysis} disabled={loading} className="w-full">
          {loading ? 'Processing...' : 'Generate AI Report'}
        </Button>
        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
