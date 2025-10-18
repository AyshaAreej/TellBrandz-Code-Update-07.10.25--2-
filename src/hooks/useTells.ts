import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fallbackMonitor } from '../lib/monitoring';

export interface Tell {
  type: 'BrandBlast' | 'BrandBeat';
  title: string;
  description: string;
  brand_name: string;
  user_id: string;
  status: 'pending' | 'published' | 'rejected';
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export const useTells = (country?: string) => {
  const [tells, setTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTells = async (filterCountry?: string) => {
    try {
      // Mock data for when Supabase functions aren't available
      // Mock data for when Supabase functions aren't available
      const mockTells: Tell[] = [
        {
          id: '1',
          type: 'BrandBeat',
          title: 'Amazing Customer Service Experience',
          description: 'Had an incredible experience with their support team. They went above and beyond to help me resolve my issue quickly and professionally.',
          brand_name: 'TechCorp',
          user_id: 'user1',
          status: 'published',
          resolved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'BrandBlast',
          title: 'Product Quality Issues',
          description: 'The product I received was not as described. Poor quality materials and construction. Disappointed with this purchase.',
          brand_name: 'FastFashion',
          user_id: 'user2',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'BrandBeat',
          title: 'Outstanding Delivery Service',
          description: 'Package arrived earlier than expected and in perfect condition. The tracking system kept me informed throughout the process.',
          brand_name: 'QuickShip',
          user_id: 'user3',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '4',
          type: 'BrandBlast',
          title: 'Misleading Advertisement',
          description: 'The product features advertised were completely different from what I received. False marketing claims.',
          brand_name: 'GadgetWorld',
          user_id: 'user4',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '5',
          type: 'BrandBeat',
          title: 'Excellent Return Policy',
          description: 'No questions asked return process. Got my refund within 3 business days. Very satisfied with their customer-first approach.',
          brand_name: 'ShopEasy',
          user_id: 'user5',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          updated_at: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          id: '6',
          type: 'BrandBlast',
          title: 'Poor Website Experience',
          description: 'Website constantly crashes during checkout. Lost my cart multiple times. Very frustrating shopping experience.',
          brand_name: 'WebMart',
          user_id: 'user6',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 432000000).toISOString(),
          updated_at: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: '7',
          type: 'BrandBeat',
          title: 'Great Product Quality',
          description: 'Exceeded my expectations in every way. High-quality materials and excellent craftsmanship. Worth every penny.',
          brand_name: 'PremiumGoods',
          user_id: 'user7',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 518400000).toISOString(),
          updated_at: new Date(Date.now() - 518400000).toISOString(),
        },
        {
          id: '8',
          type: 'BrandBlast',
          title: 'Delayed Shipping Issues',
          description: 'Order took 3 weeks longer than promised. No communication about delays. Had to contact support multiple times.',
          brand_name: 'SlowShip',
          user_id: 'user8',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 604800000).toISOString(),
          updated_at: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: '9',
          type: 'BrandBeat',
          title: 'Innovative Product Features',
          description: 'Love the new features they added in the latest update. Shows they really listen to customer feedback.',
          brand_name: 'InnovateTech',
          user_id: 'user9',
          status: 'published',
          resolved: false,
          created_at: new Date(Date.now() - 691200000).toISOString(),
          updated_at: new Date(Date.now() - 691200000).toISOString(),
        }
      ];

      try {
        const { data, error } = await supabase.functions.invoke('get-tells', {
          body: { 
            country: filterCountry || country,
            limit: 20,
            offset: 0 
          }
        });

        if (data?.tells) {
          setTells(data.tells);
          if (data.fallback) {
            fallbackMonitor.log('useTells', 'supabase_fallback', { message: data.message });
          }
        } else {
          fallbackMonitor.log('useTells', 'no_data_fallback', { error });
          setTells(mockTells);
        }
      } catch (functionError) {
        fallbackMonitor.log('useTells', 'function_unavailable', { error: functionError });
        setTells(mockTells);
      }
    } catch (error) {
      console.error('Error fetching tells:', error);
      setTells([]);
    } finally {
      setLoading(false);
    }
  };
  const submitTell = async (tellData: {
    type: 'BrandBlast' | 'BrandBeat';
    title: string;
    description: string;
    brand_name: string;
    image_url?: string;
    evidence_urls?: string[];
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('submit-tell', {
        body: tellData
      });
      if (error) throw error;
      
      // Add the new tell to local state immediately for instant UI update
      if (data?.tell) {
        setTells(prev => [data.tell, ...prev]);
      }
      
      // Also refresh the data to get the latest from server
      await fetchTells();
      
      return data;
    } catch (error) {
      console.error('Error submitting tell:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTells();
  }, [country]);

  return {
    tells,
    loading,
    submitTell,
    refetch: fetchTells,
  };
};