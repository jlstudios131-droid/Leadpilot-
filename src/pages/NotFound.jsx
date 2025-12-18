import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-6">
          <AlertCircle className="w-12 h-12 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-muted-900 mb-2">404</h1>
        <p className="text-muted-600 mb-8 font-medium">Ops! Esta página não foi encontrada.</p>
        <Link 
          to="/dashboard" 
          className="btn-primary inline-flex items-center gap-2 px-8"
        >
          <Home className="w-5 h-5" />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
