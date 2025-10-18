import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTrigger {
  id: string;
  name: string;
  enabled: boolean;
  condition: string;
  threshold: number;
  recipients: string;
  frequency: string;
}

export const AutomatedEmailTriggers: React.FC = () => {
  const { toast } = useToast();
  const [triggers, setTriggers] = useState<EmailTrigger[]>([
    {
      id: '1',
      name: 'Crisis Alert',
      enabled: true,
      condition: 'negative_sentiment',
      threshold: 5,
      recipients: 'team@brand.com',
      frequency: 'immediate'
    },
    {
      id: '2',
      name: 'Unresolved Threshold',
      enabled: true,
      condition: 'unresolved_count',
      threshold: 10,
      recipients: 'manager@brand.com',
      frequency: 'daily'
    }
  ]);

  const addTrigger = () => {
    const newTrigger: EmailTrigger = {
      id: Date.now().toString(),
      name: 'New Trigger',
      enabled: false,
      condition: 'new_brandblast',
      threshold: 1,
      recipients: '',
      frequency: 'immediate'
    };
    setTriggers([...triggers, newTrigger]);
  };

  const updateTrigger = (id: string, updates: Partial<EmailTrigger>) => {
    setTriggers(triggers.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrigger = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id));
    toast({ title: 'Trigger deleted' });
  };

  const saveTriggers = () => {
    toast({ title: 'Email triggers saved successfully' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <CardTitle>Automated Email Triggers</CardTitle>
          </div>
          <Button onClick={addTrigger} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Trigger
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {triggers.map(trigger => (
          <Card key={trigger.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  value={trigger.name}
                  onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
                  className="max-w-xs font-medium"
                />
                <div className="flex items-center gap-3">
                  <Switch
                    checked={trigger.enabled}
                    onCheckedChange={(enabled) => updateTrigger(trigger.id, { enabled })}
                  />
                  <Button variant="ghost" size="sm" onClick={() => deleteTrigger(trigger.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condition</Label>
                  <Select value={trigger.condition} onValueChange={(condition) => updateTrigger(trigger.id, { condition })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_brandblast">New BrandBlast</SelectItem>
                      <SelectItem value="negative_sentiment">Negative Sentiment</SelectItem>
                      <SelectItem value="unresolved_count">Unresolved Count</SelectItem>
                      <SelectItem value="response_time">Response Time Exceeded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Threshold</Label>
                  <Input
                    type="number"
                    value={trigger.threshold}
                    onChange={(e) => updateTrigger(trigger.id, { threshold: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recipients (comma-separated)</Label>
                  <Input
                    value={trigger.recipients}
                    onChange={(e) => updateTrigger(trigger.id, { recipients: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <Label>Frequency</Label>
                  <Select value={trigger.frequency} onValueChange={(frequency) => updateTrigger(trigger.id, { frequency })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Button onClick={saveTriggers} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save All Triggers
        </Button>
      </CardContent>
    </Card>
  );
};
