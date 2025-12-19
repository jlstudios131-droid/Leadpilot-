import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { useState } from 'react'; 

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-muted-50 overflow-hidden">
      
      {/* 1. Sidebar 
        No PC (lg:), ela agora aparecerá fixa à esquerda ocupando espaço.
        No Mobile, ela fica escondida e desliza sobre o conteúdo.
      */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* 2. Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header (Barra de topo com nome da página, busca e perfil) */}
        <Header 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        
        {/* Main Content 
          - overflow-y-auto: Permite scroll apenas nesta área.
          - max-w-7xl: Garante que o conteúdo não fique "esticado" demais em telas ultra-wide.
        */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted-50/50">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            <Outlet /> 
          </div>
        </main>
      </div>

      {/* 3. MobileNav 
        Menu de navegação inferior opcional para dispositivos móveis.
      */}
      {/* Se o teu MobileNav for uma barra inferior, ele aparecerá aqui apenas em telas pequenas */}
      <MobileNav 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
    </div>
  );
      }
