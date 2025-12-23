import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Input Component
 * Features: AI-Integrated error handling, dark mode optimization, and sleek icons.
 */
const Input = React.forwardRef(({ 
  icon: Icon, 
  label, 
  error, 
  id, 
  className, 
  helperText,
  ...props 
}, ref) => {
  
  // High-end base classes using our Premium CSS variables
  const inputClasses = twMerge(
    "input-premium block w-full transition-all duration-200",
    Icon && "pl-11", // Add extra padding if there's an icon
    error 
      ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" 
      : "border-muted-200 dark:border-muted-700 focus:border-primary-500 focus:ring-primary-500/20",
    className
  );

  return (
    <div className="w-full space-y-1.5 group">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-bold uppercase tracking-wider text-muted-500 dark:text-muted-400 ml-1 transition-colors group-focus-within:text-primary-500"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 pointer-events-none transition-colors duration-200 text-muted-400 group-focus-within:text-primary-500">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          {...props}
        />
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[11px] font-semibold text-danger-600 dark:text-danger-400 ml-1 flex items-center gap-1"
          >
            <span className="w-1 h-1 rounded-full bg-danger-500" />
            {error}
          </motion.p>
        ) : helperText && (
          <p className="text-[11px] text-muted-400 ml-1 italic">{helperText}</p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = "Input";

export default Input;
