import { Users, TrendingUp, DollarSign, ListChecks } from 'lucide-react';
import Card from '@/components/ui/Card';

const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="p-5 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-muted-500">{title}</p>
      <p className="text-3xl font-bold text-muted-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-muted-900 md:text-3xl">Dashboard</h1>

      {/* 1. Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Leads Ativos" 
          value="45" 
          icon={Users} 
          colorClass="text-primary-600" 
        />
        <MetricCard 
          title="Fechados Mês" 
          value="8" 
          icon={TrendingUp} 
          colorClass="text-success-600" 
        />
        <MetricCard 
          title="Valor Fechado" 
          value="R$ 15.2K" 
          icon={DollarSign} 
          colorClass="text-warning-500" 
        />
        <MetricCard 
          title="Tarefas Pendentes" 
          value="12" 
          icon={ListChecks} 
          colorClass="text-danger-500" 
        />
      </div>

      {/* 2. Seções de Detalhes (Gráficos, Listas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4 text-muted-900">Leads Mais Recentes</h2>
          <p className="text-muted-500">
            Placeholder para a lista dos últimos 5 leads criados.
          </p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-muted-900">Tarefas Urgentes</h2>
          <p className="text-muted-500">
             Placeholder para tarefas com vencimento hoje ou atrasadas.
          </p>
        </Card>
      </div>
      
    </div>
  );
        }
