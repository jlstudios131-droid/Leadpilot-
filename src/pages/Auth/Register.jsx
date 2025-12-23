import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input'; 
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error: signUpError } = await signUp({ 
        email: formData.email, 
        password: formData.password,
        options: { data: { full_name: formData.name } }
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
      // Optional: Auto-redirect after 3 seconds
      setTimeout(() => navigate('/login'), 5000);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-success-100 dark:bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success-600" />
        </div>
        <h2 className="text-2xl font-black text-muted-900 dark:text-white mb-3">Check your inbox!</h2>
        <p className="text-muted-500 dark:text-muted-400 mb-8 leading-relaxed">
          We've sent a confirmation link to <span className="font-bold text-muted-900 dark:text-white">{formData.email}</span>. Please verify your account to activate your lifetime license.
        </p>
        <Button variant="secondary" onClick={() => navigate('/login')} className="w-full">
          Back to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight">
          Claim Your License
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2 text-ai-600 dark:text-ai-400 font-bold text-xs uppercase tracking-widest">
          <ShieldCheck size={14} />
          Lifetime Unlimited Access
        </div>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <Input 
          type="text"
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input 
          type="email"
          label="Email Address"
          placeholder="john@company.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          error={error}
          required
        />
        <Input 
          type="password"
          label="Create Password"
          placeholder="Min. 8 characters"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <div className="pt-2">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-12" 
            isLoading={loading}
          >
            Activate LeadPilot
          </Button>
        </div>
      </form>
      
      <div className="mt-8 text-center pt-6 border-t border-muted-100 dark:border-muted-800">
        <p className="text-sm text-muted-500 dark:text-muted-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
