import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, Shield, Building } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUserTypeDisplay = () => {
    if (!user) return null;
    
    if (user.user_metadata?.role === 'admin') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Admin
        </Badge>
      );
    }
    
    if (user.user_metadata?.brand_id) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Building className="w-3 h-3" />
          Brand Rep
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <User className="w-3 h-3" />
        Customer
      </Badge>
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {user ? (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{user.email}</p>
                <div className="flex items-center gap-2">
                  {getUserTypeDisplay()}
                  <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                    {user.email_confirmed_at ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={signOut}
              size="sm" 
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-gray-600 mb-2">Not authenticated</p>
            <Badge variant="secondary">Guest</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { AuthStatus };
export default AuthStatus;