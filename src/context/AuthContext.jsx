import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar sessão ativa ao carregar
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // 2. Ouvir mudanças no estado de autenticação (Login, Logout, Update)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Método de Logout centralizado
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Valor exposto pelo contexto
  const value = {
    session,
    user,
    signOut,
    isAuthenticated: !!user,
    // Expor metadados de forma limpa
    profile: {
      name: user?.user_metadata?.full_name || 'User',
      avatar: user?.user_metadata?.avatar_url || null,
      email: user?.email
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-muted-50 dark:bg-muted-950">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-400">
               Authenticating LeadPilot
             </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
