import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';

// Páginas de Autenticação
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Páginas Principais
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Hook de autenticação simulado
const useAuth = () => {
  return localStorage.getItem('isLoggedIn') === 'true'; 
};

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function RoutesConfig() {
  return (
    <Routes>
      
      {/* Rotas Públicas (Auth Layout) */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Rotas Privadas (App Layout) */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Rota 404 (Qualquer outra URL) */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}
