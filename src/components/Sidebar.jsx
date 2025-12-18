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
      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-muted-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-muted-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-muted-900 tracking-tight">LeadPilot</span>
            </div>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6 text-muted-400" />
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-muted-500 hover:bg-muted-50 hover:text-muted-900"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5", isActive ? "text-primary-600" : "text-muted-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Perfil e Logout */}
          <div className="p-4 border-t border-muted-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                {user?.user_metadata?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-muted-900 truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-muted-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-xl transition-all"
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
