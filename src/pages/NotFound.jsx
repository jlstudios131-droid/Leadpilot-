import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted-50 dark:bg-muted-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center z-10">
        {/* Animated Icon Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="inline-flex p-6 bg-white dark:bg-muted-900 rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/20 mb-8 border border-muted-100 dark:border-muted-800 relative"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Compass className="w-16 h-16 text-primary-600 dark:text-primary-500" />
          </motion.div>
          
          {/* Badge 404 */}
          <span className="absolute -top-2 -right-2 bg-ai-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
            Error 404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-black text-muted-900 dark:text-white tracking-tighter mb-3">
            Lost in Space?
          </h1>
          <p className="text-muted-500 dark:text-muted-400 mb-10 max-w-xs mx-auto font-medium leading-relaxed">
            The page you are looking for has been moved or doesn't exist in our current database.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" icon={Home} className="w-full sm:px-8">
              Back to Dashboard
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-bold text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-400 transition-colors px-6 py-3"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[10px] font-black text-muted-300 dark:text-muted-700 uppercase tracking-[0.3em]">
          LeadPilot Intelligence
        </p>
      </div>
    </div>
  );
}
