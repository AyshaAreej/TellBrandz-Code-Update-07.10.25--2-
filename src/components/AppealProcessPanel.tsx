import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Appeal {
  id: string;
  tell_id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_response?: string;
  created_at: string;
  tell?: {
    content: string;
    brand_name: string;
  };
  user?: {
    full_name: string;
    email: string;
  };
}

interface AppealProcessPanelProps {
  adminId: string;
}

export const AppealProcessPanel = ({ adminId }: AppealProcessPanelProps) => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'get_appeals',
          adminId
        }
      });

      if (error) throw error;
      setAppeals(data.appeals || []);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch appeals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processAppeal = async (appealId: string, decision: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'process_appeal',
          appealId,
          decision,
          adminResponse,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Appeal ${decision} successfully`,
      });

      setAdminResponse('');
      setSelectedAppeal(null);
      fetchAppeals();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process appeal',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  const pendingAppeals = appeals.filter(a => a.status === 'pending');
  const processedAppeals = appeals.filter(a => a.status !== 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appeal Process Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingAppeals.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed ({processedAppeals.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {loading ? (
              <p>Loading appeals...</p>
            ) : pendingAppeals.length === 0 ? (
              <p className="text-muted-foreground">No pending appeals</p>
            ) : (
              <div className="space-y-4">
                {pendingAppeals.map((appeal) => (
                  <div key={appeal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{appeal.user?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{appeal.user?.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appeal.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(appeal.status)}>
                        {appeal.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Original Tell:</p>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        "{appeal.tell?.content}" - {appeal.tell?.brand_name}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Appeal Reason:</p>
                      <p className="text-sm">{appeal.reason}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedAppeal(appeal)}
                        >
                          Review Appeal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Appeal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium mb-2">Tell Content:</p>
                            <p className="bg-gray-50 p-3 rounded">
                              "{appeal.tell?.content}"
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Appeal Reason:</p>
                            <p className="bg-gray-50 p-3 rounded">{appeal.reason}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Admin Response</label>
                            <Textarea
                              value={adminResponse}
                              onChange={(e) => setAdminResponse(e.target.value)}
                              placeholder="Enter your response to the user..."
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => processAppeal(appeal.id, 'approved')}
                              className="flex-1"
                            >
                              Approve Appeal
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => processAppeal(appeal.id, 'rejected')}
                              className="flex-1"
                            >
                              Reject Appeal
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processed">
            {processedAppeals.length === 0 ? (
              <p className="text-muted-foreground">No processed appeals</p>
            ) : (
              <div className="space-y-4">
                {processedAppeals.map((appeal) => (
                  <div key={appeal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{appeal.user?.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appeal.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(appeal.status)}>
                        {appeal.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-2">Appeal: {appeal.reason}</p>
                    {appeal.admin_response && (
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-sm font-medium">Admin Response:</p>
                        <p className="text-sm">{appeal.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};