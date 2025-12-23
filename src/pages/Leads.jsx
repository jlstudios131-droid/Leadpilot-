import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useNotify } from '@/context/NotificationContext';
import { aiService } from '@/services/aiService';

// Componentes UI
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

// Ícones e Animação
import { 
  Search, Plus, Loader2, Trash2, Mail, 
  Phone, User, ExternalLink, Filter, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const variants = {
    'New': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    'Proposal': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    'FollowUp': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    'Converted': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    'Lost': 'bg-muted-200 text-muted-700 dark:bg-muted-800 dark:text-muted-400',
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${variants[status] || variants['Lost']}`}>
      {status}
    </span>
  );
};

export default function Leads() {
  const { user } = useAuth();
  const { fetchLeads, createLead, deleteLead, loading } = useLeads();
  const notify = useNotify();

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'New' });

  // Carregamento inicial via Hook Premium
  const loadLeads = async () => {
    const data = await fetchLeads();
    setLeads(data);
  };

  useEffect(() => { loadLeads(); }, [fetchLeads]);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newLead = await createLead({ ...formData, user_id: user.id });
    
    if (newLead) {
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', status: 'New' });
      loadLeads(); // Recarrega a lista
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const success = await deleteLead(id);
    if (success) loadLeads();
  };

  // Filtro inteligente e ordenação por Score
  const filteredLeads = useMemo(() => {
    return leads
      .filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(lead => ({
        ...lead,
        aiScore: aiService.calculateLeadScore(lead) // Injeta o score em tempo real
      }));
  }, [leads, searchTerm]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight italic">LEADS DATABASE</h1>
          <p className="text-muted-500 dark:text-muted-400 font-medium">Predictive management for high-ticket opportunities.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus} variant="primary">
          Add New Lead
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input 
            icon={Search} 
            placeholder="Search leads by intelligence..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" icon={Filter} className="hidden sm:flex">Advanced Filters</Button>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl shadow-black/10" animate={false}>
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="text-[10px] font-black text-muted-400 uppercase tracking-[0.3em]">Neural Sync in Progress...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-muted-50/50 dark:bg-muted-900/50 border-b border-muted-100 dark:border-muted-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-400">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-400 text-center">AI Score</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-400">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-100 dark:divide-muted-800">
                <AnimatePresence mode='popLayout'>
                  {filteredLeads.map((lead) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={lead.id} 
                      className="hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muted-100 to-muted-200 dark:from-muted-800 dark:to-muted-700 text-muted-700 dark:text-muted-200 flex items-center justify-center font-black text-xs shadow-inner">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <Link to={`/leads/${lead.id}`} className="flex items-center gap-1.5 text-sm font-bold text-muted-900 dark:text-white hover:text-primary-600 transition-colors">
                              {lead.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <span className="text-[11px] text-muted-500 font-medium">{lead.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-ai-600 dark:text-ai-400">
                            <Sparkles size={14} fill="currentColor" className="opacity-20" />
                            <span className="text-xs font-black italic">{lead.aiScore}%</span>
                          </div>
                          <div className="w-16 h-1 bg-muted-100 dark:bg-muted-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${lead.aiScore}%` }}
                              className="h-full bg-ai-500" 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(lead.id)} 
                          className="p-2 text-muted-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredLeads.length === 0 && !loading && (
              <div className="p-20 text-center border-t border-muted-100 dark:border-muted-800">
                <p className="text-sm text-muted-500 font-bold uppercase tracking-widest">No Intelligence Data Found</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal permanece igual, mas agora usando isSubmitting do estado local */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Capture New Opportunity" maxWidth="max-w-xl">
        <form onSubmit={handleCreateLead} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" icon={User} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Email Address" type="email" icon={Mail} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Phone Number" icon={Phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-400 ml-1">Pipeline Stage</label>
              <select 
                className="w-full h-11 bg-muted-50 dark:bg-muted-900 border border-muted-200 dark:border-muted-800 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="New">New Lead</option>
                <option value="Proposal">Proposal Stage</option>
                <option value="FollowUp">Follow-up</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Abort</Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Deploy Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
    }
