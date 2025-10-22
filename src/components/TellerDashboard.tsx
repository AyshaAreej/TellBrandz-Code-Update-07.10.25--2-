import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, MessageSquare, Calendar, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import DataInsightsPanel from '@/components/DataInsightsPanel';
import DataAuditPanel from '@/components/DataAuditPanel';
import TellCard from './ui/tellCard';


interface Tell {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  brands: {
    name: string;
    logo_url?: string;
  };
}

export default function TellerDashboard() {
  const { user } = useAuth();
  const [tells, setTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useUserProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchUserTells();
    }
  }, [user?.id]);

  const fetchUserTells = async () => {
    try {
      const { data, error } = await supabase
        .from('tells')
        .select(`
          id, title, content, status, created_at, tell_type, brand_name
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match expected format
      const transformedTells = (data || []).map(tell => ({
        ...tell,
        content: tell.content,
        brands: {
          name: tell.brand_name,
          logo_url: null
        }
      }));
      
      setTells(transformedTells);
    } catch (error) {
      console.error('Error fetching tells:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your tells',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getDisplayName = (fullName = false) => {
    if (userProfile?.full_name) {
      return fullName
        ? userProfile.full_name
        : userProfile.full_name.split(" ")[0];
    }
    if (user?.user_metadata?.full_name) {
      return fullName
        ? user.user_metadata.full_name
        : user.user_metadata.full_name.split(" ")[0];
    }
    if (user?.user_metadata?.name) {
      return fullName
        ? user.user_metadata.name
        : user.user_metadata.name.split(" ")[0];
    }
    return "Teller";
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">✓ Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="destructive">Open</Badge>;
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      {/* Welcome Card with Profile Photo */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back,{getDisplayName()}! 👋
              </h2>
              <p className="text-muted-foreground">
                Ready to share your next experience?
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* <ProfilePhotoUpload
                currentPhotoUrl={userProfile?.profile_photo_url}
              /> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Your Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track your tells and brand interactions
              </p>
            </div>
            <Button 
              onClick={() => navigate('/share-experience')} 
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 text-sm"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Share New Experience</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tells" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tells">My Tells</TabsTrigger>
              <TabsTrigger value="insights">Data & Insights</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="tells" className="mt-6">
              <div className="space-y-4">
                {tells.map((tell) => (
                   <TellCard
                    key={tell.id}
                    tell={tell}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
                {tells.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No tells shared yet</p>
                    <Button onClick={() => navigate('/share-experience')}>
                      Share Your First Experience
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-6">
              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="data">Data Management</TabsTrigger>
                </TabsList>
                <TabsContent value="insights" className="mt-6">
                  <DataInsightsPanel userId={user?.id || ''} />
                </TabsContent>
                <TabsContent value="data" className="mt-6">
                  <DataAuditPanel userId={user?.id || ''} />
                </TabsContent>
              </Tabs>
            </TabsContent>
            

            <TabsContent value="stats" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{tells.length}</p>
                      <p className="text-sm text-muted-foreground">Total Tells</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {tells.filter(t => t.status === 'resolved').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {tells.filter(t => t.status === 'in_progress').length}
                      </p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {tells.filter(t => t.status === 'open').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Profile Photo and Info */}
                    <div className="text-center">
                      <ProfilePhotoUpload
                        currentPhotoUrl={userProfile?.avatar_url}
                      />
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                           {userProfile?.full_name ||
                            user?.user_metadata?.full_name ||
                            user?.user_metadata?.name ||
                            "Teller"}
                        </h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Theme Preference</h4>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <DarkModeToggle />
                    </div>

                    {/* Logout Button */}
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};