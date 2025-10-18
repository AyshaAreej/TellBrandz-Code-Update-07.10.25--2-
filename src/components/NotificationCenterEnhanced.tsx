import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Bell, Settings, Users, AlertTriangle, Mail, Smartphone } from 'lucide-react';

interface NotificationRule {
  id: string;
  type: string;
  condition: string;
  recipients: string[];
  channels: string[];
  enabled: boolean;
  priority: string;
}

interface EscalationNotification {
  id: string;
  type: string;
  content: string;
  priority: string;
  timestamp: string;
  status: string;
  recipients: string[];
}

export const NotificationCenterEnhanced: React.FC = () => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [notifications, setNotifications] = useState<EscalationNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotificationRules();
    loadEscalationNotifications();
  }, []);

  const loadNotificationRules = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_notification_rules' }
      });
      if (data?.rules) setRules(data.rules);
    } catch (error) {
      console.error('Error loading notification rules:', error);
    }
  };

  const loadEscalationNotifications = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_escalation_notifications' }
      });
      if (data?.notifications) setNotifications(data.notifications);
    } catch (error) {
      console.error('Error loading escalation notifications:', error);
    }
  };

  const updateRule = async (ruleId: string, updates: Partial<NotificationRule>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'update_notification_rule',
          ruleId,
          updates
        }
      });
      if (data?.success) {
        await loadNotificationRules();
      }
    } catch (error) {
      console.error('Error updating rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async (rule: Omit<NotificationRule, 'id'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'create_notification_rule',
          rule
        }
      });
      if (data?.success) {
        await loadNotificationRules();
      }
    } catch (error) {
      console.error('Error creating rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async (ruleId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'test_notification',
          ruleId
        }
      });
      // Handle test results
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notification Center</h2>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="escalations">Escalation Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Automated Notification Rules</h3>
            <Button onClick={() => createRule({
              type: 'escalation',
              condition: 'high_priority_content',
              recipients: ['admin@example.com'],
              channels: ['email'],
              enabled: true,
              priority: 'high'
            })}>
              Add Rule
            </Button>
          </div>

          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} Notification
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{rule.condition}</CardDescription>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Recipients</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.recipients.map((recipient, index) => (
                        <Badge key={index} variant="outline">{recipient}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Channels</Label>
                    <div className="flex gap-2 mt-1">
                      {rule.channels.map((channel, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {channel === 'email' && <Mail className="h-3 w-3" />}
                          {channel === 'sms' && <Smartphone className="h-3 w-3" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => testNotification(rule.id)}>
                    Test Notification
                  </Button>
                  <Select
                    value={rule.priority}
                    onValueChange={(priority) => updateRule(rule.id, { priority })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <h3 className="text-lg font-medium">Recent Escalation Notifications</h3>
          
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{notification.type}</span>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      <span>Sent to: {notification.recipients.join(', ')}</span>
                    </div>
                  </div>
                  <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                    {notification.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Notification Settings</CardTitle>
              <CardDescription>
                Configure system-wide notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Email Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable SMS Notifications</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Push Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Batch Notifications</Label>
                <Switch />
              </div>
              <div>
                <Label>Default Priority Level</Label>
                <Select defaultValue="medium">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};