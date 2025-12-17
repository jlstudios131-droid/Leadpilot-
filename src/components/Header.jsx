import { Menu, Bell, User, ChevronDown } from 'lucide-react';

export default function Header({ setIsMobileMenuOpen }) {
  const profileName = "Usuário Mock";
  
  const handleProfileClick = () => {
    console.log('Menu de perfil clicado');
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-muted-200">
      
      <button 
        className="md:hidden text-muted-500 hover:text-muted-700"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Abrir menu principal"
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-xl font-semibold text-muted-900 hidden md:block">
        LeadPilot
      </h1>
      
      <div className="flex items-center space-x-4">
        
        <button 
          className="p-2 text-muted-500 hover:text-primary-600 rounded-full hover:bg-muted-100 transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-6 h-6" />
        </button>

        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted-100 transition-colors"
          >
            <User className="w-6 h-6 text-primary-600 border-2 border-primary-600 rounded-full p-0.5" />
            <span className="hidden sm:inline text-sm font-medium text-muted-700">
              {profileName}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-400 hidden sm:inline" />
          </button>
          
          {/* Futuro: Dropdown Menu */}
        </div>
      </div>
    </header>
  );
}
