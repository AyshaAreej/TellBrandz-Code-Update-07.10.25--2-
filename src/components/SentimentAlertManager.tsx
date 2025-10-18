import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SentimentAlert {
  id: string;
  alert_name: string;
  alert_type: string;
  conditions: any;
  notification_channels: string[];
  is_active: boolean;
  last_triggered_at: string;
}

export default function SentimentAlertManager() {
  const [alerts, setAlerts] = useState<SentimentAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    alert_name: '',
    alert_type: 'threshold',
    sentiment_threshold: -0.5,
    notification_channels: ['in-app']
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sentiment_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast.error('Failed to load alerts');
    }
  };

  const createAlert = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('sentiment_alerts')
        .insert({
          user_id: user.id,
          alert_name: formData.alert_name,
          alert_type: formData.alert_type,
          conditions: { sentiment_threshold: formData.sentiment_threshold },
          notification_channels: formData.notification_channels,
          is_active: true
        });

      if (error) throw error;
      toast.success('Alert created');
      setShowForm(false);
      loadAlerts();
      setFormData({ alert_name: '', alert_type: 'threshold', sentiment_threshold: -0.5, notification_channels: ['in-app'] });
    } catch (error: any) {
      toast.error('Failed to create alert');
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('sentiment_alerts')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      loadAlerts();
      toast.success(isActive ? 'Alert disabled' : 'Alert enabled');
    } catch (error: any) {
      toast.error('Failed to update alert');
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sentiment_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadAlerts();
      toast.success('Alert deleted');
    } catch (error: any) {
      toast.error('Failed to delete alert');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Sentiment Alerts
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-4 p-4 border rounded-lg space-y-3">
            <Input
              placeholder="Alert name"
              value={formData.alert_name}
              onChange={(e) => setFormData({ ...formData, alert_name: e.target.value })}
            />
            <Select value={formData.alert_type} onValueChange={(v) => setFormData({ ...formData, alert_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="threshold">Threshold</SelectItem>
                <SelectItem value="trend">Trend</SelectItem>
                <SelectItem value="spike">Spike</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Label>Sentiment Threshold: {formData.sentiment_threshold}</Label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={formData.sentiment_threshold}
                onChange={(e) => setFormData({ ...formData, sentiment_threshold: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <Button onClick={createAlert} className="w-full">Create Alert</Button>
          </div>
        )}

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <h4 className="font-medium">{alert.alert_name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">Type: {alert.alert_type}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={alert.is_active} onCheckedChange={() => toggleAlert(alert.id, alert.is_active)} />
                <Button size="sm" variant="ghost" onClick={() => deleteAlert(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
