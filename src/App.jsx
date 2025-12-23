import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoutesConfig from './RoutesConfig';

/**
 * LeadPilot Premium - Application Root
 * This component orchestrates authentication, animations, and global layout states.
 */
function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      {/* AnimatePresence allows components to animate out when they 
        are removed from the React tree (essential for premium transitions) 
      */}
      <AnimatePresence mode="wait">
        <main className="min-h-screen selection:bg-ai-500/30 selection:text-ai-900 dark:selection:text-ai-100">
          <RoutesConfig key={location.pathname} />
        </main>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
