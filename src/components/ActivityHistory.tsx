import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, Edit, Eye, CheckCircle, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityItem {
  id: string;
  type: 'tell_submitted' | 'tell_viewed' | 'profile_updated' | 'tell_resolved' | 'response_received';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    tellId?: string;
    brandName?: string;
    status?: string;
  };
}

export const ActivityHistory: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'tell_submitted',
      title: 'Tell Submitted',
      description: 'You submitted a tell about "TechCorp Customer Service"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { tellId: 'tell_123', brandName: 'TechCorp' }
    },
    {
      id: '2',
      type: 'response_received',
      title: 'Response Received',
      description: 'TechCorp responded to your tell',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: { tellId: 'tell_123', brandName: 'TechCorp' }
    },
    {
      id: '3',
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'You updated your profile information',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'tell_resolved',
      title: 'Tell Resolved',
      description: 'Your tell about "ServiceCo" was marked as resolved',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: { tellId: 'tell_456', brandName: 'ServiceCo', status: 'resolved' }
    },
    {
      id: '5',
      type: 'tell_viewed',
      title: 'Tell Viewed',
      description: 'You viewed a tell about "RetailBrand"',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      metadata: { tellId: 'tell_789', brandName: 'RetailBrand' }
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'tell_submitted':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'tell_viewed':
        return <Eye className="h-4 w-4 text-gray-500" />;
      case 'profile_updated':
        return <Edit className="h-4 w-4 text-green-500" />;
      case 'tell_resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'response_received':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'tell_submitted':
        return 'default';
      case 'tell_resolved':
        return 'default';
      case 'response_received':
        return 'secondary';
      case 'profile_updated':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity History
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="tell_submitted">Tells Submitted</SelectItem>
              <SelectItem value="response_received">Responses</SelectItem>
              <SelectItem value="tell_resolved">Resolutions</SelectItem>
              <SelectItem value="profile_updated">Profile Updates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                </div>
                <div className="space-y-3 ml-6 border-l-2 border-muted pl-4">
                  {dayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        {getIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        {activity.metadata?.brandName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Brand: {activity.metadata.brandName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activity found</p>
                <p className="text-sm">Try adjusting your filter settings</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};