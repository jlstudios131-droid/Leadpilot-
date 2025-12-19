import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Leads', icon: Users, path: '/leads' },
    { label: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { label: 'Configurações', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Overlay para mobile - Z-index alto para cobrir tudo */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-muted-900/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-muted-200 transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:inset-auto lg:z-0", // No PC ela é estática e visível
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-muted-900 tracking-tight">LeadPilot</span>
            </div>
            <button 
              className="lg:hidden p-2 hover:bg-muted-100 rounded-lg transition-colors" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6 text-muted-500" />
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/30" 
                      : "text-muted-500 hover:bg-muted-50 hover:text-muted-900"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-muted-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Perfil e Logout */}
          <div className="p-4 border-t border-muted-100 bg-muted-50/50">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-white rounded-xl border border-muted-200 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   user?.user_metadata?.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-muted-900 truncate">
                  {user?.user_metadata?.full_name || 'Utilizador'}
                </p>
                <p className="text-[11px] text-muted-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-danger-600 hover:bg-danger-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
          }
