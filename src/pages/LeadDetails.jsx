import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ArrowLeft, Mail, Phone, Calendar, Save, 
  Loader2, MessageSquare, ListChecks, Plus, 
  CheckCircle2, Circle, Sparkles, User
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
      if (data.tasks) {
        data.tasks.sort((a, b) => (a.status === 'Completed' ? 1 : -1));
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchLead(); }, [id]);

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
          <Link 
            to="/leads" 
            className="p-2.5 bg-white dark:bg-muted-900 border border-muted-200 dark:border-muted-800 rounded-xl hover:text-primary-600 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight">{lead.name}</h1>
              <div className="w-2 h-2 bg-ai-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm font-bold text-muted-500 uppercase tracking-widest">Lead Intelligence Dossier</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-muted-400 uppercase tracking-widest">Pipeline Phase:</span>
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
        
        {/* Left Column: Contact Data */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 text-primary-600 dark:text-primary-400">
                <User size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Contact Profile</h2>
            </div>
            <div className="space-y-5">
              <div className="flex flex-col gap-1 group">
                <span className="text-[10px] font-bold text-muted-400 uppercase">Email Address</span>
                <div className="flex items-center gap-3 text-muted-700 dark:text-muted-200">
                    <Mail className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium truncate">{lead.email || '—'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-400 uppercase">Phone Number</span>
                <div className="flex items-center gap-3 text-muted-700 dark:text-muted-200">
                    <Phone className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium">{lead.phone || '—'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-4 border-t border-muted-100 dark:border-muted-800">
                <span className="text-[10px] font-bold text-muted-400 uppercase">Member Since</span>
                <div className="flex items-center gap-3 text-muted-700 dark:text-muted-200">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium">{new Date(lead.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card isAiHighlight className="p-6 overflow-hidden relative">
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-ai-600 mb-4 font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={14} /> AI Recommendation
                </div>
                <p className="text-sm text-muted-600 dark:text-muted-400 leading-relaxed italic">
                    "Based on this lead's profile, a personalized video demo via email has a 45% higher conversion rate than a standard follow-up."
                </p>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10">
                <Sparkles size={100} />
             </div>
          </Card>
        </div>

        {/* Main Column: Interaction & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Notes Section */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg text-primary-600">
                    <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-bold dark:text-white">Timeline Notes</h2>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleUpdateNotes} 
                isLoading={savingNotes}
                icon={Save}
              >
                Sync Notes
              </Button>
            </div>
            <textarea 
              className="w-full min-h-[160px] bg-muted-50/50 dark:bg-muted-900/50 border-none rounded-2xl p-6 text-sm text-muted-700 dark:text-muted-200 focus:ring-2 focus:ring-primary-500 transition-all outline-none placeholder:text-muted-400"
              placeholder="Start logging details about the last conversation, objections or specific interests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>

          {/* Task Board */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-success-50 dark:bg-success-500/10 rounded-lg text-success-600">
                    <ListChecks size={20} />
                </div>
                <h2 className="text-xl font-bold dark:text-white">Action Items</h2>
            </div>

            {/* Quick Task Entry */}
            <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
              <div className="flex-1">
                <Input 
                    placeholder="Describe the next step for this lead..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                variant="primary"
                disabled={!newTaskTitle}
                isLoading={isAddingTask}
                icon={Plus}
              >
                Add
              </Button>
            </form>

            {/* Task List with AnimatePresence */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {lead.tasks?.length > 0 ? (
                    lead.tasks.map(task => (
                    <motion.div 
                        key={task.id} 
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="group flex items-center justify-between p-4 bg-muted-50/50 dark:bg-muted-900/30 border border-muted-100 dark:border-muted-800 rounded-2xl hover:border-primary-500 transition-all"
                    >
                        <div className="flex items-center gap-4">
                        <button 
                            onClick={() => toggleTaskStatus(task.id, task.status)}
                            className="transition-transform active:scale-90"
                        >
                            {task.status === 'Completed' ? (
                            <CheckCircle2 className="w-6 h-6 text-success-500" />
                            ) : (
                            <Circle className="w-6 h-6 text-muted-300 dark:text-muted-600 group-hover:text-primary-400" />
                            )}
                        </button>
                        <span className={clsx(
                            "text-sm font-medium transition-all",
                            task.status === 'Completed' ? "line-through text-muted-400" : "text-muted-700 dark:text-muted-200"
                        )}>
                            {task.title}
                        </span>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="text-center py-10 border-2 border-dashed border-muted-100 dark:border-muted-800 rounded-3xl">
                        <p className="text-muted-400 text-sm font-medium italic">No pending actions for this contact.</p>
                    </div>
                )}
              </AnimatePresence>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
                                                    }
