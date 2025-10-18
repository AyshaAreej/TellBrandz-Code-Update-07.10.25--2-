import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Notification {
  id: string;
  type: 'crisis' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function RealTimeNotificationSystem({ brandId }: { brandId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tells',
        filter: `brand_name=eq.${brandId}`
      }, handleNewTell)
      .subscribe();

    // Check for crisis alerts every 5 minutes
    const crisisInterval = setInterval(checkForCrisis, 5 * 60 * 1000);

    return () => {
      channel.unsubscribe();
      clearInterval(crisisInterval);
    };
  }, [brandId]);

  const loadNotifications = async () => {
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        const mapped = data.map(n => ({
          id: n.id,
          type: n.type as 'crisis' | 'info' | 'success',
          title: n.title,
          message: n.message,
          timestamp: new Date(n.created_at),
          read: n.read
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleNewTell = (payload: any) => {
    const tell = payload.new;
    
    if (tell.emotional_tone === 'Anger' || tell.emotional_tone === 'Frustration') {
      const newNotification: Notification = {
        id: Math.random().toString(),
        type: 'crisis',
        title: 'Critical Customer Experience',
        message: `New ${tell.emotional_tone.toLowerCase()} experience reported: ${tell.title}`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  };

  const checkForCrisis = async () => {
    try {
      const { data } = await supabase.functions.invoke('ai-crisis-summary', {
        body: { brandId }
      });

      if (data?.crisis && data.crises?.length > 0) {
        data.crises.forEach((crisis: any) => {
          const newNotification: Notification = {
            id: Math.random().toString(),
            type: 'crisis',
            title: `CRISIS ALERT: ${crisis.location}`,
            message: crisis.summary,
            timestamp: new Date(),
            read: false
          };
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });
      }
    } catch (error) {
      console.error('Crisis check failed:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'crisis': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showPanel && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
