import { mockLeads } from '@/data/mock';
import Card from '@/components/ui/Card';
import { Search, Plus } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }) => {
  let color = 'bg-muted-200 text-muted-700';
  if (status === 'New') color = 'bg-primary-100 text-primary-700';
  if (status === 'Proposal') color = 'bg-warning-100 text-warning-700';
  if (status === 'FollowUp') color = 'bg-danger-100 text-danger-700';
  if (status === 'Converted') color = 'bg-success-100 text-success-700';

  return (
    <span className={clsx("px-3 py-1 text-xs font-medium rounded-full", color)}>
      {status}
    </span>
  );
};

export default function Leads() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-muted-900 md:text-3xl">Gestão de Leads</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-400" />
          <input 
            type="text"
            placeholder="Buscar por nome ou email..."
            className="input pl-10"
          />
        </div>
        
        <button className="btn-primary w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Novo Lead
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-muted-200">
          <thead className="bg-muted-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider hidden sm:table-cell">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase tracking-wider hidden lg:table-cell">
                Origem
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-muted-200">
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-900">
                  {lead.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-500 hidden sm:table-cell">
                  {lead.email || lead.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-500 hidden lg:table-cell">
                  {lead.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary-600 hover:text-primary-900">
                    Ver Detalhes
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {mockLeads.length === 0 && (
          <p className="p-6 text-center text-muted-500">Nenhum lead encontrado.</p>
        )}
      </Card>
    </div>
  );
          }
