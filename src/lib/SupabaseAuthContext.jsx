import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const loadProfile = async (authUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    const merged = {
      id: authUser.id,
      email: authUser.email,
      full_name: profile?.full_name || authUser.user_metadata?.full_name || '',
      avatar_url: profile?.avatar_url || '',
      banner_url: profile?.banner_url || '',
      bio: profile?.bio || '',
      favorite_category: profile?.favorite_category || '',
      role: profile?.role || 'user',
      cargo: profile?.cargo || '',
      cargo_icon: profile?.cargo_icon || '',
      stars: profile?.stars || 0,
      created_date: profile?.created_at || authUser.created_at,
    };

    setUser(merged);
    setIsAuthenticated(true);
    setIsLoadingAuth(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setIsLoadingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) await loadProfile(authUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <SupabaseAuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError: null,
      authChecked: !isLoadingAuth,
      logout,
      navigateToLogin: () => { window.location.href = '/login'; },
      refreshUser,
    }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  return context;
};