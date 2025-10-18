import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AIInsight {
  id: string;
  type: 'trend' | 'alert' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export default function AdvancedAIInsights({ brandId }: { brandId: string }) {
  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Rising Customer Service Complaints',
      description: 'Customer service mentions increased 34% this week. Response time is a key concern.',
      confidence: 92,
      impact: 'high'
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Optimize Response Strategy',
      description: 'Tells resolved within 24 hours have 3x higher satisfaction. Prioritize quick responses.',
      confidence: 88,
      impact: 'high'
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Sentiment Improvement Expected',
      description: 'Based on recent actions, sentiment score likely to improve by 0.8 points next week.',
      confidence: 76,
      impact: 'medium'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Product Quality Concerns',
      description: 'Emerging pattern detected: 12 tells mention "defective" in past 48 hours.',
      confidence: 85,
      impact: 'high'
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'alert': return <AlertCircle className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'prediction': return <Target className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold">AI-Powered Insights</h3>
      </div>
      
      {insights.map(insight => (
        <Card key={insight.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{insight.title}</h4>
                <Badge variant={getImpactColor(insight.impact)}>
                  {insight.impact} impact
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Confidence:</span>
                <Progress value={insight.confidence} className="flex-1 h-2" />
                <span className="text-xs font-semibold">{insight.confidence}%</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
