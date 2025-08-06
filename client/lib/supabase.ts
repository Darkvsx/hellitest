import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahqqptrclqtwqjgmtesv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocXFwdHJjbHF0d3FqZ210ZXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDM3NTMsImV4cCI6MjA2OTkxOTc1M30.FRFHf-XvnBLzZvcGseS82HJIORQXs_8OEEVq0RpabN0'

console.log('Supabase Config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  hasEnvUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasEnvKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Test connection immediately
let connectionTested = false;
export let isSupabaseAvailable = true;

export async function testConnection() {
  if (connectionTested) return isSupabaseAvailable;

  try {
    console.log('Testing Supabase connection...');
    const { error } = await supabase.from('profiles').select('count', { count: 'exact' });

    if (error) {
      console.error('Supabase connection failed:', error);
      isSupabaseAvailable = false;
    } else {
      console.log('Supabase connection successful');
      isSupabaseAvailable = true;
    }
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    isSupabaseAvailable = false;
  }

  connectionTested = true;
  return isSupabaseAvailable;
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          display_name: string | null
          email: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          display_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          display_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          original_price: number | null
          duration: string
          difficulty: string
          features: string[]
          active: boolean
          popular: boolean
          orders_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          original_price?: number | null
          duration: string
          difficulty: string
          features?: string[]
          active?: boolean
          popular?: boolean
          orders_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          original_price?: number | null
          duration?: string
          difficulty?: string
          features?: string[]
          active?: boolean
          popular?: boolean
          orders_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_email: string
          customer_name: string
          status: 'pending' | 'processing' | 'in-progress' | 'completed' | 'cancelled'
          total_amount: number
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          estimated_completion: string | null
          assigned_booster: string | null
          progress: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_email: string
          customer_name: string
          status?: 'pending' | 'processing' | 'in-progress' | 'completed' | 'cancelled'
          total_amount: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          estimated_completion?: string | null
          assigned_booster?: string | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_email?: string
          customer_name?: string
          status?: 'pending' | 'processing' | 'in-progress' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          estimated_completion?: string | null
          assigned_booster?: string | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          service_id: string
          service_name: string
          service_price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          service_id: string
          service_name: string
          service_price: number
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          service_id?: string
          service_name?: string
          service_price?: number
          quantity?: number
          created_at?: string
        }
      }
      order_messages: {
        Row: {
          id: string
          order_id: string
          from_role: 'customer' | 'admin' | 'booster'
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          from_role: 'customer' | 'admin' | 'booster'
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          from_role?: 'customer' | 'admin' | 'booster'
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      order_tracking: {
        Row: {
          id: string
          order_id: string
          status: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: string
          description?: string
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          service_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}
