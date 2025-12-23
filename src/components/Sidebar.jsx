import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  LogOut, 
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Leads', icon: Users, path: '/leads' },
    { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-muted-950/60 z-[60] lg:hidden backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-muted-950 border-r border-muted-200 dark:border-muted-800 transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:inset-auto lg:z-0",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          
          {/* Brand Header */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-ai-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-muted-900 dark:text-white tracking-tighter">
                LeadPilot<span className="text-primary-600">.</span>
              </span>
            </div>
            <button 
              className="lg:hidden p-2 hover:bg-muted-100 dark:hover:bg-muted-800 rounded-xl transition-colors" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6 text-muted-500" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 mt-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                    isActive 
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 active:scale-95" 
                      : "text-muted-500 dark:text-muted-400 hover:bg-muted-50 dark:hover:bg-muted-900 hover:text-primary-600"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-white" : "text-muted-400 group-hover:text-primary-500")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* AI Status Card (Premium LTD Highlight) */}
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-br from-muted-900 to-muted-800 dark:from-muted-900 dark:to-black p-4 rounded-2xl border border-muted-700/50 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-ai-400 fill-ai-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AI Engine Active</span>
              </div>
              <p className="text-[11px] text-muted-400 leading-relaxed">
                Your **Lifetime License** includes unlimited lead processing.
              </p>
            </div>
          </div>

          {/* User Profile & Footer */}
          <div className="p-4 border-t border-muted-100 dark:border-muted-800">
            <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-muted-50 dark:bg-muted-900/50 rounded-2xl border border-muted-200 dark:border-muted-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold overflow-hidden ring-2 ring-white dark:ring-muted-800">
                {user?.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   user?.user_metadata?.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-muted-900 dark:text-white truncate">
                  {user?.user_metadata?.full_name || 'Premium User'}
                </p>
                <p className="text-[10px] text-ai-500 font-black uppercase tracking-widest">Lifetime Access</p>
              </div>
            </div>
            
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
                    }
