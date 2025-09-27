import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings, TrendingUp, Clock, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface EscalationRule {
  id: string;
  name: string;
  trigger_type: string;
  threshold_value: number;
  action: string;
  enabled: boolean;
  created_at: string;
}

interface AutoModerationStats {
  total_processed: number;
  auto_approved: number;
  auto_rejected: number;
  escalated: number;
  last_24h: number;
}

export const AutoModerationPanel: React.FC = () => {
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [stats, setStats] = useState<AutoModerationStats | null>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger_type: '',
    threshold_value: 0,
    action: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadEscalationRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_escalation_rules' }
      });

      if (error) throw error;
      setEscalationRules(data.rules || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load escalation rules",
        variant: "destructive"
      });
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_auto_moderation_stats' }
      });

      if (error) throw error;
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadEscalationRules();
    loadStats();
  }, []);

  const createEscalationRule = async () => {
    if (!newRule.name || !newRule.trigger_type || !newRule.action) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'create_escalation_rule',
          rule: newRule
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Escalation rule created successfully"
      });

      setNewRule({ name: '', trigger_type: '', threshold_value: 0, action: '' });
      loadEscalationRules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create escalation rule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'toggle_escalation_rule',
          rule_id: ruleId,
          enabled
        }
      });

      if (error) throw error;
      loadEscalationRules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rule",
        variant: "destructive"
      });
    }
  };

  const triggerTypes = [
    { value: 'reports_count', label: 'Number of Reports' },
    { value: 'spam_score', label: 'Spam Score' },
    { value: 'user_violations', label: 'User Violations Count' },
    { value: 'content_similarity', label: 'Content Similarity %' },
    { value: 'time_since_last_tell', label: 'Time Since Last Tell (minutes)' }
  ];

  const actionTypes = [
    { value: 'auto_reject', label: 'Auto Reject' },
    { value: 'flag_for_review', label: 'Flag for Review' },
    { value: 'suspend_user', label: 'Suspend User' },
    { value: 'escalate_to_admin', label: 'Escalate to Admin' },
    { value: 'require_verification', label: 'Require Verification' }
  ];

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Processed</p>
                  <p className="text-2xl font-bold">{stats.total_processed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Auto Approved</p>
                  <p className="text-2xl font-bold">{stats.auto_approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Auto Rejected</p>
                  <p className="text-2xl font-bold">{stats.auto_rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Escalated</p>
                  <p className="text-2xl font-bold">{stats.escalated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Last 24h</p>
                  <p className="text-2xl font-bold">{stats.last_24h}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create Escalation Rule</CardTitle>
          <CardDescription>
            Define automated escalation workflows based on triggers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="High spam score auto-reject"
              />
            </div>
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select value={newRule.trigger_type} onValueChange={(value) => setNewRule(prev => ({ ...prev, trigger_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="threshold">Threshold Value</Label>
              <Input
                id="threshold"
                type="number"
                value={newRule.threshold_value}
                onChange={(e) => setNewRule(prev => ({ ...prev, threshold_value: parseInt(e.target.value) || 0 }))}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <Select value={newRule.action} onValueChange={(value) => setNewRule(prev => ({ ...prev, action: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={createEscalationRule} disabled={loading}>
            Create Rule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Escalation Rules</CardTitle>
          <CardDescription>
            Manage automated escalation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {triggerTypes.find(t => t.value === rule.trigger_type)?.label} ≥ {rule.threshold_value} → {actionTypes.find(a => a.value === rule.action)?.label}
                  </p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}