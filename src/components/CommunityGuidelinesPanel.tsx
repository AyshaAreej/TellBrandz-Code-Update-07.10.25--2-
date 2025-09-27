import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Shield, Plus, Trash2, Edit, Save } from 'lucide-react';

interface Guideline {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  auto_action: string;
  is_active: boolean;
  created_at: string;
}

interface CommunityGuidelinesPanelProps {
  adminId: string;
}

export const CommunityGuidelinesPanel: React.FC<CommunityGuidelinesPanelProps> = ({ adminId }) => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    auto_action: 'flag',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      // For now, we'll use default guidelines. In production, these would be stored in database
      const defaultGuidelines: Guideline[] = [
        {
          id: '1',
          title: 'No Spam or Promotional Content',
          description: 'Tells should not contain spam, excessive promotional content, or unrelated advertisements.',
          severity: 'high',
          auto_action: 'reject',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Truthful and Accurate Information',
          description: 'All tells must be based on genuine experiences and contain accurate information about brands.',
          severity: 'high',
          auto_action: 'flag',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Respectful Language',
          description: 'Use respectful language. Avoid profanity, hate speech, or discriminatory content.',
          severity: 'medium',
          auto_action: 'flag',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          title: 'No Personal Information',
          description: 'Do not share personal information like phone numbers, addresses, or private details.',
          severity: 'medium',
          auto_action: 'flag',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          title: 'Minimum Content Length',
          description: 'Tells must contain at least 10 characters of meaningful content.',
          severity: 'low',
          auto_action: 'reject',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      setGuidelines(defaultGuidelines);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch community guidelines',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGuideline = async (guideline: Partial<Guideline>) => {
    try {
      // In production, this would save to database
      if (editingId) {
        setGuidelines(prev => prev.map(g => 
          g.id === editingId ? { ...g, ...guideline } : g
        ));
        setEditingId(null);
      } else {
        const newId = Date.now().toString();
        setGuidelines(prev => [...prev, {
          ...newGuideline,
          id: newId,
          created_at: new Date().toISOString()
        } as Guideline]);
        setNewGuideline({
          title: '',
          description: '',
          severity: 'medium',
          auto_action: 'flag',
          is_active: true
        });
      }

      toast({
        title: 'Success',
        description: 'Guideline saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save guideline',
        variant: 'destructive',
      });
    }
  };

  const deleteGuideline = async (id: string) => {
    try {
      setGuidelines(prev => prev.filter(g => g.id !== id));
      toast({
        title: 'Success',
        description: 'Guideline deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete guideline',
        variant: 'destructive',
      });
    }
  };

  const toggleGuideline = async (id: string, isActive: boolean) => {
    try {
      setGuidelines(prev => prev.map(g => 
        g.id === id ? { ...g, is_active: isActive } : g
      ));
      toast({
        title: 'Success',
        description: `Guideline ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update guideline',
        variant: 'destructive',
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'reject':
        return <Badge variant="destructive">Auto-Reject</Badge>;
      case 'flag':
        return <Badge variant="outline">Flag for Review</Badge>;
      case 'warn':
        return <Badge className="bg-orange-100 text-orange-800">Warn User</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  if (loading) {
    return <div>Loading guidelines...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Community Guidelines Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guidelines.map((guideline) => (
              <div key={guideline.id} className="border rounded-lg p-4">
                {editingId === guideline.id ? (
                  <EditGuidelineForm
                    guideline={guideline}
                    onSave={(updated) => {
                      setGuidelines(prev => prev.map(g => 
                        g.id === guideline.id ? { ...g, ...updated } : g
                      ));
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{guideline.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{guideline.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={guideline.is_active}
                          onCheckedChange={(checked) => toggleGuideline(guideline.id, checked)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(guideline.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGuideline(guideline.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getSeverityBadge(guideline.severity)}
                      {getActionBadge(guideline.auto_action)}
                      {!guideline.is_active && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Guideline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Guideline title"
              value={newGuideline.title}
              onChange={(e) => setNewGuideline(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Guideline description"
              value={newGuideline.description}
              onChange={(e) => setNewGuideline(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newGuideline.severity}
                  onChange={(e) => setNewGuideline(prev => ({ ...prev, severity: e.target.value as any }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Auto Action</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newGuideline.auto_action}
                  onChange={(e) => setNewGuideline(prev => ({ ...prev, auto_action: e.target.value }))}
                >
                  <option value="flag">Flag for Review</option>
                  <option value="reject">Auto-Reject</option>
                  <option value="warn">Warn User</option>
                </select>
              </div>
            </div>
            <Button onClick={() => saveGuideline(newGuideline)} disabled={!newGuideline.title || !newGuideline.description}>
              <Plus className="h-4 w-4 mr-2" />
              Add Guideline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EditGuidelineForm: React.FC<{
  guideline: Guideline;
  onSave: (updated: Partial<Guideline>) => void;
  onCancel: () => void;
}> = ({ guideline, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: guideline.title,
    description: guideline.description,
    severity: guideline.severity,
    auto_action: guideline.auto_action
  });

  return (
    <div className="space-y-4">
      <Input
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <select
          className="p-2 border rounded"
          value={formData.severity}
          onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="p-2 border rounded"
          value={formData.auto_action}
          onChange={(e) => setFormData(prev => ({ ...prev, auto_action: e.target.value }))}
        >
          <option value="flag">Flag for Review</option>
          <option value="reject">Auto-Reject</option>
          <option value="warn">Warn User</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};