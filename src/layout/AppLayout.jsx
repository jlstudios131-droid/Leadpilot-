import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { useState } from 'react'; 

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-muted-50">
      
      {/* 1. Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* 2. Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <Header 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet /> 
        </main>
      </div>

      {/* 3. Overlay Mobile */}
      <MobileNav 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
    </div>
  );
}
