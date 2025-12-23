import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { 
  Plus, Search, CheckCircle2, Circle, Trash2, 
  Loader2, Calendar, ClipboardList, Zap, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*, leads (name)')
      .order('created_at', { ascending: false });

    if (!error) setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('tasks').insert([{
      title: newTaskTitle,
      user_id: user.id,
      status: 'Pending'
    }]);

    if (!error) {
      setIsModalOpen(false);
      setNewTaskTitle('');
      fetchTasks();
    }
    setIsSubmitting(false);
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight flex items-center gap-3">
            Action Center
            <span className="text-xs bg-primary-100 dark:bg-primary-500/10 text-primary-600 px-2.5 py-1 rounded-full font-bold">
              {tasks.filter(t => t.status === 'Pending').length} Pending
            </span>
          </h1>
          <p className="text-muted-500 dark:text-muted-400 font-medium mt-1">Execute your sales strategy and follow-ups.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus} variant="primary" className="w-full md:w-auto shadow-xl shadow-primary-500/20">
          Create Global Task
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input 
            icon={Search} 
            placeholder="Filter tasks by title or lead name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white dark:bg-muted-900 p-1.5 rounded-2xl border border-muted-100 dark:border-muted-800 shadow-sm">
          {['All', 'Pending', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                filter === f 
                  ? "bg-muted-900 dark:bg-primary-600 text-white shadow-lg" 
                  : "text-muted-400 hover:text-muted-900 dark:hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid/List */}
      <Card className="overflow-hidden border-none shadow-2xl shadow-black/5" animate={false}>
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="text-xs font-black text-muted-400 uppercase tracking-[0.2em]">Syncing Actions...</p>
          </div>
        ) : (
          <div className="divide-y divide-muted-50 dark:divide-muted-800">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group flex items-center justify-between p-5 hover:bg-muted-50/50 dark:hover:bg-muted-900/30 transition-all"
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <button 
                        onClick={() => toggleTaskStatus(task.id, task.status)}
                        className="shrink-0 transition-transform active:scale-75"
                      >
                        {task.status === 'Completed' ? (
                          <div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <Circle className="w-7 h-7 text-muted-200 dark:text-muted-700 group-hover:text-primary-500 transition-colors" />
                        )}
                      </button>
                      
                      <div className="flex flex-col gap-1.5">
                        <span className={clsx(
                          "text-sm font-bold transition-all",
                          task.status === 'Completed' ? "text-muted-400 line-through" : "text-muted-800 dark:text-muted-100"
                        )}>
                          {task.title}
                        </span>
                        
                        <div className="flex items-center gap-4">
                          {task.leads && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-md ring-1 ring-primary-100 dark:ring-primary-500/20">
                              <Target size={10} />
                              <span className="text-[10px] font-black uppercase tracking-tight">
                                {task.leads.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-muted-400">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2.5 text-muted-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-xl transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-muted-50 dark:bg-muted-900 rounded-[2rem] flex items-center justify-center mb-6 border border-muted-100 dark:border-muted-800 shadow-inner">
                    <ClipboardList className="w-8 h-8 text-muted-300 dark:text-muted-600" />
                  </div>
                  <h3 className="text-xl font-bold text-muted-900 dark:text-white">Clear Horizon</h3>
                  <p className="text-muted-500 dark:text-muted-400 text-sm mt-2 max-w-[240px]">No tasks found. Your pipeline is up to date or needs new goals.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Premium Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Global Action"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateTask} className="space-y-6">
          <div className="p-4 bg-ai-50 dark:bg-ai-500/5 rounded-2xl flex gap-3 border border-ai-100 dark:border-ai-500/10">
            <Zap size={20} className="text-ai-600 shrink-0" />
            <p className="text-xs text-ai-700 dark:text-ai-400 leading-relaxed font-medium">
              Global tasks are perfect for general follow-ups, contract reviews, or team synchronization that aren't linked to a specific lead.
            </p>
          </div>
          <Input 
            label="What is the objective?" 
            placeholder="Ex: Weekly sales report analysis..." 
            required
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="pt-4 flex gap-3 border-t border-muted-100 dark:border-muted-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting} disabled={!newTaskTitle}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
          }
