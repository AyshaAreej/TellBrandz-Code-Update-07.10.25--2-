import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Clock, CheckCircle } from 'lucide-react';

interface BrandAnalytics {
  brandId: string;
  brandName: string;
  totalTells: number;
  unresolvedCount: number;
  avgSentiment: number;
  avgResponseTime: number;
  resolutionRate: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export const MultiBrandAnalyticsComparison: React.FC = () => {
  const [selectedBrands] = useState<BrandAnalytics[]>([
    {
      brandId: '1',
      brandName: 'TechCorp',
      totalTells: 1250,
      unresolvedCount: 45,
      avgSentiment: 0.65,
      avgResponseTime: 2.5,
      resolutionRate: 92,
      trendDirection: 'up'
    },
    {
      brandId: '2',
      brandName: 'RetailPlus',
      totalTells: 890,
      unresolvedCount: 78,
      avgSentiment: 0.42,
      avgResponseTime: 4.2,
      resolutionRate: 78,
      trendDirection: 'down'
    },
    {
      brandId: '3',
      brandName: 'ServiceHub',
      totalTells: 2100,
      unresolvedCount: 23,
      avgSentiment: 0.78,
      avgResponseTime: 1.8,
      resolutionRate: 96,
      trendDirection: 'up'
    }
  ]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'text-green-600 bg-green-50';
    if (sentiment > 0.3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMetricComparison = (value: number, metric: string) => {
    const avg = selectedBrands.reduce((sum, b) => {
      if (metric === 'sentiment') return sum + b.avgSentiment;
      if (metric === 'resolution') return sum + b.resolutionRate;
      if (metric === 'response') return sum + b.avgResponseTime;
      return sum;
    }, 0) / selectedBrands.length;

    if (metric === 'response') {
      return value < avg ? 'better' : 'worse';
    }
    return value > avg ? 'better' : 'worse';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            Multi-Brand Analytics Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Brand</th>
                  <th className="text-center py-3 px-4">Total Tells</th>
                  <th className="text-center py-3 px-4">Unresolved</th>
                  <th className="text-center py-3 px-4">Avg Sentiment</th>
                  <th className="text-center py-3 px-4">Response Time</th>
                  <th className="text-center py-3 px-4">Resolution Rate</th>
                  <th className="text-center py-3 px-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                {selectedBrands.map(brand => (
                  <tr key={brand.brandId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{brand.brandName}</td>
                    <td className="text-center py-3 px-4">{brand.totalTells.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={brand.unresolvedCount > 50 ? 'destructive' : 'secondary'}>
                        {brand.unresolvedCount}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${getSentimentColor(brand.avgSentiment)}`}>
                        {(brand.avgSentiment * 100).toFixed(0)}%
                        {getMetricComparison(brand.avgSentiment, 'sentiment') === 'better' && (
                          <TrendingUp className="h-3 w-3" />
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {brand.avgResponseTime}h
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {brand.resolutionRate}%
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      {brand.trendDirection === 'up' && <TrendingUp className="h-5 w-5 text-green-600 mx-auto" />}
                      {brand.trendDirection === 'down' && <TrendingDown className="h-5 w-5 text-red-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Best Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {selectedBrands.reduce((best, brand) => brand.resolutionRate > best.resolutionRate ? brand : best).brandName}
            </div>
            <p className="text-sm text-gray-500 mt-1">Highest resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {selectedBrands.reduce((worst, brand) => brand.unresolvedCount > worst.unresolvedCount ? brand : worst).brandName}
            </div>
            <p className="text-sm text-gray-500 mt-1">Most unresolved tells</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Fastest Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {selectedBrands.reduce((fastest, brand) => brand.avgResponseTime < fastest.avgResponseTime ? brand : fastest).brandName}
            </div>
            <p className="text-sm text-gray-500 mt-1">Best response time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
