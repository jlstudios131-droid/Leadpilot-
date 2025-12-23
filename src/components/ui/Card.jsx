import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

/**
 * Premium Card Component
 * @param {boolean} isAiHighlight - If true, applies a purple glow effect (AI Priority)
 * @param {boolean} glass - If true, applies a frosted glass effect
 * @param {boolean} hoverable - If true, adds a lift effect on hover
 */
const Card = React.forwardRef(({ 
  children, 
  className, 
  isAiHighlight = false, 
  glass = false,
  hoverable = true,
  animate = true,
  ...props 
}, ref) => {
  
  const baseStyles = "relative overflow-hidden transition-all duration-300";
  
  const variants = {
    standard: "bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700/50 rounded-2xl shadow-sm",
    glass: "bg-white/70 dark:bg-muted-900/60 backdrop-blur-xl border border-white/20 dark:border-muted-800 rounded-2xl",
    ai: "border-ai-500/50 shadow-glow bg-gradient-to-br from-white to-ai-50/30 dark:from-muted-800 dark:to-ai-900/10"
  };

  const combinedClassName = twMerge(
    baseStyles,
    glass ? variants.glass : variants.standard,
    isAiHighlight && variants.ai,
    hoverable && "hover:shadow-md hover:-translate-y-1",
    className
  );

  // If animate is true, we wrap it in a motion div for smooth entry
  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      ref={ref}
      className={combinedClassName}
      {...animationProps}
      {...props}
    >
      {/* Subtle top light effect for AI cards */}
      {isAiHighlight && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ai-400 to-transparent opacity-60" />
      )}
      
      <div className="p-5">
        {children}
      </div>
    </Component>
  );
});

Card.displayName = "Card";

export default Card;
