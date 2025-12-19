import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { 
  User, Mail, Lock, Save, Loader2, ShieldCheck, 
  LogOut, Bell, Camera, CheckCircle2, AlertCircle 
} from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const { user, signOut } = useAuth();
  const fileInputRef = useRef(null);
  
  // Controle de Abas
  const [activeTab, setActiveTab] = useState('perfil'); // perfil, seguranca, notificacoes

  // Estados do Perfil
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  // Função para Upload de Foto
  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obter URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Atualizar metadados do utilizador
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      setMessage({ type: 'success', text: 'Foto de perfil atualizada!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar foto: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

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
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-muted-900 tracking-tight">Configurações</h1>
        <p className="text-muted-500 mt-1">Gere a tua conta, segurança e preferências de notificações.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Menu Lateral Estilizado */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'perfil', label: 'Perfil', icon: User },
            { id: 'seguranca', label: 'Segurança', icon: ShieldCheck },
            { id: 'notificacoes', label: 'Notificações', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
                  : "text-muted-500 hover:bg-white hover:text-muted-900 shadow-sm border border-transparent hover:border-muted-200"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-muted-200">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-danger-600 hover:bg-danger-50 rounded-xl font-semibold transition-all"
            >
              <LogOut className="w-5 h-5" /> Sair da Conta
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ABA: PERFIL */}
          {activeTab === 'perfil' && (
            <Card className="p-8 border-none shadow-xl shadow-muted-200/50">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                {/* Upload de Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-600 overflow-hidden border-4 border-white shadow-md">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        fullName?.charAt(0).toUpperCase()
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-lg border border-muted-100 text-primary-600 hover:text-primary-700 transition-transform hover:scale-110"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleUploadAvatar} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-muted-900">Foto de Perfil</h3>
                    <p className="text-sm text-muted-500">Clique no ícone para carregar uma imagem personalizada.</p>
                  </div>
                </div>

                {message.text && (
                  <div className={clsx(
                    "p-4 rounded-xl flex items-center gap-3 border animate-in zoom-in duration-300",
                    message.type === 'success' ? "bg-success-50 border-success-100 text-success-700" : "bg-danger-50 border-danger-100 text-danger-700"
                  )}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input 
                    label="Nome Completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input 
                    label="Email da Conta"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="pt-6 border-t border-muted-100 flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary px-10 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-500/30">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Guardar Perfil
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* ABA: SEGURANÇA (Placeholder Robusto) */}
          {activeTab === 'seguranca' && (
            <Card className="p-8 border-none shadow-xl shadow-muted-200/50">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning-100 rounded-xl text-warning-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-muted-900">Segurança da Conta</h3>
                    <p className="text-sm text-muted-500">Mantenha a sua palavra-passe atualizada.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted-50 rounded-xl border border-muted-200 text-sm text-muted-600">
                  A funcionalidade de alteração de palavra-passe requer verificação por email via Supabase.
                </div>
                
                <button className="btn-secondary w-full sm:w-auto">
                  Solicitar nova palavra-passe
                </button>
              </div>
            </Card>
          )}

          {/* ABA: NOTIFICAÇÕES (Interface Mockup) */}
          {activeTab === 'notificacoes' && (
            <Card className="p-8 border-none shadow-xl shadow-muted-200/50">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-muted-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-600" /> Preferências de Aviso
                </h3>
                
                <div className="divide-y divide-muted-100">
                  {[
                    { t: 'Novos Leads', d: 'Receba um aviso quando um novo lead for captado.' },
                    { t: 'Tarefas Pendentes', d: 'Lembretes diários de tarefas por concluir.' },
                    { t: 'Atualizações de Sistema', d: 'Novidades sobre o LeadPilot.' }
                  ].map((item, i) => (
                    <div key={i} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-muted-800 text-sm">{item.t}</p>
                        <p className="text-xs text-muted-500">{item.d}</p>
                      </div>
                      <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
                                         }
