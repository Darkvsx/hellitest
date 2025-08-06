import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setAuthState({ user: null, loading: false });
          }
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.email);
          await fetchUserProfile(session.user);
        } else {
          console.log('No existing session found');
          if (mounted) {
            setAuthState({ user: null, loading: false });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState({ user: null, loading: false });
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          setAuthState({ user: null, loading: false });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: supabaseUser.id,
              username: supabaseUser.email?.split('@')[0] || 'User',
              display_name: supabaseUser.email?.split('@')[0] || 'User',
              email: supabaseUser.email || '',
              role: supabaseUser.email?.includes('@helldivers.com') ? 'admin' : 'user'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            setAuthState({ user: null, loading: false });
            return;
          }
          
          const user: User = {
            id: supabaseUser.id,
            username: newProfile.username || 'User',
            email: supabaseUser.email || '',
            role: newProfile.role || 'user'
          };

          console.log('New profile created:', user);
          setAuthState({ user, loading: false });
          return;
        } else {
          setAuthState({ user: null, loading: false });
          return;
        }
      }

      const user: User = {
        id: supabaseUser.id,
        username: profile.username || profile.display_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: profile.role || 'user'
      };

      console.log('Profile loaded:', user);
      setAuthState({ user, loading: false });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setAuthState({ user: null, loading: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      console.log('Login successful');
      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username
          }
        }
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration catch error:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    await supabase.auth.signOut();
    setAuthState({ user: null, loading: false });
  };

  const { user, loading } = authState;
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
