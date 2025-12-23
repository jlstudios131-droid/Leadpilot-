import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Estilos globais do Tailwind

// Providers de Contexto
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 1. AppProvider gere Tema e Sidebar */}
      <AppProvider>
        {/* 2. AuthProvider gere a sessão do utilizador */}
        <AuthProvider>
          {/* 3. NotificationProvider permite Toasts em qualquer lugar */}
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
