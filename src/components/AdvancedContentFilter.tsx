import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FilterRule {
  id: string;
  name: string;
  type: 'keyword' | 'regex' | 'sentiment' | 'length' | 'duplicate';
  pattern: string;
  action: 'flag' | 'reject' | 'quarantine';
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  created_at: string;
}

interface AdvancedContentFilterProps {
  adminId: string;
}

export const AdvancedContentFilter = ({ adminId }: AdvancedContentFilterProps) => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'keyword' as const,
    pattern: '',
    action: 'flag' as const,
    severity: 'medium' as const,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFilterRules();
  }, []);

  const fetchFilterRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'get_filter_rules',
          adminId
        }
      });

      if (error) throw error;
      setRules(data.rules || []);
    } catch (error) {
      console.error('Error fetching filter rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch filter rules',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    if (!newRule.name || !newRule.pattern) {
      toast({
        title: 'Error',
        description: 'Name and pattern are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'create_filter_rule',
          rule: newRule,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Filter rule created successfully',
      });

      setNewRule({
        name: '',
        type: 'keyword',
        pattern: '',
        action: 'flag',
        severity: 'medium',
      });
      fetchFilterRules();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create filter rule',
        variant: 'destructive',
      });
    }
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'toggle_filter_rule',
          ruleId,
          enabled,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Filter rule ${enabled ? 'enabled' : 'disabled'}`,
      });

      fetchFilterRules();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle filter rule',
        variant: 'destructive',
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'delete_filter_rule',
          ruleId,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Filter rule deleted successfully',
      });

      fetchFilterRules();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete filter rule',
        variant: 'destructive',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'flag': return 'default';
      case 'reject': return 'destructive';
      case 'quarantine': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Content Filtering</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rules">
          <TabsList>
            <TabsTrigger value="rules">Filter Rules</TabsTrigger>
            <TabsTrigger value="create">Create Rule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rules">
            {loading ? (
              <p>Loading filter rules...</p>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">Type: {rule.type}</p>
                        <p className="text-sm text-muted-foreground">Pattern: {rule.pattern}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                        <Badge variant={getActionColor(rule.action)}>
                          {rule.action}
                        </Badge>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rule Name</label>
                <Input
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="Enter rule name..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Filter Type</label>
                <Select value={newRule.type} onValueChange={(value: any) => setNewRule({...newRule, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyword">Keyword</SelectItem>
                    <SelectItem value="regex">Regular Expression</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="length">Content Length</SelectItem>
                    <SelectItem value="duplicate">Duplicate Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Pattern</label>
                <Textarea
                  value={newRule.pattern}
                  onChange={(e) => setNewRule({...newRule, pattern: e.target.value})}
                  placeholder="Enter filter pattern..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select value={newRule.action} onValueChange={(value: any) => setNewRule({...newRule, action: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flag">Flag for Review</SelectItem>
                      <SelectItem value="reject">Auto Reject</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={newRule.severity} onValueChange={(value: any) => setNewRule({...newRule, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={createRule} className="w-full">
                Create Filter Rule
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
                    <p className="text-sm text-muted-foreground">Active Rules</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{rules.filter(r => r.severity === 'high').length}</p>
                    <p className="text-sm text-muted-foreground">High Severity</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{rules.filter(r => r.action === 'reject').length}</p>
                    <p className="text-sm text-muted-foreground">Auto-Reject Rules</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};