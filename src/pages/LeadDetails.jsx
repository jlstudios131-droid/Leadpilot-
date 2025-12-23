import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { aiService } from '@/services/aiService'; // Importação da IA Real
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ArrowLeft, Mail, Phone, Calendar, Save, 
  Loader2, MessageSquare, ListChecks, Plus, 
  CheckCircle2, Circle, Sparkles, User, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function LeadDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Estados para a IA Real
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const fetchLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*, tasks(*)')
      .eq('id', id)
      .single();

    if (error) {
      navigate('/leads');
    } else {
      setLead(data);
      setNotes(data.notes || '');
      // Se já houver recomendação salva no banco, você pode carregar aqui. 
      // Por agora, vamos gerar sob demanda para economizar tokens.
    }
    setLoading(false);
  };

  useEffect(() => { fetchLead(); }, [id]);

  // Função para chamar a IA Real do Google Gemini
  const generateAiStrategy = async () => {
    setIsGeneratingAi(true);
    try {
      const advice = await aiService.getSmartRecommendation({
        ...lead,
        notes: notes // Envia as notas atuais, mesmo as que não foram salvas ainda
      });
      setAiRecommendation(advice);
    } catch (error) {
      setAiRecommendation("Unable to connect to AI brain. Check your connection.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleUpdateNotes = async () => {
    setSavingNotes(true);
    const { error } = await supabase.from('leads').update({ notes }).eq('id', id);
    if (error) console.error('Error saving notes');
    setSavingNotes(false);
  };

  const handleStatusChange = async (newStatus) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) setLead({ ...lead, status: newStatus });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsAddingTask(true);
    const { error } = await supabase.from('tasks').insert([{
      title: newTaskTitle,
      user_id: user.id,
      lead_id: id,
      status: 'Pending'
    }]);
    if (!error) {
      setNewTaskTitle('');
      fetchLead();
    }
    setIsAddingTask(false);
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    fetchLead();
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/leads" className="p-2.5 bg-white dark:bg-muted-900 border border-muted-200 dark:border-muted-800 rounded-xl hover:text-primary-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight">{lead.name}</h1>
              <div className="w-2 h-2 bg-ai-500 rounded-full animate-pulse" />
            </div>
            <p className="text-xs font-black text-muted-400 uppercase tracking-[0.3em]">Neural Dossier v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-white dark:bg-muted-900 border border-muted-200 dark:border-muted-800 rounded-xl px-4 py-2 text-sm font-bold text-primary-600 focus:ring-2 focus:ring-primary-500 transition-all outline-none shadow-sm"
            >
                <option value="New">New Lead</option>
                <option value="Proposal">Proposal</option>
                <option value="FollowUp">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & AI */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-xl shadow-black/5">
            <div className="flex items-center gap-2 mb-6 text-primary-600 font-black text-[10px] uppercase tracking-widest">
                <User size={14} /> Contact Profile
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-400 uppercase">Direct Email</span>
                <span className="text-sm font-medium text-muted-700 dark:text-muted-200 break-all">{lead.email || '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-400 uppercase">Phone</span>
                <span className="text-sm font-medium text-muted-700 dark:text-muted-200">{lead.phone || '—'}</span>
              </div>
            </div>
          </Card>

          {/* AI REAL-TIME CARD */}
          <Card className="p-6 border-none bg-gradient-to-br from-ai-600 to-ai-800 text-white relative overflow-hidden group shadow-ai-500/20 shadow-2xl">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest opacity-80">
                        <BrainCircuit size={16} /> Gemini Intelligence
                    </div>
                    {isGeneratingAi && <Loader2 size={14} className="animate-spin" />}
                </div>
                
                <div className="min-h-[80px]">
                    {aiRecommendation ? (
                        <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium leading-relaxed italic"
                        >
                            "{aiRecommendation}"
                        </motion.p>
                    ) : (
                        <p className="text-xs opacity-70 italic">
                            Click below to analyze lead notes and generate a custom closing strategy.
                        </p>
                    )}
                </div>

                <button 
                    onClick={generateAiStrategy}
                    disabled={isGeneratingAi}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                    {isGeneratingAi ? 'Analyzing Data...' : 'Generate Strategy'}
                    <Sparkles size={12} />
                </button>
             </div>
             
             {/* Background Decoration */}
             <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform">
                <Sparkles size={120} />
             </div>
          </Card>
        </div>

        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="p-8 border-none shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary-600">
                    <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Interaction Timeline</h2>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleUpdateNotes} 
                isLoading={savingNotes}
                icon={Save}
              >
                Save Timeline
              </Button>
            </div>
            <textarea 
              className="w-full min-h-[180px] bg-muted-50/50 dark:bg-muted-900/50 border border-muted-100 dark:border-muted-800 rounded-2xl p-6 text-sm text-muted-700 dark:text-muted-200 focus:ring-2 focus:ring-ai-500 transition-all outline-none placeholder:text-muted-400 font-medium"
              placeholder="Ex: Customer is worried about the integration cost. Loves the AI feature..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>

          <Card className="p-8 border-none shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600">
                    <ListChecks size={20} />
                </div>
                <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Next Best Actions</h2>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
              <input 
                  className="flex-1 h-12 bg-muted-50 dark:bg-muted-900 border border-muted-100 dark:border-muted-800 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="What's the next step?" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={!newTaskTitle} isLoading={isAddingTask}>
                Add Task
              </Button>
            </form>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {lead.tasks?.map(task => (
                  <motion.div 
                      key={task.id} layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-4 bg-white dark:bg-muted-900 border border-muted-100 dark:border-muted-800 rounded-2xl"
                  >
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleTaskStatus(task.id, task.status)}>
                            {task.status === 'Completed' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : (
                            <Circle className="w-6 h-6 text-muted-300" />
                            )}
                        </button>
                        <span className={clsx("text-sm font-bold", task.status === 'Completed' ? "line-through text-muted-400" : "text-muted-700 dark:text-muted-200")}>
                            {task.title}
                        </span>
                      </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
