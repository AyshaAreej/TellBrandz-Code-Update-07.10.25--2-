import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AIMediationPanel } from './AIMediationPanel';
import { AdvancedFilterPresets } from './AdvancedFilterPresets';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';


interface Tell {
  id: string;
  title: string;
  description: string;
  brand_name: string;
  type: string;
  operational_tags?: string[];
  emotional_tone?: string;
  resolution_status?: string;
  created_at: string;
}

export function BrandTriageFeed({ brandId, tokenBalance, onTokenDeduct }: any) {
  const [tells, setTells] = useState<Tell[]>([]);
  const [filteredTells, setFilteredTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTell, setSelectedTell] = useState<Tell | null>(null);
  const [tokenResolutionEnabled, setTokenResolutionEnabled] = useState(false);
  const [convertingTell, setConvertingTell] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const TOKEN_COST = 5;


  useEffect(() => {
    fetchCriticalTells();
  }, [brandId]);

  const fetchCriticalTells = async () => {
    try {
      const { data: brand } = await supabase.from('brands').select('domain').eq('id', brandId).single();
      if (!brand) return;

      const { data, error } = await supabase
        .from('tells')
        .select('*')
        .eq('brand_name', brand.domain)
        .eq('type', 'bad')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTells(data || []);
    } catch (error) {
      console.error('Failed to fetch tells:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: any) => {
    setCurrentFilters(filters);
    let filtered = [...tells];
    
    if (filters.status) {
      filtered = filtered.filter(t => t.resolution_status === filters.status);
    }
    if (filters.sentiment) {
      filtered = filtered.filter(t => t.emotional_tone === filters.sentiment);
    }
    if (filters.operationalTags?.length) {
      filtered = filtered.filter(t => 
        t.operational_tags?.some(tag => filters.operationalTags.includes(tag))
      );
    }
    
    setFilteredTells(filtered);
  };

  const handleConvertToBrandBeat = async (tellId: string) => {
    if (tokenBalance < TOKEN_COST) {
      alert('Insufficient Tokens. Please top up your account to convert this BrandBlast.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: rep } = await supabase.from('brand_representatives').select('id').eq('email', user?.email).single();

      const { data, error } = await supabase.functions.invoke('token-resolution', {
        body: { brandId, tellId, repId: rep?.id, tokenCost: TOKEN_COST }
      });

      if (error) throw error;
      onTokenDeduct(TOKEN_COST);
      fetchCriticalTells();
      setConvertingTell(null);
      alert('Successfully converted to BrandBeat!');
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try again.');
    }
  };

  const displayTells = filteredTells.length > 0 ? filteredTells : tells;



  if (loading) return <div>Loading...</div>;


  return (
    <>
      <AdvancedFilterPresets currentFilters={currentFilters} onApplyPreset={applyFilters} />
      
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>BrandBlast Triage Feed</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="token-mode">Token Resolution Mode</Label>
              <Switch id="token-mode" checked={tokenResolutionEnabled} onCheckedChange={setTokenResolutionEnabled} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayTells.map((tell) => (
            <div key={tell.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="destructive">{tell.type}</Badge>
                {tell.operational_tags && (
                  <Badge variant="outline" title="AI-generated operational tag">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {tell.operational_tags[0]}
                  </Badge>
                )}
                {tell.emotional_tone && (
                  <Badge title="AI-detected emotional tone">{tell.emotional_tone}</Badge>
                )}
              </div>
              <h4 className="font-semibold">{tell.title}</h4>
              <p className="text-sm mt-1">{tell.description}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => setSelectedTell(tell)}>
                  AI Response
                </Button>
                {tokenResolutionEnabled && (
                  <Button size="sm" variant="outline" onClick={() => setConvertingTell(tell.id)}>
                    Convert to BrandBeat ({TOKEN_COST} Tokens)
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>


      <Dialog open={!!selectedTell} onOpenChange={() => setSelectedTell(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Customer</DialogTitle>
          </DialogHeader>
          {selectedTell && (
            <AIMediationPanel
              tellId={selectedTell.id}
              tellText={selectedTell.description}
              brandName={selectedTell.brand_name}
              onResponseSent={() => {
                setSelectedTell(null);
                fetchCriticalTells();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!convertingTell} onOpenChange={() => setConvertingTell(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm BrandBeat Conversion</AlertDialogTitle>
            <AlertDialogDescription>
              Convert this BrandBlast to a BrandBeat for {TOKEN_COST} Tokens?
              <br />Current Balance: {tokenBalance} Tokens
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => convertingTell && handleConvertToBrandBeat(convertingTell)}>
              Confirm Conversion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

