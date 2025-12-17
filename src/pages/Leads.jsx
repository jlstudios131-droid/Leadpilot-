import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { Search, Plus, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }) => {
  const colors = {
    'New': 'bg-primary-100 text-primary-700',
    'Proposal': 'bg-warning-100 text-warning-700',
    'FollowUp': 'bg-danger-100 text-danger-700',
    'Converted': 'bg-success-100 text-success-700',
  };
  return (
    <span className={clsx("px-3 py-1 text-xs font-medium rounded-full", colors[status] || 'bg-muted-200')}>
      {status}
    </span>
  );
};

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Buscar Leads do Supabase
  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) alert('Erro ao carregar leads: ' + error.message);
    else setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 2. Criar Novo Lead (Simples)
  const addLead = async () => {
    const name = prompt('Nome do Lead:');
    if (!name) return;

    const { error } = await supabase
      .from('leads')
      .insert([{ name, user_id: user.id, status: 'New' }]);

    if (error) alert('Erro ao criar: ' + error.message);
    else fetchLeads(); // Recarrega a lista
  };

  // 3. Deletar Lead
  const deleteLead = async (id) => {
    if (!confirm('Tem certeza?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) alert('Erro ao deletar');
    else fetchLeads();
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-muted-900">Gestão de Leads</h1>
        <button onClick={addLead} className="btn-primary w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" /> Novo Lead
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
        <input 
          type="text" 
          placeholder="Buscar leads..." 
          className="input pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <table className="min-w-full divide-y divide-muted-200">
            <thead className="bg-muted-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-muted-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted-50">
                  <td className="px-6 py-4 text-sm font-medium text-muted-900">{lead.name}</td>
                  <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteLead(lead.id)} className="text-danger-500 hover:text-danger-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
  }
