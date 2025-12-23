import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Users, CheckSquare, Settings, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

/**
 * Premium Mobile Navigation
 * Full-screen overlay with spring animations and AI branding.
 */
export default function MobileNav({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-muted-950/60 backdrop-blur-md md:hidden"
          />

          {/* Sidebar Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-white dark:bg-muted-950 shadow-2xl md:hidden flex flex-col"
          >
            {/* Header with Close Button */}
            <div className="p-6 flex items-center justify-between border-b border-muted-100 dark:border-muted-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg dark:text-white">LeadPilot</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-muted-100 dark:bg-muted-800 text-muted-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                      : 'text-muted-500 hover:bg-muted-50 dark:hover:bg-muted-900'}
                  `}
                >
                  <item.icon size={22} />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Lifetime Access Footer Badge */}
            <div className="p-6 border-t border-muted-100 dark:border-muted-800">
              <div className="bg-ai-50 dark:bg-ai-500/10 p-4 rounded-2xl border border-ai-100 dark:border-ai-500/20">
                <p className="text-xs font-bold text-ai-600 dark:text-ai-400 uppercase tracking-widest mb-1">
                  License Status
                </p>
                <p className="text-sm font-semibold text-muted-900 dark:text-white">
                  Lifetime Unlimited Access
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
            }
