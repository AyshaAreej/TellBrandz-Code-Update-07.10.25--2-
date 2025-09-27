import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountSettingsEnhanced } from './AccountSettingsEnhanced';
import { NotificationCenterEnhanced } from './NotificationCenterEnhanced';
import { ActivityHistoryEnhanced } from './ActivityHistoryEnhanced';
import { Building2, Edit, Settings, MessageSquare, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TellCard } from './TellCard';
import { AccountSettings } from './AccountSettings';
import { NotificationCenter } from './NotificationCenter';
import { ActivityHistory } from './ActivityHistory';
import BrandAchievements from './BrandAchievements';
import { useAuth } from '@/hooks/useAuth';
import { useTells } from '@/hooks/useTells';
import { useBrands } from '@/hooks/useBrands';
import { useToast } from '@/hooks/use-toast';

export const BrandProfile: React.FC = () => {
  const { user } = useAuth();
  const { tells, loading: tellsLoading } = useTells();
  const { brands } = useBrands();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: ''
  });

  // Find current brand based on user
  const currentBrand = brands.find(brand => brand.email === user?.email);
  const brandTells = tells.filter(tell => tell.brandName === currentBrand?.name);

  useEffect(() => {
    if (currentBrand) {
      setFormData({
        name: currentBrand.name,
        description: currentBrand.description || '',
        website: currentBrand.website || '',
        industry: currentBrand.industry || ''
      });
    }
  }, [currentBrand]);

  const handleSaveProfile = () => {
    // TODO: Implement brand profile update
    toast({
      title: "Brand Profile Updated",
      description: "Your brand profile has been updated successfully."
    });
    setIsEditing(false);
  };

  const resolvedTells = brandTells.filter(tell => tell.resolved);
  const pendingTells = brandTells.filter(tell => !tell.resolved);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Brand Dashboard</h1>
        <Badge variant="secondary" className="text-sm">
          <Building2 className="h-4 w-4 mr-1" />
          Brand Account
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tells</p>
                <p className="text-2xl font-bold">{brandTells.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedTells.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTells.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Brand Profile</TabsTrigger>
          <TabsTrigger value="tells">Tells About Us</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Brand Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
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
          
          {/* Brand Achievements Section */}
          {currentBrand && (
            <BrandAchievements 
              brandId={currentBrand.id} 
              brandName={currentBrand.name} 
            />
          )}
        </TabsContent>

        <TabsContent value="tells">
          <Card>
            <CardHeader>
              <CardTitle>Tells About {currentBrand?.name} ({brandTells.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tellsLoading ? (
                <p>Loading tells...</p>
              ) : brandTells.length === 0 ? (
                <p className="text-muted-foreground">No tells about your brand yet.</p>
              ) : (
                <div className="space-y-4">
                  {brandTells.map((tell) => (
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