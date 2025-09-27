import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TellModerationPanel } from './TellModerationPanel';
import { UserSuspensionPanel } from './UserSuspensionPanel';
import { AppealProcessPanel } from './AppealProcessPanel';
import { AdvancedContentFilter } from './AdvancedContentFilter';
import { BulkOperations } from './BulkOperations';
import { AutoModerationPanel } from './AutoModerationPanel';
import { ExternalModerationIntegration } from './ExternalModerationIntegration';
import { AdminReports } from './AdminReports';
import { NotificationCenterEnhanced } from './NotificationCenterEnhanced';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Shield, Users, MessageSquare, Settings, BarChart3, Bell, Zap, Filter } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export const AdminPanelEnhanced: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { action: 'get_users' }
      });
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Access denied. Admin privileges required.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enhanced Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive moderation and management tools with advanced features
        </p>
      </div>

      <Tabs defaultValue="moderation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="appeals" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Appeals</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Ops</span>
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Auto Mod</span>
          </TabsTrigger>
          <TabsTrigger value="external" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">External</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moderation">
          <TellModerationPanel adminId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="users">
          <UserSuspensionPanel adminId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="appeals">
          <AppealProcessPanel adminId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="filters">
          <AdvancedContentFilter adminId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkOperations />
        </TabsContent>

        <TabsContent value="auto">
          <AutoModerationPanel />
        </TabsContent>

        <TabsContent value="external">
          <ExternalModerationIntegration />
        </TabsContent>

        <TabsContent value="reports">
          <AdminReports />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenterEnhanced />
        </TabsContent>
      </Tabs>
    </div>
  );
};