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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setAuthState({ user: null, loading: false });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setAuthState({ user: null, loading: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setAuthState({ user: null, loading: false });
        return;
      }

      const user: User = {
        id: supabaseUser.id,
        username: profile?.username || profile?.display_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || '',
        role: profile?.role || 'user'
      };

      setAuthState({ user, loading: false });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setAuthState({ user: null, loading: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

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
            username
          }
        }
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Registration error:', error.message);
        console.error('Full error object:', error);
        return false;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        return true;
      }

      console.log('No user returned but no error');
      return false;
    } catch (error) {
      console.error('Registration catch error:', error);
      return false;
    }
  };

  const logout = async () => {
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
