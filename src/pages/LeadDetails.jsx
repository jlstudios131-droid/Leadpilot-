import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { 
  ArrowLeft, Mail, Phone, Calendar, Save, 
  Loader2, MessageSquare, ListChecks, Plus, CheckCircle2, Circle 
} from 'lucide-react';

export default function LeadDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Estado para nova tarefa
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
      console.error(error);
      navigate('/leads');
    } else {
      setLead(data);
      setNotes(data.notes || '');
      // Ordenar tarefas: pendentes primeiro
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
    if (error) alert('Erro ao salvar notas');
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
      lead_id: id, // Vincula a tarefa a este lead específico
      status: 'Pending'
    }]);

    if (error) alert('Erro ao criar tarefa');
    else {
      setNewTaskTitle('');
      fetchLead(); // Recarrega para mostrar a nova tarefa
    }
    setIsAddingTask(false);
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    fetchLead();
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/leads" className="p-2 hover:bg-muted-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-muted-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-muted-900">{lead.name}</h1>
          <p className="text-sm text-muted-500">Gestão de Relacionamento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Lateral: Dados e Status */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-400 mb-4">Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-700">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-sm truncate">{lead.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-700">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-sm">{lead.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-700">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span className="text-sm">Desde {new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-muted-100">
              <label className="block text-xs font-bold uppercase text-muted-400 mb-2">Fase do Funil</label>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input text-sm"
              >
                <option value="New">Novo Lead</option>
                <option value="Proposal">Proposta</option>
                <option value="FollowUp">Follow-up</option>
                <option value="Converted">Convertido</option>
                <option value="Lost">Perdido</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Coluna Principal: Notas e Tarefas */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notas */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" /> Notas
              </h2>
              <button 
                onClick={handleUpdateNotes} 
                disabled={savingNotes}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </button>
            </div>
            <textarea 
              className="input min-h-[120px] bg-muted-50 border-none focus:ring-1 focus:ring-primary-500 p-4 text-sm"
              placeholder="Escreva aqui os detalhes da última interação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>

          {/* Tarefas */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary-500" /> Tarefas do Lead
            </h2>

            {/* Form para Nova Tarefa */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Nova tarefa para este lead..." 
                className="input text-sm"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isAddingTask || !newTaskTitle}
                className="btn-primary py-2 px-4"
              >
                {isAddingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>

            {/* Lista de Tarefas */}
            <div className="space-y-3">
              {lead.tasks?.length > 0 ? (
                lead.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-3 bg-white border border-muted-100 rounded-xl hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskStatus(task.id, task.status)}>
                        {task.status === 'Completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-success-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-300" />
                        )}
                      </button>
                      <span className={clsx("text-sm", task.status === 'Completed' ? "line-through text-muted-400" : "text-muted-700 font-medium")}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-400 text-sm">
                  Sem tarefas pendentes para este contacto.
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
         }
