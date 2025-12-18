import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Loader2, 
  Calendar,
  Filter,
  ClipboardList
} from 'lucide-react';
import clsx from 'clsx';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Completed
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para o Modal de Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        leads (name)
      `) // Busca o nome do lead vinculado, se existir
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

    if (error) alert(error.message);
    else {
      setIsModalOpen(false);
      setNewTaskTitle('');
      fetchTasks();
    }
    setIsSubmitting(false);
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Eliminar esta tarefa?')) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-muted-900">Tarefas</h1>
          <p className="text-sm text-muted-500">Gere as tuas atividades e follow-ups.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nova Tarefa
        </button>
      </div>

      {/* Barra de Ferramentas: Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
          <input 
            type="text" 
            placeholder="Procurar tarefas..." 
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-muted-100 p-1 rounded-xl">
          {['All', 'Pending', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                filter === f ? "bg-white text-primary-600 shadow-sm" : "text-muted-500 hover:text-muted-700"
              )}
            >
              {f === 'All' ? 'Todas' : f === 'Pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarefas */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="divide-y divide-muted-100">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="group flex items-center justify-between p-4 hover:bg-muted-50/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className="shrink-0"
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-success-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-300 group-hover:text-primary-400" />
                    )}
                  </button>
                  
                  <div className="flex flex-col">
                    <span className={clsx(
                      "text-sm font-medium transition-all",
                      task.status === 'Completed' ? "line-through text-muted-400" : "text-muted-700"
                    )}>
                      {task.title}
                    </span>
                    
                    <div className="flex items-center gap-3 mt-1">
                      {task.leads && (
                        <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Lead: {task.leads.name}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-muted-300 hover:text-danger-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-muted-50 rounded-full mb-4">
              <ClipboardList className="w-8 h-8 text-muted-300" />
            </div>
            <p className="text-muted-500 font-medium">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </Card>

      {/* Modal de Nova Tarefa */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nova Tarefa Geral"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input 
            label="O que precisa de ser feito?" 
            placeholder="Ex: Rever propostas pendentes..." 
            required
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={isSubmitting || !newTaskTitle}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
                            }
