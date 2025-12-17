import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { Users, ListChecks, Star, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, tasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true, eq: ['status', 'Pending'] });
      setStats({ leads: leadsCount || 0, tasks: tasksCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-muted-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-lg text-primary-600"><Users /></div>
          <div>
            <p className="text-sm text-muted-500">Total Leads</p>
            <p className="text-2xl font-bold">{stats.leads}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-warning-100 rounded-lg text-warning-600"><ListChecks /></div>
          <div>
            <p className="text-sm text-muted-500">Tarefas Pendentes</p>
            <p className="text-2xl font-bold">{stats.tasks}</p>
          </div>
        </Card>
        
        {/* Outros cards estáticos por enquanto */}
        <Card className="p-6 flex items-center gap-4 opacity-50">
          <div className="p-3 bg-success-100 rounded-lg text-success-600"><TrendingUp /></div>
          <div><p className="text-sm text-muted-500">Vendas (Mês)</p><p className="text-2xl font-bold">R$ 0</p></div>
        </Card>
      </div>
    </div>
  );
}
