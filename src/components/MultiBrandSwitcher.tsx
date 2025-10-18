import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Brand {
  id: string;
  name: string;
  domain: string;
  logo_url?: string;
  token_balance: number;
  status: string;
}

interface MultiBrandSwitcherProps {
  currentBrandId: string;
  onBrandChange: (brandId: string) => void;
  userId: string;
}

export const MultiBrandSwitcher: React.FC<MultiBrandSwitcherProps> = ({
  currentBrandId,
  onBrandChange,
  userId,
}) => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadBrands();
  }, [userId]);

  useEffect(() => {
    if (brands.length > 0 && currentBrandId) {
      const brand = brands.find(b => b.id === currentBrandId);
      setCurrentBrand(brand || null);
    }
  }, [brands, currentBrandId]);

  const loadBrands = async () => {
    try {
      // Get brands where user is a representative
      const { data: reps, error: repsError } = await supabase
        .from('brand_representatives')
        .select('brand_id, role')
        .eq('user_id', userId);

      if (repsError) throw repsError;

      if (!reps || reps.length === 0) {
        setBrands([]);
        setLoading(false);
        return;
      }

      const brandIds = reps.map(r => r.brand_id);

      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, domain, logo_url, token_balance, status')
        .in('id', brandIds);

      if (brandsError) throw brandsError;

      setBrands(brandsData || []);
    } catch (error) {
      console.error('Error loading brands:', error);
      toast({
        title: "Error",
        description: "Failed to load brands.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSwitch = (brandId: string) => {
    onBrandChange(brandId);
    setOpen(false);
    toast({
      title: "Brand switched",
      description: `Now viewing ${brands.find(b => b.id === brandId)?.name}`,
    });
  };

  if (loading) {
    return <div className="animate-pulse h-10 w-48 bg-gray-200 rounded-lg" />;
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="font-medium">{currentBrand?.name || 'Select Brand'}</span>
            {currentBrand && (
              <Badge variant="secondary" className="ml-2">
                {currentBrand.token_balance} tokens
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            YOUR BRANDS ({brands.length})
          </div>
          <div className="space-y-1">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandSwitch(brand.id)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="h-8 w-8 rounded object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-medium text-sm">{brand.name}</div>
                    <div className="text-xs text-muted-foreground">{brand.domain}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {brand.token_balance}
                  </Badge>
                  {brand.id === currentBrandId && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="border-t mt-2 pt-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Brand
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};