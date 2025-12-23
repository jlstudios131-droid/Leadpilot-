import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { 
  User, Mail, Lock, Save, Loader2, ShieldCheck, 
  LogOut, Bell, Camera, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Settings() {
  const { user, signOut } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
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

  const handleUploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files?.length) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      setMessage({ type: 'success', text: 'Identity image updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
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
        email,
        data: { full_name: fullName }
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile synchronization complete.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-muted-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-muted-500 dark:text-muted-400 font-medium mt-1">Manage your lifetime credentials and preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 group",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20" 
                    : "text-muted-500 dark:text-muted-400 hover:bg-white dark:hover:bg-muted-900 hover:text-primary-600"
                )}
              >
                <tab.icon size={18} className={clsx(activeTab === tab.id ? "text-white" : "group-hover:scale-110 transition-transform")} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t border-muted-200 dark:border-muted-800">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-2xl font-bold transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Section */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <Card className="p-8 md:p-10 border-none shadow-2xl shadow-black/5">
                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    {/* Identity Avatar */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-muted-50/50 dark:bg-muted-900/50 rounded-[2rem] border border-muted-100 dark:border-muted-800">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-3xl bg-primary-600 flex items-center justify-center text-3xl font-black text-white overflow-hidden shadow-2xl ring-4 ring-white dark:ring-muted-800">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            fullName?.charAt(0).toUpperCase()
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-muted-800 rounded-xl shadow-xl border border-muted-100 dark:border-muted-700 text-primary-600 hover:scale-110 transition-transform"
                        >
                          <Camera size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} className="hidden" accept="image/*" />
                      </div>
                      <div className="text-center md:text-left space-y-1">
                        <h3 className="text-xl font-black text-muted-900 dark:text-white">Profile Identity</h3>
                        <p className="text-sm text-muted-500 dark:text-muted-400 font-medium">Recommended size: 400x400px. Max 2MB.</p>
                      </div>
                    </div>

                    {message.text && (
                      <div className={clsx(
                        "p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-2",
                        message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-danger-50 border-danger-100 text-danger-700"
                      )}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-bold">{message.text}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Full Display Name"
                        icon={User}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <Input 
                        label="Primary Email Address"
                        type="email"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="pt-8 border-t border-muted-100 dark:border-muted-800 flex justify-end">
                      <Button type="submit" variant="primary" className="px-12" isLoading={loading} icon={Save}>
                        Sync Credentials
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="p-8 md:p-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600">
                        <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-muted-900 dark:text-white">Account Security</h3>
                        <p className="text-sm text-muted-500 font-medium">Manage your access and data protection.</p>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-muted-50 dark:bg-muted-900 rounded-[1.5rem] border border-muted-100 dark:border-muted-800 space-y-4">
                      <p className="text-sm text-muted-600 dark:text-muted-400 font-medium">
                        Password management is handled via secure magic links or email recovery to ensure your lifetime account stays protected.
                      </p>
                      <Button variant="secondary" size="sm">Request Password Reset</Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="p-8 md:p-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <Bell className="text-primary-600" size={24} />
                      <h3 className="text-xl font-black text-muted-900 dark:text-white">Alert Preferences</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { t: 'New Lead Captures', d: 'Get notified when the AI identifies a new potential lead.', active: true },
                        { t: 'Daily Task Digest', d: 'Receive a morning summary of pending sales tasks.', active: true },
                        { t: 'System Intelligence', d: 'Alerts about new features and LTD updates.', active: false }
                      ].map((item, i) => (
                        <div key={i} className="py-5 flex items-center justify-between border-b border-muted-100 dark:border-muted-800 last:border-0">
                          <div className="max-w-[80%]">
                            <p className="font-bold text-muted-900 dark:text-white text-sm tracking-tight">{item.t}</p>
                            <p className="text-xs text-muted-500 dark:text-muted-400 mt-1 font-medium">{item.d}</p>
                          </div>
                          <div className={clsx(
                            "w-11 h-6 rounded-full relative transition-colors cursor-pointer shadow-inner",
                            item.active ? "bg-primary-600" : "bg-muted-300 dark:bg-muted-700"
                          )}>
                            <div className={clsx(
                              "absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all",
                              item.active ? "right-1" : "left-1"
                            )}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
      }
