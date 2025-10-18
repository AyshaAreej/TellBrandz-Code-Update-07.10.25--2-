import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Bell, AlertTriangle, Award, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  brandblast_alerts: boolean;
  crisis_summaries: boolean;
  award_notifications: boolean;
  resolution_updates: boolean;
  weekly_digest: boolean;
  daily_summary: boolean;
}

export const EmailNotificationPreferences: React.FC<{ brandId: string }> = ({ brandId }) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    brandblast_alerts: true,
    crisis_summaries: true,
    award_notifications: true,
    resolution_updates: true,
    weekly_digest: false,
    daily_summary: false,
  });
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    loadPreferences();
  }, [brandId]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('notification_preferences')
        .eq('id', brandId)
        .single();

      if (error) throw error;
      if (data?.notification_preferences) {
        setPreferences(data.notification_preferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .update({ notification_preferences: preferences })
        .eq('id', brandId);

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('email-notifications', {
        body: {
          type: 'welcome_email',
          userEmail: testEmail,
          userName: 'Test User',
        },
      });

      if (error) throw error;

      toast({
        title: "Test email sent",
        description: `Check ${testEmail} for the test notification.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'brandblast_alerts' as keyof NotificationPreferences,
      icon: AlertTriangle,
      title: 'BrandBlast Alerts',
      description: 'Instant notifications for new negative experiences',
      color: 'text-red-500',
    },
    {
      key: 'crisis_summaries' as keyof NotificationPreferences,
      icon: Bell,
      title: 'Crisis Summaries',
      description: 'AI-generated summaries when multiple issues are detected',
      color: 'text-orange-500',
    },
    {
      key: 'award_notifications' as keyof NotificationPreferences,
      icon: Award,
      title: 'Award Notifications',
      description: 'Alerts when your brand earns new awards',
      color: 'text-yellow-500',
    },
    {
      key: 'resolution_updates' as keyof NotificationPreferences,
      icon: MessageSquare,
      title: 'Resolution Updates',
      description: 'Updates on ongoing customer conversations',
      color: 'text-blue-500',
    },
    {
      key: 'weekly_digest' as keyof NotificationPreferences,
      icon: Mail,
      title: 'Weekly Digest',
      description: 'Summary of all activity from the past week',
      color: 'text-purple-500',
    },
    {
      key: 'daily_summary' as keyof NotificationPreferences,
      icon: CheckCircle,
      title: 'Daily Summary',
      description: 'Daily overview of new tells and resolutions',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how and when you receive email notifications about your brand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.key} className="flex items-start justify-between space-x-4 p-4 border rounded-lg">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon className={`h-5 w-5 mt-0.5 ${type.color}`} />
                  <div>
                    <Label htmlFor={type.key} className="text-base font-medium cursor-pointer">
                      {type.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={type.key}
                  checked={preferences[type.key]}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, [type.key]: checked }))
                  }
                />
              </div>
            );
          })}

          <div className="flex justify-end pt-4">
            <Button onClick={savePreferences} disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};