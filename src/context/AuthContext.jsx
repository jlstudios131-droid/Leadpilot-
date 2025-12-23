import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get Initial Session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Auth Initialization Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 2. Real-time Auth Listener
    // Isso garante que se o utilizador mudar o nome/avatar nas Settings, 
    // a UI atualiza globalmente de imediato.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (data) => supabase.auth.signUp(data);
  const signIn = (data) => supabase.auth.signInWithPassword(data);
  const signOut = () => supabase.auth.signOut();

  // Helper para extrair metadados de forma limpa (Premium DX)
  const profile = {
    id: user?.id,
    email: user?.email,
    name: user?.user_metadata?.full_name || 'Pilot',
    avatar: user?.user_metadata?.avatar_url || null,
    initials: user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'P'
  };

  const value = { 
    user, 
    profile, // Facilitamos o acesso aos dados formatados
    loading, 
    signUp, 
    signIn, 
    signOut,
    isAuthenticated: !!user 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        // Ecrã de Splash Premium enquanto verifica a sessão
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white dark:bg-muted-950">
          <div className="w-12 h-12 border-4 border-primary-100 dark:border-muted-800 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-400 animate-pulse">
            Authenticating LeadPilot
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Hook com proteção (Garante que não usas auth fora do provider por erro)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
