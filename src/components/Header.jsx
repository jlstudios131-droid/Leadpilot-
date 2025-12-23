import React from 'react';
import { Menu, Bell, User, ChevronDown, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

/**
 * Premium Header
 * Features: Dark Mode Toggle, Glassmorphism, and AI Status indicator.
 */
export default function Header({ setIsMobileMenuOpen }) {
  const { theme, setTheme } = useTheme();
  const profileName = "LeadPilot User"; // In the future, this comes from useAuth

  return (
    <header className="sticky top-0 z-40 w-full glass-morph h-16 px-4 sm:px-8 flex items-center justify-between transition-all">
      
      {/* Left: Mobile Trigger & Logo */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 text-muted-500 hover:bg-muted-100 dark:hover:bg-muted-800 rounded-xl transition-all"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-muted-900 dark:text-white hidden md:block">
            LeadPilot <span className="text-primary-500 text-[10px] uppercase align-top ml-1">AI</span>
          </h1>
        </div>
      </div>
      
      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-400 rounded-xl hover:bg-muted-100 dark:hover:bg-muted-800 transition-all active:scale-90"
          aria-label="Toggle Theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-[14px]" />
        </button>

        {/* Notifications with AI Ping */}
        <button 
          className="relative p-2.5 text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-400 rounded-xl hover:bg-muted-100 dark:hover:bg-muted-800 transition-all"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-ai-500 border-2 border-white dark:border-muted-900 rounded-full animate-pulse" />
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-muted-200 dark:bg-muted-800 mx-1 hidden sm:block" />

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-muted-100 dark:hover:bg-muted-800 transition-all group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-muted-900 dark:text-white">
              {profileName}
            </span>
            <span className="text-[10px] font-medium text-ai-500 uppercase tracking-widest">
              Lifetime Access
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-ai-600 p-[2px]">
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-muted-900 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-400 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
