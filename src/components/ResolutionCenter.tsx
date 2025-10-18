import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useResolutions } from '@/hooks/useResolutions';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const ResolutionCenter: React.FC = () => {
  const { resolutions, loading, resolveCase } = useResolutions();
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
  const [resolutionDetails, setResolutionDetails] = useState('');

  const handleResolve = async (id: string) => {
    try {
      await resolveCase(id, resolutionDetails);
      setSelectedResolution(null);
      setResolutionDetails('');
    } catch (error) {
      console.error('Failed to resolve case:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading resolutions...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <CheckCircle className="h-6 w-6" />
        Resolution Center
      </h2>

      <div className="grid gap-4">
        {resolutions.map((resolution) => (
          <Card key={resolution.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Resolution #{resolution.id.slice(0, 8)}</CardTitle>
                <Badge className={getStatusColor(resolution.status)}>
                  {getStatusIcon(resolution.status)}
                  <span className="ml-1">{resolution.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tell ID: {resolution.tell_id}</p>
                  <p className="text-sm text-gray-600">Brand ID: {resolution.brand_id}</p>
                </div>
                
                {resolution.resolution_details && (
                  <div>
                    <p className="font-medium">Resolution Details:</p>
                    <p className="text-sm">{resolution.resolution_details}</p>
                  </div>
                )}

                {resolution.brand_response && (
                  <div>
                    <p className="font-medium">Brand Response:</p>
                    <p className="text-sm">{resolution.brand_response}</p>
                  </div>
                )}

                {resolution.status !== 'resolved' && (
                  <div className="space-y-2">
                    {selectedResolution === resolution.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Enter resolution details..."
                          value={resolutionDetails}
                          onChange={(e) => setResolutionDetails(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleResolve(resolution.id)}>
                            Mark as Resolved
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedResolution(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedResolution(resolution.id)}
                      >
                        Resolve Case
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resolutions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No resolutions found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};