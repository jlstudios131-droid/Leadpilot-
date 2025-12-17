import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card'; 
import Input from '@/components/ui/Input'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn({ email, password });

    if (error) {
      alert('Erro ao entrar: ' + error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-muted-900 mb-2">Entrar</h1>
      <p className="text-muted-500 mb-6">Acesse sua conta LeadPilot.</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <Input 
          type="email"
          label="Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input 
          type="password"
          label="Senha"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Acessar'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-500">Não tem conta? </span>
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Crie a sua aqui
        </Link>
      </div>
    </Card>
  );
    }
