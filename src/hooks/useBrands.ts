import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Brand {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  contact_email?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const createBrand = async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('brand-management', {
        body: { action: 'create', brandData }
      });
      
      if (error) throw error;
      await fetchBrands(); // Refresh list
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    try {
      const { data, error } = await supabase.functions.invoke('brand-management', {
        body: { action: 'update', brandData: { id, ...updates } }
      });
      
      if (error) throw error;
      await fetchBrands(); // Refresh list
      return data;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  };

  return {
    brands,
    loading,
    createBrand,
    updateBrand,
    refetch: fetchBrands
  };
};