import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, TestTube } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
}

export default function WebhookIntegration({ brandId }: { brandId: string }) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['new_tell']);
  const { toast } = useToast();

  const eventTypes = [
    { id: 'new_tell', label: 'New Tell' },
    { id: 'tell_resolved', label: 'Tell Resolved' },
    { id: 'sentiment_change', label: 'Sentiment Change' },
    { id: 'crisis_alert', label: 'Crisis Alert' }
  ];

  useEffect(() => {
    loadWebhooks();
  }, [brandId]);

  const loadWebhooks = async () => {
    const { data, error } = await supabase.functions.invoke('webhook-management', {
      body: { action: 'list', brandId }
    });
    if (!error && data?.webhooks) setWebhooks(data.webhooks);
  };

  const addWebhook = async () => {
    if (!newUrl) return;
    const { data, error } = await supabase.functions.invoke('webhook-management', {
      body: { action: 'create', brandId, url: newUrl, events: selectedEvents }
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to add webhook', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Webhook added successfully' });
      setNewUrl('');
      loadWebhooks();
    }
  };

  const deleteWebhook = async (id: string) => {
    await supabase.functions.invoke('webhook-management', {
      body: { action: 'delete', webhookId: id }
    });
    loadWebhooks();
  };

  const testWebhook = async (id: string) => {
    const { error } = await supabase.functions.invoke('webhook-management', {
      body: { action: 'test', webhookId: id }
    });
    toast({ 
      title: error ? 'Test Failed' : 'Test Successful',
      description: error ? 'Webhook test failed' : 'Test payload sent',
      variant: error ? 'destructive' : 'default'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Integration</CardTitle>
        <CardDescription>Send real-time notifications to external systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Add New Webhook</Label>
          <Input placeholder="https://your-domain.com/webhook" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(event => (
              <Badge key={event.id} variant={selectedEvents.includes(event.id) ? 'default' : 'outline'}
                className="cursor-pointer" onClick={() => setSelectedEvents(prev => 
                  prev.includes(event.id) ? prev.filter(e => e !== event.id) : [...prev, event.id]
                )}>{event.label}</Badge>
            ))}
          </div>
          <Button onClick={addWebhook} disabled={!newUrl}><Plus className="w-4 h-4 mr-2" />Add Webhook</Button>
        </div>
        <div className="space-y-2">
          {webhooks.map(webhook => (
            <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{webhook.url}</p>
                <div className="flex gap-1 mt-1">
                  {webhook.events.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => testWebhook(webhook.id)}><TestTube className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => deleteWebhook(webhook.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}