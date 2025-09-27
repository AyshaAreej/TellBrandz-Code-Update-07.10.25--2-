import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BrandClaim {
  id: string;
  user_id: string;
  brand_id: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_document: string;
  created_at: string;
  users: {
    email: string;
    full_name: string;
  };
  brands: {
    name: string;
  };
}

export const BrandClaimsManagement = () => {
  const [claims, setClaims] = useState<BrandClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_claims')
        .select(`
          *,
          users(email, full_name),
          brands(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch brand claims',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: action === 'approve' ? 'approve_brand_claim' : 'reject_brand_claim',
          claim_id: claimId
        }
      });

      if (error) throw error;

      await fetchClaims();
      toast({
        title: 'Success',
        description: `Brand claim ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} claim`,
        variant: 'destructive',
      });
    }
  };

  if (loading) return <p>Loading claims...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Claims Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{claim.users.full_name}</p>
                <p className="text-sm text-muted-foreground">{claim.users.email}</p>
                <p className="text-sm">Brand: {claim.brands.name}</p>
                <p className="text-xs text-muted-foreground">
                  Applied: {new Date(claim.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  claim.status === 'approved' ? 'default' : 
                  claim.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {claim.status}
                </Badge>
                {claim.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleClaimAction(claim.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleClaimAction(claim.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {claims.length === 0 && (
            <p className="text-center text-muted-foreground">No brand claims found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};