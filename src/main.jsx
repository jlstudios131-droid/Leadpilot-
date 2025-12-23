import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

/**
 * LeadPilot Premium Entry Point
 * * Features:
 * - ThemeProvider: Handles instant Dark/Light switching with no flicker.
 * - Toaster: Rich, animated notifications for AI events and lead captures.
 * - StrictMode: Ensures high-performance rendering.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* next-themes provides the 'class' strategy for Tailwind Dark Mode */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
        {/* Premium notification system with rich colors for Success, Error, and AI insights */}
        <Toaster 
          position="top-right" 
          richColors 
          expand={false}
          closeButton
          theme="system"
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
