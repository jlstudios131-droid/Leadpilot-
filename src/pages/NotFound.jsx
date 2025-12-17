import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="
      min-h-[60vh] 
      flex flex-col items-center justify-center 
      text-center 
      bg-muted-50
    ">
      <Frown className="w-16 h-16 text-primary-500 mb-4" />
      <h1 className="text-4xl font-bold text-muted-900 mb-2">404 - Página Não Encontrada</h1>
      <p className="text-xl text-muted-600 mb-6">
        Ops! Parece que você pegou um atalho errado.
      </p>
      
      <Link to="/dashboard" className="btn-primary w-auto px-6">
        Voltar para o Dashboard
      </Link>
    </div>
  );
}
