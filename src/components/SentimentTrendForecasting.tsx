import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, LineChart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ForecastData {
  date: string;
  predicted: number;
  confidence: number;
  historical?: number;
}

interface Forecast {
  trend: 'improving' | 'declining' | 'stable';
  predictions: ForecastData[];
  alerts: string[];
  confidence: number;
}

export default function SentimentTrendForecasting({ brandId }: { brandId: string }) {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    generateForecast();
  }, [brandId, timeRange]);

  const generateForecast = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('sentiment-forecasting', {
      body: { brandId, timeRange }
    });
    if (!error && data) {
      setForecast(data);
    }
    setLoading(false);
  };

  const getTrendIcon = () => {
    if (!forecast) return null;
    switch (forecast.trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <LineChart className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTrendColor = () => {
    if (!forecast) return 'secondary';
    switch (forecast.trend) {
      case 'improving': return 'default';
      case 'declining': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getTrendIcon()}
              Sentiment Trend Forecasting
            </CardTitle>
            <CardDescription>AI-powered sentiment predictions</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map(range => (
              <Button key={range} size="sm" variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}>{range}</Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Generating forecast...</div>
        ) : forecast ? (
          <>
            <div className="flex items-center gap-4">
              <Badge variant={getTrendColor()} className="text-sm">
                {forecast.trend.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Confidence: {(forecast.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {forecast.alerts.length > 0 && (
              <div className="space-y-2">
                {forecast.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-900">{alert}</p>
                  </div>
                ))}
              </div>
            )}

            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={forecast.predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {forecast.predictions[0]?.historical !== undefined && (
                  <Line type="monotone" dataKey="historical" stroke="#94a3b8" name="Historical" strokeWidth={2} />
                )}
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" name="Predicted" strokeWidth={2} strokeDasharray="5 5" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No forecast data available</div>
        )}
      </CardContent>
    </Card>
  );
}