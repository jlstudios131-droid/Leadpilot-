import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Search, Plus, Loader2, Trash2, Mail, Phone, User, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-700',
    'Proposal': 'bg-amber-100 text-amber-700',
    'FollowUp': 'bg-rose-100 text-rose-700',
    'Converted': 'bg-emerald-100 text-emerald-700',
    'Lost': 'bg-muted-200 text-muted-700',
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New'
  });

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setLeads(data);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('leads').insert([{ ...formData, user_id: user.id }]);
    if (error) alert(error.message);
    else {
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', status: 'New' });
      fetchLeads();
    }
    setIsSubmitting(false);
  };

  const deleteLead = async (id) => {
    if (!confirm('Excluir este lead?')) return;
    await supabase.from('leads').delete().eq('id', id);
    fetchLeads();
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-muted-900">Gestão de Leads</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto flex items-center justify-center">
          <Plus className="w-5 h-5 mr-2" /> Novo Lead
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou email..." 
          className="input pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted-200">
              <thead className="bg-muted-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-500 uppercase hidden md:table-cell">Contato</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-muted-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/leads/${lead.id}`} className="group">
                        <div className="text-sm font-bold text-primary-600 group-hover:underline flex items-center gap-1">
                          {lead.name} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </div>
                      </Link>
                      <div className="text-xs text-muted-500 md:hidden">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                    <td className="px-6 py-4 text-sm text-muted-500 hidden md:table-cell">
                      <div>{lead.email || 'N/A'}</div>
                      <div className="text-xs">{lead.phone || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => deleteLead(lead.id)} className="text-muted-400 hover:text-danger-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Lead">
        <form onSubmit={handleCreateLead} className="space-y-4">
          <Input label="Nome Completo" icon={User} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="E-mail" type="email" icon={Mail} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input label="Telefone" icon={Phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div>
            <label className="block text-sm font-medium text-muted-700 mb-1">Status</label>
            <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="New">Novo</option>
              <option value="Proposal">Proposta</option>
              <option value="FollowUp">Follow-up</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
                                           }
