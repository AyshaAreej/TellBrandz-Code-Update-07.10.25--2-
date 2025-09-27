import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AwardResult {
  brand: string;
  award: string;
  count: number;
}

interface CheckResult {
  success: boolean;
  newAwards: AwardResult[];
  timestamp: string;
  message?: string;
  error?: string;
}

const ScheduledAwardChecker: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);

  const runAwardCheck = async () => {
    try {
      setChecking(true);
      
      const { data, error } = await supabase.functions.invoke('scheduled-award-checker', {
        body: {}
      });

      if (error) throw error;

      setLastResult(data);
    } catch (error) {
      console.error('Award check failed:', error);
      setLastResult({
        success: false,
        newAwards: [],
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Award Checker
          </div>
          <Button 
            onClick={runAwardCheck}
            disabled={checking}
            size="sm"
          >
            {checking ? 'Checking...' : 'Run Check'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastResult ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {lastResult.success ? 'Check Completed' : 'Check Failed'}
              </span>
              <Badge variant="outline" className="text-xs">
                {new Date(lastResult.timestamp).toLocaleString()}
              </Badge>
            </div>

            {lastResult.success && lastResult.newAwards.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">New Awards Granted:</h4>
                <div className="space-y-2">
                  {lastResult.newAwards.map((award, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">{award.brand}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">{award.award}</div>
                        <div className="text-xs text-gray-500">{award.count} BrandBeats</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lastResult.success && lastResult.newAwards.length === 0 && (
              <p className="text-sm text-gray-600">No new awards to grant at this time.</p>
            )}

            {!lastResult.success && lastResult.error && (
              <p className="text-sm text-red-600">Error: {lastResult.error}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Click "Run Check" to scan for brands eligible for new awards.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledAwardChecker;