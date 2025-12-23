import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';

// Layouts
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';

// Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadDetails = lazy(() => import('./pages/LeadDetails'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// NEW: Public Capture Page (Landing Page de Alta Conversão)
const PublicCapture = lazy(() => import('./pages/Public/Capture'));

const LoadingScreen = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-muted-50 dark:bg-muted-950">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="h-12 w-12 border-4 border-ai-500/20 border-t-ai-600 rounded-full"
    />
    <p className="mt-4 text-xs font-black text-muted-400 uppercase tracking-widest animate-pulse">
      Neural Syncing...
    </p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function RoutesConfig() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* ROTA PÚBLICA DE CAPTURA - SEM LOGIN */}
        {/* O :userId permite que cada cliente seu tenha o seu próprio link de anúncios */}
        <Route path="/c/:userId" element={<PublicCapture />} />

        {/* AUTH ROUTES */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* APP ROUTES (PRIVADAS) */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
