import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeTasks: 0,
    convertedLeads: 0,
    funnelData: []
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Buscar todos os leads para estatísticas
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('status');

      // 2. Buscar tarefas pendentes
      const { count: activeTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      if (leadsError || tasksError) throw leadsError || tasksError;

      // Processar dados para o gráfico do funil
      const counts = {
        'New': 0,
        'Proposal': 0,
        'FollowUp': 0,
        'Converted': 0,
        'Lost': 0
      };

      leads.forEach(lead => {
        if (counts[lead.status] !== undefined) {
          counts[lead.status]++;
        }
      });

      const chartData = [
        { name: 'Novos', value: counts['New'], color: '#3b82f6' },
        { name: 'Proposta', value: counts['Proposal'], color: '#f59e0b' },
        { name: 'Follow-up', value: counts['FollowUp'], color: '#ec4899' },
        { name: 'Fechados', value: counts['Converted'], color: '#10b981' },
      ];

      setStats({
        totalLeads: leads.length,
        activeTasks: activeTasks || 0,
        convertedLeads: counts['Converted'],
        funnelData: chartData
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total de Leads', 
      value: stats.totalLeads, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Tarefas Pendentes', 
      value: stats.activeTasks, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Clientes Convertidos', 
      value: stats.convertedLeads, 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Taxa de Conversão', 
      value: stats.totalLeads > 0 
        ? `${((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)}%` 
        : '0%', 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-muted-900">Dashboard</h1>
        <p className="text-muted-500">Bem-vindo de volta! Aqui está o resumo do teu funil de vendas.</p>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item, index) => (
          <Card key={index} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-500">{item.label}</p>
              <p className="text-2xl font-bold text-muted-900">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico do Funil */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> 
            Distribuição do Funil de Vendas
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                  {stats.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerta de Acção */}
        <Card className="p-6 bg-primary-600 text-white border-none flex flex-col justify-between">
          <div>
            <div className="bg-white/20 w-fit p-2 rounded-lg mb-4">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Foco no Follow-up!</h3>
            <p className="text-primary-100 text-sm leading-relaxed">
              Tens {stats.activeTasks} tarefas pendentes. Lembra-te que leads que recebem resposta em menos de 24h têm 7x mais chances de converter.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/tasks'}
            className="mt-6 bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-primary-50 transition-colors w-full"
          >
            Resolver Tarefas
          </button>
        </Card>
      </div>
    </div>
  );
        }
