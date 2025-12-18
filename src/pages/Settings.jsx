import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Loader2, 
  ShieldCheck, 
  LogOut,
  Bell
} from 'lucide-react';

export default function Settings() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estados do formulário
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: { full_name: fullName }
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Perfil atualizado! Se alterou o email, verifique a confirmação na sua caixa de entrada.' 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-muted-900">Configurações</h1>
        <p className="text-muted-500">Gere as tuas informações pessoais e preferências de conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navegação Rápida Lateral */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
            <User className="w-4 h-4" /> Perfil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-muted-600 hover:bg-muted-50 rounded-lg transition-colors">
            <ShieldCheck className="w-4 h-4" /> Segurança
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-muted-600 hover:bg-muted-50 rounded-lg transition-colors">
            <Bell className="w-4 h-4" /> Notificações
          </button>
          <div className="pt-4 mt-4 border-t border-muted-100">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair da Conta
            </button>
          </div>
        </div>

        {/* Formulário Principal */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {fullName ? fullName.charAt(0).toUpperCase() : <User />}
                </div>
                <div>
                  <h3 className="font-bold text-muted-900">Foto do Perfil</h3>
                  <p className="text-xs text-muted-500">Avatar gerado automaticamente com base no seu nome.</p>
                </div>
              </div>

              {message.text && (
                <div className={`p-4 rounded-lg text-sm ${
                  message.type === 'success' ? 'bg-success-50 text-success-700 border border-success-100' : 'bg-danger-50 text-danger-700 border border-danger-100'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <Input 
                  label="Nome Completo"
                  icon={User}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                />
                
                <Input 
                  label="Endereço de Email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="pt-4 border-t border-muted-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 px-8"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </Card>

          {/* Card de Informação Extra */}
          <Card className="mt-6 p-6 border-l-4 border-l-warning-400 bg-warning-50/30">
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-warning-600 shrink-0" />
              <div>
                <h4 className="font-bold text-warning-800 text-sm">Privacidade dos Dados</h4>
                <p className="text-xs text-warning-700 mt-1 leading-relaxed">
                  Os teus dados são armazenados de forma encriptada no Supabase. 
                  Nunca partilhamos as tuas informações de contacto ou os dados dos teus leads com terceiros.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
    }
