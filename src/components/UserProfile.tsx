import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Edit, Trash2, Eye, User, Mail, Lock, Palette } from 'lucide-react';
import { AccountSettingsEnhanced } from './AccountSettingsEnhanced';
import { NotificationCenterEnhanced } from './NotificationCenterEnhanced';
import { ActivityHistoryEnhanced } from './ActivityHistoryEnhanced';
import { AccountSettings } from './AccountSettings';
import { NotificationCenter } from './NotificationCenter';
import { ActivityHistory } from './ActivityHistory';
import { TellCard } from './TellCard';

import { useAuth } from '@/hooks/useAuth';
import { useTells } from '@/hooks/useTells';
import { useToast } from '@/hooks/use-toast';
export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { tells, loading: tellsLoading } = useTells();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  });

  const userTells = tells.filter(tell => tell.userName === user?.user_metadata?.full_name);

  const handleSaveProfile = () => {
    // TODO: Implement profile update
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast({
      title: "Account Deletion",
      description: "Account deletion feature coming soon.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="tells">My Tells</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme for the application
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tells">
          <Card>
            <CardHeader>
              <CardTitle>My Tells ({userTells.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tellsLoading ? (
                <p>Loading your tells...</p>
              ) : userTells.length === 0 ? (
                <p className="text-muted-foreground">You haven't submitted any tells yet.</p>
              ) : (
                <div className="space-y-4">
                  {userTells.map((tell) => (
                    <TellCard key={tell.id} tell={tell} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <AccountSettingsEnhanced />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenterEnhanced />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityHistoryEnhanced />
        </TabsContent>
      </Tabs>
    </div>
  );
};