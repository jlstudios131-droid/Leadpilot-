import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { CheckCircle, Circle, Clock, Plus, Loader2 } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) console.error(error);
    else setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) alert('Erro ao atualizar');
    else fetchTasks();
  };

  const addTask = async () => {
    const title = prompt('O que precisa ser feito?');
    if (!title) return;
    
    const { error } = await supabase
      .from('tasks')
      .insert([{ title, user_id: user.id, status: 'Pending' }]);

    if (error) alert('Erro ao criar tarefa');
    else fetchTasks();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-muted-900">Minhas Tarefas</h1>
        <button onClick={addTask} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" /> Nova Tarefa
        </button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id, task.status)}>
                    {task.status === 'Completed' ? (
                      <CheckCircle className="w-6 h-6 text-success-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-300" />
                    )}
                  </button>
                  <span className={task.status === 'Completed' ? 'line-through text-muted-400' : 'text-muted-900'}>
                    {task.title}
                  </span>
                </div>
                {task.due_date && (
                  <div className="text-xs text-muted-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {task.due_date}
                  </div>
                )}
              </div>
            ))}
            {tasks.length === 0 && <p className="text-center text-muted-500">Nenhuma tarefa para hoje.</p>}
          </div>
        )}
      </Card>
    </div>
  );
    }
