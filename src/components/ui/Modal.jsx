import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Premium Modal Component
 * Features: Background blur, Framer Motion animations, Dark mode optimization.
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md', className }) => {
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-muted-950/40 dark:bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            className={twMerge(
              "relative bg-white dark:bg-muted-900 w-full rounded-3xl shadow-2xl shadow-black/20 border border-muted-200 dark:border-muted-800 overflow-hidden",
              maxWidth,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted-100 dark:border-muted-800">
              <div>
                <h3 className="text-lg font-bold text-muted-900 dark:text-white tracking-tight">
                  {title}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl text-muted-400 hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800 transition-all active:scale-90"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
