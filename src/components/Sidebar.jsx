import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ListChecks, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Tarefas', href: '/tasks', icon: ListChecks },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  
  const handleLogout = () => {
    console.log('Usuário deslogado (simulado)');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login'; 
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={clsx(
          'flex items-center p-3 rounded-lg transition-colors group',
          isActive
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-muted-700 hover:bg-muted-100'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* 1. Sidebar para Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-muted-200 p-4">
        <div className="flex items-center justify-between h-16 px-2 mb-6">
          <span className="text-3xl font-black text-primary-600 tracking-tighter">
            LeadPilot
          </span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-muted-200">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 w-full text-danger-600 rounded-lg hover:bg-danger-50 hover:text-danger-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
      
      {/* 2. Sidebar para Mobile (modal) */}
      <div 
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          
          <div className="flex items-center justify-between h-16 px-2 mb-6">
            <span className="text-3xl font-black text-primary-600 tracking-tighter">
              LeadPilot
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-muted-500 hover:text-muted-700 rounded-full hover:bg-muted-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <div className="pt-4 border-t border-muted-200">
            <button
              onClick={handleLogout}
              className="flex items-center p-3 w-full text-danger-600 rounded-lg hover:bg-danger-50 hover:text-danger-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
    }
