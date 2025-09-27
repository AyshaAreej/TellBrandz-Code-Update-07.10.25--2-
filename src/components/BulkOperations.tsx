import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Tell {
  id: string;
  content: string;
  brand_name: string;
  user_id: string;
  status: string;
  created_at: string;
  user_email?: string;
}

export const BulkOperations: React.FC = () => {
  const [selectedTells, setSelectedTells] = useState<string[]>([]);
  const [tells, setTells] = useState<Tell[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkReason, setBulkReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const { toast } = useToast();

  const loadTells = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'get_tells_for_bulk',
          filter: filter
        }
      });

      if (error) throw error;
      setTells(data.tells || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tells",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    loadTells();
  }, [filter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTells(tells.map(t => t.id));
    } else {
      setSelectedTells([]);
    }
  };

  const handleSelectTell = (tellId: string, checked: boolean) => {
    if (checked) {
      setSelectedTells(prev => [...prev, tellId]);
    } else {
      setSelectedTells(prev => prev.filter(id => id !== tellId));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedTells.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'bulk_moderate',
          tell_ids: selectedTells,
          bulk_action: bulkAction,
          reason: bulkReason
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Bulk action applied to ${selectedTells.length} tells`
      });

      setSelectedTells([]);
      setBulkAction('');
      setBulkReason('');
      loadTells();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute bulk action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Moderation Actions
          </CardTitle>
          <CardDescription>
            Select multiple tells and apply moderation actions in bulk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="all">All Tells</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="flag">Flag for Review</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={executeBulkAction}
              disabled={!bulkAction || selectedTells.length === 0 || loading}
            >
              Apply to {selectedTells.length} tells
            </Button>
          </div>

          {bulkAction && (
            <Textarea
              placeholder="Reason for bulk action..."
              value={bulkReason}
              onChange={(e) => setBulkReason(e.target.value)}
              className="min-h-20"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Select Tells ({tells.length})</CardTitle>
              <CardDescription>
                {selectedTells.length} of {tells.length} selected
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedTells.length === tells.length && tells.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm">Select All</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tells.map((tell) => (
              <div key={tell.id} className="flex items-center space-x-3 p-3 border rounded">
                <Checkbox
                  checked={selectedTells.includes(tell.id)}
                  onCheckedChange={(checked) => handleSelectTell(tell.id, checked as boolean)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(tell.status)}
                    <Badge variant="outline">{tell.brand_name}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(tell.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm truncate">{tell.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}