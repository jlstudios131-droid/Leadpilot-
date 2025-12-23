import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLeads } from '@/hooks/useLeads';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PublicCapture() {
  const { userId } = useParams(); // Pega o ID do dono do SaaS pela URL
  const { createLead, loading } = useLeads();
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: 'Inquiry from Public Capture Page'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enviamos o lead com isSilent=true para não disparar notificações de Dashboard
    // e definimos a source como 'Public Form'
    const success = await createLead({
      ...formData,
      user_id: userId,
      source: 'Public Form',
      status: 'New'
    }, true);

    if (success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted-50 dark:bg-muted-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-muted-900 dark:text-white uppercase tracking-tighter italic">Information Received</h1>
          <p className="text-muted-500 dark:text-muted-400 font-medium">
            Our team has been notified and will analyze your profile shortly using our AI engine.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-muted-950 flex flex-col lg:flex-row">
      
      {/* Lado Esquerdo - Branding/Impacto */}
      <div className="lg:w-1/2 bg-primary-600 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/90 font-black text-xl italic mb-12">
            <Sparkles className="text-ai-400" />
            LEADPILOT AI
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-none uppercase italic tracking-tighter">
            Unlock your <br />
            <span className="text-ai-400">Next Growth</span> <br />
            Chapter.
          </h2>
          <p className="mt-6 text-primary-100 max-w-sm font-medium leading-relaxed">
            Fill out the form to initiate a strategic evaluation of your business needs. 
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-primary-200 text-sm font-bold">
            <ShieldCheck size={18} className="text-ai-400" />
            Secure & AI-Powered Data Processing
        </div>

        {/* Decorativo */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="lg:w-1/2 p-8 lg:p-20 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h3 className="text-2xl font-black text-muted-900 dark:text-white uppercase tracking-tight italic">Contact Details</h3>
            <p className="text-sm text-muted-500 font-medium mt-1">Ready to scale? Enter your info below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-400 w-4 h-4" />
                <input 
                  required
                  className="w-full h-14 bg-muted-50 dark:bg-muted-900 border border-muted-100 dark:border-muted-800 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-400 w-4 h-4" />
                <input 
                  required
                  type="email"
                  className="w-full h-14 bg-muted-50 dark:bg-muted-900 border border-muted-100 dark:border-muted-800 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-400 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-400 w-4 h-4" />
                <input 
                  required
                  type="tel"
                  className="w-full h-14 bg-muted-50 dark:bg-muted-900 border border-muted-100 dark:border-muted-800 rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="+351 900 000 000"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest italic"
              isLoading={loading}
              icon={Send}
            >
              Request Strategy Access
            </Button>
          </form>

          <p className="text-[10px] text-center text-muted-400 font-medium">
            By submitting, you agree to our terms of service and privacy policy. 
            Automated intelligence is applied to all incoming requests.
          </p>
        </div>
      </div>
    </div>
  );
      }
