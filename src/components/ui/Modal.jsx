import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Fundo escurecido) */}
      <div 
        className="absolute inset-0 bg-muted-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Conteúdo do Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted-100">
          <h3 className="text-lg font-semibold text-muted-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-muted-400 hover:text-muted-600 hover:bg-muted-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
      }
