import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: (userId?: string, existingProfile?: Tables<'profiles'> | null) => Promise<Tables<'profiles'> | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Flag to prevent onAuthStateChange from redundantly fetching profile
  // when a manual login flow is already handling it
  let _skipNextAuthEvent = false;

  const refreshProfile = async (userId?: string, existingProfile?: Tables<'profiles'> | null) => {
    if (existingProfile !== undefined) {
      setProfile(existingProfile);
      return existingProfile;
    }

    let targetId = userId;
    
    if (!targetId) {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      targetId = currentUser?.id;
    }
    
    if (targetId) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();
      setProfile(profileData);
      return profileData;
    } else {
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await refreshProfile(session.user.id);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Skip profile fetch if a manual login is handling it
      if (_skipNextAuthEvent && event === 'SIGNED_IN') {
        _skipNextAuthEvent = false;
        return;
      }
      
      // Only fetch profile for meaningful auth events, not token refreshes
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user && !profile) {
          await refreshProfile(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Tell onAuthStateChange to skip its profile fetch - we handle it manually
    _skipNextAuthEvent = true;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      _skipNextAuthEvent = false;
      throw error;
    }
    
    // Don't fetch profile here - auth pages already do it and pass it via refreshProfile
    // This avoids yet another redundant network request
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear local state first to ensure UI updates immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.clear(); 
      sessionStorage.clear();

      // Then attempt to notify Supabase
      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase signOut error (logged out locally anyway):', error);
      
    } catch (error) {
      console.error('Logout exception:', error);
      // Even if it fails, our local state is already cleared
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
