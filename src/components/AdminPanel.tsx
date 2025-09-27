import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TellModerationPanel } from './TellModerationPanel';
import { UserSuspensionPanel } from './UserSuspensionPanel';
import { AppealProcessPanel } from './AppealProcessPanel';
import { AdvancedContentFilter } from './AdvancedContentFilter';
import { BulkOperations } from './BulkOperations';
import { AutoModerationPanel } from './AutoModerationPanel';
import { ExternalModerationIntegration } from './ExternalModerationIntegration';
import { AdminReports } from './AdminReports';
import { NotificationCenterEnhanced } from './NotificationCenterEnhanced';
import { Shield, Users, MessageSquare, Settings, BarChart3, Bell, Zap, Filter } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive moderation and management tools
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
          <TellModerationPanel adminId="" />
        </TabsContent>

        <TabsContent value="users">
          <UserSuspensionPanel adminId="" />
        </TabsContent>

        <TabsContent value="appeals">
          <AppealProcessPanel adminId="" />
        </TabsContent>

        <TabsContent value="filters">
          <AdvancedContentFilter adminId="" />
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