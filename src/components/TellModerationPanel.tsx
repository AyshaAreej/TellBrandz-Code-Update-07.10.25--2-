import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Clock } from 'lucide-react';

interface Tell {
  id: string;
  content: string;
  brand_name: string;
  user_id: string;
  status: string;
  created_at: string;
  moderation_status: string;
  moderation_reason: string;
  user?: {
    full_name: string;
    email: string;
  };
}

interface TellModerationPanelProps {
  adminId: string;
}

export const TellModerationPanel: React.FC<TellModerationPanelProps> = ({ adminId }) => {
  const [tells, setTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTell, setSelectedTell] = useState<Tell | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTells();
  }, []);

  const fetchTells = async () => {
    try {
      const { data, error } = await supabase
        .from('tells')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTells(data || []);
    } catch (error) {
      console.error('Error fetching tells:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tells',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateTell = async (tellId: string, action: string, reason: string) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'moderate_tell',
          tellId,
          moderationAction: action,
          reason,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Tell ${action}d successfully`,
      });

      await fetchTells();
      setSelectedTell(null);
      setModerationReason('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to moderate tell',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'flagged':
        return <Badge className="bg-yellow-100 text-yellow-800">Flagged</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const pendingTells = tells.filter(tell => tell.moderation_status === 'pending' || !tell.moderation_status);
  const flaggedTells = tells.filter(tell => tell.moderation_status === 'flagged');
  const rejectedTells = tells.filter(tell => tell.moderation_status === 'rejected');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tell Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingTells.length})
              </TabsTrigger>
              <TabsTrigger value="flagged" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Flagged ({flaggedTells.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejected ({rejectedTells.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                All ({tells.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <TellList tells={pendingTells} onSelectTell={setSelectedTell} />
            </TabsContent>

            <TabsContent value="flagged" className="mt-6">
              <TellList tells={flaggedTells} onSelectTell={setSelectedTell} />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <TellList tells={rejectedTells} onSelectTell={setSelectedTell} />
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <TellList tells={tells} onSelectTell={setSelectedTell} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTell && (
        <Card>
          <CardHeader>
            <CardTitle>Moderate Tell</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{selectedTell.brand_name}</p>
                  <p className="text-sm text-gray-600">
                    By: {selectedTell.user?.full_name} ({selectedTell.user?.email})
                  </p>
                </div>
                {getStatusBadge(selectedTell.moderation_status)}
              </div>
              <p className="text-sm">{selectedTell.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Created: {new Date(selectedTell.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Moderation Reason</label>
              <Select onValueChange={setModerationReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam content</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate language</SelectItem>
                  <SelectItem value="false_claim">False or misleading claim</SelectItem>
                  <SelectItem value="harassment">Harassment or abuse</SelectItem>
                  <SelectItem value="duplicate">Duplicate content</SelectItem>
                  <SelectItem value="off_topic">Off-topic content</SelectItem>
                  <SelectItem value="other">Other violation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Additional notes (optional)"
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              rows={3}
            />

            <div className="flex gap-2">
              <Button
                onClick={() => moderateTell(selectedTell.id, 'approve', moderationReason)}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => moderateTell(selectedTell.id, 'reject', moderationReason)}
                disabled={actionLoading}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => moderateTell(selectedTell.id, 'flag', moderationReason)}
                disabled={actionLoading}
                variant="outline"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
              <Button
                onClick={() => setSelectedTell(null)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TellList: React.FC<{ tells: Tell[]; onSelectTell: (tell: Tell) => void }> = ({ tells, onSelectTell }) => {
  if (tells.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tells found in this category
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tells.map((tell) => (
        <div key={tell.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => onSelectTell(tell)}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{tell.brand_name}</p>
              <p className="text-sm text-gray-600">By: {tell.user?.full_name}</p>
            </div>
            <div className="flex items-center gap-2">
              {tell.moderation_status && (
                <Badge variant={tell.moderation_status === 'approved' ? 'default' : 'destructive'}>
                  {tell.moderation_status}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{tell.content}</p>
          <p className="text-xs text-gray-500">
            {new Date(tell.created_at).toLocaleString()}
          </p>
          {tell.moderation_reason && (
            <p className="text-xs text-red-600 mt-1">Reason: {tell.moderation_reason}</p>
          )}
        </div>
      ))}
    </div>
  );
};