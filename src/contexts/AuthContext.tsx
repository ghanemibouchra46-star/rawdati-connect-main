import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; profile: Tables<'profiles'> | null }>;
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
  
  // useRef so the flag persists across React re-renders
  const skipNextAuthEvent = useRef(false);

  const refreshProfile = async (userId?: string, existingProfile?: Tables<'profiles'> | null) => {
    // If we already have the profile data, just set it immediately (no network call)
    if (existingProfile !== undefined) {
      setProfile(existingProfile);
      setLoading(false);
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
      setLoading(false);
      return profileData;
    } else {
      setProfile(null);
      setLoading(false);
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

      // Skip profile fetch if a manual login is already handling everything
      if (skipNextAuthEvent.current && event === 'SIGNED_IN') {
        skipNextAuthEvent.current = false;
        return;
      }
      
      // Only fetch profile for meaningful auth events, not token refreshes
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          await refreshProfile(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Set loading so dashboards know to WAIT (prevents bounce-back)
    setLoading(true);
    
    // Tell onAuthStateChange to skip - auth pages handle profile themselves
    skipNextAuthEvent.current = true;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      skipNextAuthEvent.current = false;
      setLoading(false);
      throw error;
    }
    
    // Fetch profile here to return it to the UI immediately
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    
    // IMPORTANT: Do NOT set profile in global state here!
    // The auth page must validate the role first, then call refreshProfile()
    // to commit the profile to global state. This prevents race conditions
    // where a parent profile triggers auto-redirect on the owner page.
    // setLoading stays true until the auth page calls refreshProfile().

    return { user: data.user, session: data.session, profile: profileData };
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
      
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.clear(); 
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut();
      if (error) console.warn('Supabase signOut error (logged out locally anyway):', error);
      
    } catch (error) {
      console.error('Logout exception:', error);
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
