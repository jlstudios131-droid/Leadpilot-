import { mockTasks } from '@/data/mock';
import Card from '@/components/ui/Card';
import { CheckCircle, Clock, XCircle, Search, Calendar } from 'lucide-react';
import clsx from 'clsx';

const getDueDateStyle = (dueDate, status) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  taskDate.setHours(0, 0, 0, 0);

  if (status === 'Completed') {
    return 'text-success-600';
  }
  
  if (taskDate < today) {
    return 'text-danger-600 font-semibold'; // Atrasada
  }
  if (taskDate.getTime() === today.getTime()) {
    return 'text-warning-700 font-semibold'; // Hoje
  }
  
  return 'text-muted-500'; // Futuro
};

export default function Tasks() {
  const pendingTasks = mockTasks.filter(t => t.status === 'Pending');
  const completedTasks = mockTasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-muted-900 md:text-3xl">Minhas Tarefas</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-400" />
          <input 
            type="text"
            placeholder="Buscar por título ou lead..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* 1. Tarefas Pendentes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-muted-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-warning-500" />
          Tarefas Pendentes ({pendingTasks.length})
        </h2>
        
        <div className="space-y-4">
          {pendingTasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-muted-50 transition-colors rounded-md">
              
              <div className="flex items-start flex-grow min-w-0">
                <button className="flex-shrink-0 text-muted-400 hover:text-success-600 transition mr-3">
                  <CheckCircle className="w-6 h-6" />
                </button>
                
                <div className="min-w-0">
                  <p className="text-base font-medium text-muted-900 truncate">{task.title}</p>
                  {task.leadName && (
                    <p className="text-sm text-muted-500 truncate">Lead: {task.leadName}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center flex-shrink-0 ml-4">
                <Calendar className={clsx("w-4 h-4 mr-1", getDueDateStyle(task.dueDate, task.status))} />
                <span className={clsx("text-sm", getDueDateStyle(task.dueDate, task.status))}>
                  {task.dueDate}
                </span>
              </div>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className="text-center text-muted-500 py-4">Nenhuma tarefa pendente. Bom trabalho!</p>
          )}
        </div>
      </Card>

      {/* 2. Tarefas Concluídas */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-muted-900 flex items-center">
          <XCircle className="w-5 h-5 mr-2 text-success-600" />
          Tarefas Concluídas ({completedTasks.length})
        </h2>
        
        <div className="space-y-2 opacity-70">
          {completedTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex justify-between items-center p-2 border-b last:border-b-0 text-muted-500">
              <p className="text-base line-through">{task.title}</p>
              <span className="text-xs text-success-600">Concluída</span>
            </div>
          ))}
          {completedTasks.length > 5 && (
             <p className="text-sm text-muted-400 mt-2 text-center">...e mais {completedTasks.length - 5} concluídas.</p>
          )}
        </div>
      </Card>
    </div>
  );
      }
