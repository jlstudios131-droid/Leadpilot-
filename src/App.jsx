import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Layouts
import AppLayout from '@/layout/AppLayout.jsx';

// Páginas - Caminhos corrigidos para a subpasta Auth
import Dashboard from '@/pages/Dashboard.jsx';
import Leads from '@/pages/Leads.jsx';
import LeadDetails from '@/pages/LeadDetails.jsx';
import Tasks from '@/pages/Tasks.jsx';
import Settings from '@/pages/Settings.jsx';
import Login from '@/pages/Auth/Login.jsx';      // Caminho atualizado
import Register from '@/pages/Auth/Register.jsx'; // Caminho atualizado
import NotFound from '@/pages/NotFound.jsx';

/**
 * Componente de Proteção de Rota
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

      {/* --- ROTAS PRIVADAS --- */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
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
