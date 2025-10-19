import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pwjalknplkbxriaiimvr.supabase.co';
const supabaseAnonKey = 'sb_publishable_QrLe9JV5bb-99VjzzJIa7g_obMrBhyp';

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'tellbrandz-web-v2'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Expose the URL for demo mode detection
(supabase as any).supabaseUrl = supabaseUrl;


// Enhanced connection test function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      return { 
        success: false, 
        demo: false, 
        message: `Connection failed: ${error.message}` 
      };
    }

    return { 
      success: true, 
      demo: false, 
      message: 'Connected to Supabase successfully' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Network connection failed' 
    };
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return {
      auth: !error,
      user: !!user,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      auth: false,
      user: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export types
export type { User, Session } from '@supabase/supabase-js';