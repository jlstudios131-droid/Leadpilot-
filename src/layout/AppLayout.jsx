import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Fab from '@/components/Fab';

/**
 * LeadPilot Core Layout
 * High-performance shell with route-based transitions.
 */
export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-muted-50 dark:bg-muted-950 overflow-hidden transition-colors duration-300">
      
      {/* 1. Desktop & Mobile Sidebar Logic */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* 2. Main Interaction Zone */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Intelligence Header */}
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted-50/50 dark:bg-muted-950/50 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-10">
            
            {/* Page Transition Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* 3. Global Action Trigger (Mobile Only) */}
      <Fab onClick={() => console.log('Quick Lead Entry')} />

      {/* 4. Mobile Navigation State Layer */}
      <MobileNav 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
    </div>
  );
}
