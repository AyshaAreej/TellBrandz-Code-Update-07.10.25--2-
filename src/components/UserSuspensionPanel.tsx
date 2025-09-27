import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_suspended: boolean;
  suspension_reason?: string;
  suspension_expires?: string;
  created_at: string;
}

interface UserSuspensionPanelProps {
  adminId: string;
}

export const UserSuspensionPanel = ({ adminId }: UserSuspensionPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDuration, setSuspensionDuration] = useState('7');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, is_suspended, suspension_reason, suspension_expires, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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

  const suspendUser = async () => {
    if (!selectedUser || !suspensionReason) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(suspensionDuration));

      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'suspend_user',
          userId: selectedUser.id,
          reason: suspensionReason,
          duration: parseInt(suspensionDuration),
          expiresAt: expiresAt.toISOString(),
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User suspended successfully',
      });

      setSuspensionReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to suspend user',
        variant: 'destructive',
      });
    }
  };

  const unsuspendUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'unsuspend_user',
          userId,
          adminId
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User unsuspended successfully',
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unsuspend user',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Suspension Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.full_name || 'No name'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.is_suspended && (
                    <div className="mt-2">
                      <p className="text-xs text-red-600">Reason: {user.suspension_reason}</p>
                      <p className="text-xs text-red-600">
                        Expires: {user.suspension_expires ? new Date(user.suspension_expires).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.is_suspended ? 'destructive' : 'secondary'}>
                    {user.is_suspended ? 'Suspended' : 'Active'}
                  </Badge>
                  {user.is_suspended ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unsuspendUser(user.id)}
                    >
                      Unsuspend
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setSelectedUser(user)}
                        >
                          Suspend
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Suspend User</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Duration (days)</label>
                            <Select value={suspensionDuration} onValueChange={setSuspensionDuration}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Day</SelectItem>
                                <SelectItem value="3">3 Days</SelectItem>
                                <SelectItem value="7">7 Days</SelectItem>
                                <SelectItem value="14">14 Days</SelectItem>
                                <SelectItem value="30">30 Days</SelectItem>
                                <SelectItem value="0">Permanent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Reason</label>
                            <Textarea
                              value={suspensionReason}
                              onChange={(e) => setSuspensionReason(e.target.value)}
                              placeholder="Enter suspension reason..."
                            />
                          </div>
                          <Button onClick={suspendUser} className="w-full">
                            Suspend User
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};