import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input'; 

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Passamos o nome dentro de options.data para o Supabase salvar no metadado
    const { error } = await signUp({ 
      email, 
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } else {
      alert('Cadastro realizado! Verifique seu email para confirmar.');
      navigate('/login');
    }
    setLoading(false);
  };
  
  return (
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-muted-900 mb-2">Criar Conta</h1>
      <p className="text-muted-500 mb-6">Comece sua jornada no LeadPilot.</p>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <Input 
          type="text"
          label="Nome Completo"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {loading ? 'Cadastrando...' : 'Cadastrar e Começar'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-500">Já tem conta? </span>
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Acesse aqui
        </Link>
      </div>
    </Card>
  );
  }
