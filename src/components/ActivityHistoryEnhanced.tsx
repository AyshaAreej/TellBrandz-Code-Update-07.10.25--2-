import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Activity, MessageSquare, Heart, UserPlus, Settings, Shield, Download, Trash2, Eye, Edit } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  metadata: any;
  created_at: string;
}

export const ActivityHistoryEnhanced: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user, filter]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('activity-management', {
        body: { 
          action: 'get_activity',
          filter: filter,
          limit: 100
        }
      });

      if (error) throw error;
      setActivities(data.data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activity history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'tell_created':
        return <MessageSquare className="h-4 w-4" />;
      case 'tell_liked':
        return <Heart className="h-4 w-4" />;
      case 'user_followed':
        return <UserPlus className="h-4 w-4" />;
      case 'profile_updated':
        return <Edit className="h-4 w-4" />;
      case 'settings_updated':
        return <Settings className="h-4 w-4" />;
      case 'password_changed':
        return <Shield className="h-4 w-4" />;
      case 'data_exported':
        return <Download className="h-4 w-4" />;
      case 'account_deleted':
        return <Trash2 className="h-4 w-4" />;
      case 'notification_read':
        return <Eye className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'tell_created':
        return 'bg-blue-500';
      case 'tell_liked':
        return 'bg-red-500';
      case 'user_followed':
        return 'bg-green-500';
      case 'profile_updated':
      case 'settings_updated':
        return 'bg-orange-500';
      case 'password_changed':
        return 'bg-purple-500';
      case 'data_exported':
        return 'bg-cyan-500';
      case 'account_deleted':
        return 'bg-red-600';
      case 'notification_read':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getActivityBadge = (action: string) => {
    switch (action) {
      case 'tell_created':
        return <Badge variant="default">Content</Badge>;
      case 'tell_liked':
        return <Badge variant="secondary">Engagement</Badge>;
      case 'user_followed':
        return <Badge variant="secondary">Social</Badge>;
      case 'profile_updated':
      case 'settings_updated':
        return <Badge variant="outline">Settings</Badge>;
      case 'password_changed':
        return <Badge variant="destructive">Security</Badge>;
      case 'data_exported':
        return <Badge variant="outline">Data</Badge>;
      case 'account_deleted':
        return <Badge variant="destructive">Account</Badge>;
      case 'notification_read':
        return <Badge variant="secondary">Notification</Badge>;
      default:
        return <Badge variant="outline">System</Badge>;
    }
  };

  const formatActivityDescription = (activity: ActivityLog) => {
    let description = activity.description;
    
    if (activity.metadata) {
      if (activity.action === 'tell_created' && activity.metadata.tell_title) {
        description += `: "${activity.metadata.tell_title}"`;
      }
      if (activity.action === 'data_exported' && activity.metadata.export_size) {
        description += ` (${Math.round(activity.metadata.export_size / 1024)} KB)`;
      }
      if (activity.action === 'settings_updated' && activity.metadata.updated_fields) {
        description += `: ${activity.metadata.updated_fields.join(', ')}`;
      }
    }
    
    return description;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity History
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="tell_created">Content Created</SelectItem>
              <SelectItem value="tell_liked">Likes Given</SelectItem>
              <SelectItem value="user_followed">Follows</SelectItem>
              <SelectItem value="profile_updated">Profile Updates</SelectItem>
              <SelectItem value="settings_updated">Settings</SelectItem>
              <SelectItem value="password_changed">Security</SelectItem>
              <SelectItem value="data_exported">Data Export</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Track your account activity and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity found</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.action)} text-white flex-shrink-0`}>
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">
                            {formatActivityDescription(activity)}
                          </h4>
                          {getActivityBadge(activity.action)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()} at{' '}
                          {new Date(activity.created_at).toLocaleTimeString()}
                        </p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              View details
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};