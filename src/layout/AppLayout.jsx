import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';
import Fab from '../components/Fab';
import { motion } from 'framer-motion';

/**
 * LeadPilot AppLayout
 * The main container for the private dashboard.
 */
export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to handle the FAB action (usually opens a Quick Lead modal)
  const handleQuickAction = () => {
    // This will be connected to a global modal state later
    console.log("Quick Action Triggered");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted-50 dark:bg-muted-950">
      
      {/* 1. Sidebar (Desktop) / Mobile Drawer is inside Sidebar component */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        
        {/* Top Navigation */}
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Scrollable Dashboard Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* motion.div handles the page transition animations. 
              The 'Outlet' renders the actual pages (Dashboard, Leads, etc.)
            */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* 3. Mobile Navigation Menu (Overlay) */}
      <MobileNav 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* 4. Floating Action Button (Mobile Only) */}
      <Fab onClick={handleQuickAction} label="Add New Lead" />
    </div>
  );
}
