import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Loader2, 
  Sparkles,
  ArrowUpRight,
  Zap
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
import { motion } from 'framer-motion';

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
      const { data: leads, error: leadsError } = await supabase.from('leads').select('status');
      const { count: activeTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      if (leadsError || tasksError) throw leadsError || tasksError;

      const counts = { 'New': 0, 'Proposal': 0, 'FollowUp': 0, 'Converted': 0 };
      leads.forEach(lead => { if (counts[lead.status] !== undefined) counts[lead.status]++; });

      const chartData = [
        { name: 'New', value: counts['New'], color: '#6366f1' },
        { name: 'Proposal', value: counts['Proposal'], color: '#f59e0b' },
        { name: 'Follow-up', value: counts['FollowUp'], color: '#ec4899' },
        { name: 'Closed', value: counts['Converted'], color: '#10b981' },
      ];

      setStats({
        totalLeads: leads.length,
        activeTasks: activeTasks || 0,
        convertedLeads: counts['Converted'],
        funnelData: chartData
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary-500" />
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { label: 'Pending Tasks', value: stats.activeTasks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Converted', value: stats.convertedLeads, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { 
      label: 'Win Rate', 
      value: stats.totalLeads > 0 ? `${((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)}%` : '0%', 
      icon: TrendingUp, color: 'text-ai-600', bg: 'bg-ai-50 dark:bg-ai-500/10' 
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight">Performance Hub</h1>
          <p className="text-muted-500 dark:text-muted-400 font-medium">Monitoring your lifetime sales ecosystem.</p>
        </div>
        <Button variant="ai" icon={Sparkles} onClick={fetchDashboardData}>
          Analyze with AI
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <Card key={index} hoverable className="p-1">
            <div className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-black text-muted-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 overflow-hidden" animate={false}>
          <div className="p-6 border-b border-muted-100 dark:border-muted-800 flex items-center justify-between">
            <h3 className="font-bold text-muted-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-primary-500" size={18} /> Sales Pipeline Distribution
            </h3>
            <span className="text-[10px] font-bold bg-muted-100 dark:bg-muted-800 px-2 py-1 rounded text-muted-500 uppercase">Live Update</span>
          </div>
          <div className="p-6 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.funnelData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                  {stats.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Action Sidebar */}
        <Card isAiHighlight className="flex flex-col">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-2 text-ai-600 dark:text-ai-400">
              <Zap size={20} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Strategy Insight</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-muted-900 dark:text-white leading-tight">
                Focus on Follow-ups
              </h3>
              <p className="text-sm text-muted-600 dark:text-muted-400 leading-relaxed">
                You have <span className="text-primary-600 font-bold">{stats.activeTasks} pending tasks</span>. 
                AI Analysis shows that responding within 24h increases conversion by <span className="text-emerald-500 font-bold">700%</span>.
              </p>
            </div>

            <div className="p-4 bg-white/50 dark:bg-muted-900/50 rounded-2xl border border-ai-100 dark:border-ai-500/10">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-muted-500 uppercase">Health Score</span>
                <span className="text-ai-600">88%</span>
              </div>
              <div className="w-full h-1.5 bg-muted-200 dark:bg-muted-800 rounded-full overflow-hidden">
                <div className="h-full bg-ai-500 w-[88%]" />
              </div>
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full mt-8 group" 
            icon={ArrowUpRight}
            onClick={() => window.location.href = '/tasks'}
          >
            Execute Tasks
          </Button>
        </Card>
      </div>
    </div>
  );
}

// Minimalist Tooltip for the Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted-900 text-white p-3 rounded-xl shadow-xl border border-muted-800 text-xs font-bold">
        {`${payload[0].payload.name}: ${payload[0].value} leads`}
      </div>
    );
  }
  return null;
};
