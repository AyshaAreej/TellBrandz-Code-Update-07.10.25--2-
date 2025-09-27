import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResolutionWorkflow } from './ResolutionWorkflow';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tell {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  users: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export const BrandDashboardEnhanced = () => {
  const { user } = useAuth();
  const [tells, setTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTell, setSelectedTell] = useState<Tell | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.brand_id) {
      fetchBrandTells();
      fetchUserProfile();
    }
  }, [user?.brand_id]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchBrandTells = async () => {
    try {
      const { data, error } = await supabase
        .from('tells')
        .select(`
          id, title, content, status, created_at,
          users(full_name, email, avatar_url)
        `)
        .eq('brand_id', user?.brand_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTells(data || []);
    } catch (error) {
      console.error('Error fetching tells:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch brand tells',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    setUserProfile(prev => ({ ...prev, avatar_url: photoUrl }));
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
                Welcome back, {userProfile?.first_name || 'Brand Rep'}! 👋
              </h2>
              <p className="text-muted-foreground">
                Manage your brand's tells and customer relationships
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ProfilePhotoUpload
                currentPhotoUrl={userProfile?.avatar_url}
                onPhotoUpdate={handlePhotoUpdate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Representative Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your brand's tells and resolution process
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tells" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tells">Brand Tells</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="tells" className="mt-6">
              <div className="space-y-4">
                {tells.map((tell) => (
                  <div key={tell.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{tell.title}</h3>
                      {getStatusBadge(tell.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tell.content}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={tell.users.avatar_url || 'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757129321085_96dfb1d7.png'} />
                        <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">
                        By: {tell.users.full_name} ({tell.users.email})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedTell(tell)}
                            disabled={tell.status === 'resolved'}
                          >
                            {tell.status === 'resolved' ? 'Resolved' : 'Start Resolution'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Resolution Process</DialogTitle>
                          </DialogHeader>
                          {selectedTell && (
                            <ResolutionWorkflow
                              tellId={selectedTell.id}
                              brandId={user?.brand_id || ''}
                              tellTitle={selectedTell.title}
                              tellContent={selectedTell.content}
                              customerEmail={selectedTell.users.email}
                              isBrand={true}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
                {tells.length === 0 && (
                  <p className="text-center text-muted-foreground">No tells found for your brand</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-6">
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
                        {tells.length > 0 
                          ? Math.round((tells.filter(t => t.status === 'resolved').length / tells.length) * 100)
                          : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Resolution Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <ProfilePhotoUpload
                      currentPhotoUrl={userProfile?.avatar_url}
                      onPhotoUpdate={handlePhotoUpdate}
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        {userProfile?.first_name || 'Brand Representative'}
                      </h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="mt-6">
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