import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Layouts corrigidos conforme a pasta real do projeto
import AppLayout from '@/layout/AppLayout';

// Páginas
import Dashboard from '@/pages/Dashboard';
import Leads from '@/pages/Leads';
import LeadDetails from '@/pages/LeadDetails';
import Tasks from '@/pages/Tasks';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

/**
 * Componente de Proteção de Rota
 * Se não houver utilizador, redireciona para /login
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- ROTAS PRIVADAS (Envolvidas pelo AppLayout corrigido) --- */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        {/* Redireciona a raiz para o dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* --- 404 NOT FOUND --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
            }
