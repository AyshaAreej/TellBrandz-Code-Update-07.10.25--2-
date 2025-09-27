import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Resolution {
  id: string;
  tell_id: string;
  brand_id: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  resolution_type?: string;
  resolution_details?: string;
  brand_response?: string;
  customer_satisfaction?: number;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export const useResolutions = () => {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('resolutions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResolutions(data || []);
    } catch (error) {
      console.error('Error fetching resolutions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolutions();
  }, []);

  const createResolution = async (resolutionData: Omit<Resolution, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('resolution-management', {
        body: { action: 'create', resolutionData }
      });
      
      if (error) throw error;
      await fetchResolutions();
      return data;
    } catch (error) {
      console.error('Error creating resolution:', error);
      throw error;
    }
  };

  const updateResolution = async (id: string, updates: Partial<Resolution>) => {
    try {
      const { data, error } = await supabase.functions.invoke('resolution-management', {
        body: { action: 'update', resolutionData: { id, ...updates } }
      });
      
      if (error) throw error;
      await fetchResolutions();
      return data;
    } catch (error) {
      console.error('Error updating resolution:', error);
      throw error;
    }
  };

  const resolveCase = async (id: string, resolutionDetails: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('resolution-management', {
        body: { 
          action: 'resolve', 
          resolutionData: { id, resolution_details: resolutionDetails }
        }
      });
      
      if (error) throw error;
      await fetchResolutions();
      return data;
    } catch (error) {
      console.error('Error resolving case:', error);
      throw error;
    }
  };

  return {
    resolutions,
    loading,
    createResolution,
    updateResolution,
    resolveCase,
    refetch: fetchResolutions
  };
};