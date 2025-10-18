import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Shield, Settings, Activity, AlertTriangle } from 'lucide-react';

interface ModerationService {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  threshold: number;
  actions: string[];
}

export const ExternalModerationIntegration: React.FC = () => {
  const [services, setServices] = useState<ModerationService[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    loadModerationServices();
    loadModerationStats();
  }, []);

  const loadModerationServices = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_moderation_services' }
      });
      if (data?.services) setServices(data.services);
    } catch (error) {
      console.error('Error loading moderation services:', error);
    }
  };

  const loadModerationStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_moderation_stats' }
      });
      if (data?.stats) setStats(data.stats);
    } catch (error) {
      console.error('Error loading moderation stats:', error);
    }
  };

  const updateService = async (serviceId: string, updates: Partial<ModerationService>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'update_moderation_service',
          serviceId,
          updates
        }
      });
      if (data?.success) {
        await loadModerationServices();
      }
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  };

  const testService = async (serviceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'test_moderation_service',
          serviceId
        }
      });
      // Handle test results
    } catch (error) {
      console.error('Error testing service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h2 className="text-xl font-semibold">External Moderation Integration</h2>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {service.name}
                      <Badge variant={service.enabled ? "default" : "secondary"}>
                        {service.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      External content moderation service
                    </CardDescription>
                  </div>
                  <Switch
                    checked={service.enabled}
                    onCheckedChange={(enabled) => updateService(service.id, { enabled })}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={service.apiKey}
                      onChange={(e) => updateService(service.id, { apiKey: e.target.value })}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div>
                    <Label>Confidence Threshold</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={service.threshold}
                      onChange={(e) => updateService(service.id, { threshold: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => testService(service.id)} disabled={loading}>
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scanned</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalScanned || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.todayScanned || 0} today
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFlagged || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.totalFlagged / stats.totalScanned) * 100 || 0).toFixed(1)}% flag rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto Actions</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.autoActions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Automated moderation actions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Configure global moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Auto-Moderation</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Queue Suspicious Content</Label>
                <Switch />
              </div>
              <div>
                <Label>Default Action</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flag">Flag for Review</SelectItem>
                    <SelectItem value="reject">Auto-Reject</SelectItem>
                    <SelectItem value="escalate">Escalate to Admin</SelectItem>
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