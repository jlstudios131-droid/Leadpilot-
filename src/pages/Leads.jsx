import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { 
  Search, 
  Plus, 
  Loader2, 
  Trash2, 
  Mail, 
  Phone, 
  User, 
  ExternalLink,
  Filter,
  MoreHorizontal
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
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'New' });

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
    if (!confirm('Are you sure you want to delete this lead?')) return;
    await supabase.from('leads').delete().eq('id', id);
    fetchLeads();
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-muted-900 dark:text-white tracking-tight">Leads Database</h1>
          <p className="text-muted-500 dark:text-muted-400 font-medium">Manage and nurture your lifetime opportunities.</p>
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
            placeholder="Search by name, email or company..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" icon={Filter} className="hidden sm:flex">Filters</Button>
      </div>

      <Card className="overflow-hidden border-none shadow-xl shadow-black/5" animate={false}>
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="text-sm font-bold text-muted-400 uppercase tracking-widest">Synchronizing Leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted-50 dark:bg-muted-900/50 border-b border-muted-100 dark:border-muted-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-500">Lead Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-500 hidden md:table-cell">Contact Details</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-100 dark:divide-muted-800">
                <AnimatePresence>
                  {filteredLeads.map((lead) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={lead.id} 
                      className="hover:bg-muted-50/50 dark:hover:bg-muted-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <Link to={`/leads/${lead.id}`} className="flex items-center gap-1 text-sm font-bold text-muted-900 dark:text-white hover:text-primary-600 transition-colors">
                              {lead.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <span className="text-[11px] text-muted-500 md:hidden">{lead.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-600 dark:text-muted-400">
                            <Mail size={12} className="text-muted-400" /> {lead.email || '—'}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-600 dark:text-muted-400">
                            <Phone size={12} className="text-muted-400" /> {lead.phone || '—'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => deleteLead(lead.id)} className="p-2 text-muted-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors rounded-lg hover:bg-danger-50 dark:hover:bg-danger-500/10">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-muted-500 font-medium">No leads found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lead" maxWidth="max-w-xl">
        <form onSubmit={handleCreateLead} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" icon={User} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Email Address" type="email" icon={Mail} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Phone Number" icon={Phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-500 ml-1">Initial Status</label>
              <select 
                className="input-premium w-full" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="New">New Lead</option>
                <option value="Proposal">Proposal Sent</option>
                <option value="FollowUp">Follow-up Needed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-muted-100 dark:border-muted-800">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>Create Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
          }
