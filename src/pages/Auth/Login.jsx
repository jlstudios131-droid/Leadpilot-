import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input'; 
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error: signInError } = await signIn({ email, password });
      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-muted-900 dark:text-white tracking-tight"
        >
          Welcome Back
        </motion.h1>
        <p className="text-muted-500 dark:text-muted-400 mt-2 font-medium">
          Enter your credentials to access LeadPilot.
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <Input 
          type="email"
          label="Work Email"
          placeholder="name@company.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error && " "} // Visual highlight for error
          required
        />
        
        <div className="space-y-1">
          <Input 
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error} // Display the error message here
            required
          />
          <div className="flex justify-end px-1">
            <Link 
              to="/forgot-password" 
              className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 mt-4" 
          isLoading={loading}
          icon={ArrowRight}
        >
          Sign In to Dashboard
        </Button>
      </form>
      
      <div className="mt-8 text-center pt-6 border-t border-muted-100 dark:border-muted-800">
        <p className="text-sm text-muted-500 dark:text-muted-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Get Lifetime Access
          </Link>
        </p>
      </div>
    </div>
  );
}
