import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, AlertTriangle } from 'lucide-react';

interface RealTimeUpdate {
  id: string;
  type: 'new_tell' | 'resolution' | 'crisis';
  message: string;
  timestamp: Date;
  brandId: string;
}

export default function RealTimeDashboardUpdates({ brandId }: { brandId: string }) {
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to real-time tells
    const tellsChannel = supabase
      .channel('tells-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tells',
          filter: `brand_id=eq.${brandId}`
        },
        (payload) => {
          const newUpdate: RealTimeUpdate = {
            id: crypto.randomUUID(),
            type: payload.eventType === 'INSERT' ? 'new_tell' : 'resolution',
            message: payload.eventType === 'INSERT' 
              ? 'New Tell received' 
              : 'Tell updated',
            timestamp: new Date(),
            brandId
          };
          setUpdates(prev => [newUpdate, ...prev].slice(0, 10));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(tellsChannel);
    };
  }, [brandId]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'new_tell': return <Bell className="w-4 h-4" />;
      case 'crisis': return <AlertTriangle className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Real-Time Updates</h3>
        <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </Badge>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {updates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Waiting for updates...</p>
        ) : (
          updates.map(update => (
            <div key={update.id} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
              {getIcon(update.type)}
              <div className="flex-1">
                <p className="text-sm font-medium">{update.message}</p>
                <p className="text-xs text-muted-foreground">
                  {update.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
