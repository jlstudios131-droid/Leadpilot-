import React from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium FAB - Floating Action Button
 * Optimized for mobile-first productivity and AI-themed actions.
 */
export default function Fab({ onClick, icon: Icon = Plus, label = "New Action" }) {
  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="
          fixed bottom-8 right-6 
          z-50
          flex items-center justify-center
          w-14 h-14 
          bg-primary-600 dark:bg-primary-500
          text-white 
          rounded-full 
          shadow-[0_8px_30px_rgb(14,165,233,0.4)] 
          dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
          border-2 border-white/20
          md:hidden 
          transition-colors
          hover:bg-primary-700
        "
        aria-label={label}
      >
        {/* Animated Background Ring (Pulse Effect) */}
        <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20" />
        
        <Icon className="w-6 h-6 relative z-10" strokeWidth={2.5} />
      </motion.button>
    </AnimatePresence>
  );
}
