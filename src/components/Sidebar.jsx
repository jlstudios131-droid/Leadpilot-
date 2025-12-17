// ... (mantenha os outros imports)
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { signOut } = useAuth();
  // ... (mantenha o resto do código)

  const handleLogout = async () => {
    await signOut();
    // O onAuthStateChange no context detectará a saída e redirecionará automaticamente
  };

  // ... (mantenha o retorno JSX igual ao anterior)
}
