import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * LeadPilot AuthLayout
 * Optimized for high conversion and premium brand feel.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted-50 dark:bg-muted-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* 1. Background Visual Elements (AI Aesthetic) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ai-500/10 dark:bg-ai-500/5 rounded-full blur-[120px]" />
      </div>

      {/* 2. Logo / Brand Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mb-10 text-center z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black text-muted-900 dark:text-white tracking-tighter">
            LeadPilot<span className="text-primary-600">.</span>
          </span>
        </Link>
        <p className="mt-3 text-sm font-medium text-muted-500 dark:text-muted-400">
          Smart CRM for High-Performance Teams
        </p>
      </motion.header>
      
      {/* 3. Auth Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white dark:bg-muted-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/20 border border-muted-200 dark:border-muted-800">
          <Outlet />
        </div>
      </motion.div>

      {/* 4. Minimal Footer */}
      <footer className="mt-12 text-[11px] font-bold text-muted-400 dark:text-muted-600 uppercase tracking-[0.2em] z-10">
        &copy; {new Date().getFullYear()} LeadPilot LTD • Secure AI Access
      </footer>
    </div>
  );
}
