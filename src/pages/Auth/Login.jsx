import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Card from '@/components/ui/Card'; 
import Input from '@/components/ui/Input'; 

export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Tentativa de Login...');
    // Simulando login
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/dashboard';
  };

  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      
      <h1 className="text-3xl font-bold text-muted-900 mb-2">Entrar</h1>
      <p className="text-muted-500 mb-6">Acesse sua conta LeadPilot.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        
        <Input 
          type="email"
          placeholder="seu@email.com"
          icon={Mail}
          id="email"
          label="Email"
          required
        />
        
        <Input 
          type="password"
          placeholder="********"
          icon={Lock}
          id="password"
          label="Senha"
          required
        />
        
        <button type="submit" className="btn-primary mt-6">
          Acessar
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-500">Não tem conta? </span>
        <Link 
          to="/register" 
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Crie a sua aqui
        </Link>
      </div>
      
    </Card>
  );
          }
