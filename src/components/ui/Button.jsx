import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react'; // Essential for loading states

/**
 * Premium Button Component
 * Variants: Primary (Blue), AI (Purple), Secondary (Outline), Ghost
 */
const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon,
  disabled,
  ...props 
}, ref) => {
  
  // Base Premium Styles
  const baseStyles = "btn-premium inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 hover:shadow-primary-600/30",
    ai: "bg-ai-600 text-white shadow-lg shadow-ai-500/20 hover:bg-ai-700 hover:shadow-ai-600/40 border border-ai-400/20",
    secondary: "bg-white dark:bg-muted-800 text-muted-700 dark:text-muted-200 border border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-700",
    ghost: "bg-transparent text-muted-600 dark:text-muted-400 hover:bg-muted-100 dark:hover:bg-muted-800 hover:text-muted-900 dark:hover:text-muted-100",
    danger: "bg-danger-500 text-white hover:bg-danger-600 shadow-lg shadow-danger-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl",
    icon: "p-2.5 rounded-xl",
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
