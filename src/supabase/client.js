import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de Integridade em Desenvolvimento
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "LeadPilot: Supabase credentials are missing. Check your .env file."
  );
}

/**
 * Supabase Client Instance
 * Configurado com persistência automática de sessão.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Utilitário para verificar a saúde da conexão (Opcional - Premium DX)
 * Pode ser usado em logs de monitorização.
 */
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('leads').select('id').limit(1);
    return !error;
  } catch (err) {
    return false;
  }
};
