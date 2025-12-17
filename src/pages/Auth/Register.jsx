import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input'; 

export default function Register() {
  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Tentativa de Registro...');
    // Simulando registro e login
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/dashboard';
  };
  
  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      
      <h1 className="text-3xl font-bold text-muted-900 mb-2">Criar Conta</h1>
      <p className="text-muted-500 mb-6">Comece seu teste grátis no LeadPilot.</p>
      
      <form onSubmit={handleRegister} className="space-y-4">
        
        <Input 
          type="text"
          placeholder="Seu nome"
          icon={User}
          id="name"
          label="Nome"
          required
        />

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
          placeholder="Mínimo 6 caracteres"
          icon={Lock}
          id="password"
          label="Senha"
          required
        />
        
        <button type="submit" className="btn-primary mt-6">
          Cadastrar e Começar
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-500">Já tem conta? </span>
        <Link 
          to="/login" 
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Acesse aqui
        </Link>
      </div>
      
    </Card>
  );
}
