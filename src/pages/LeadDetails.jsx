import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabase/client';
import Card from '@/components/ui/Card';
import { ArrowLeft, Mail, Phone, Calendar, Save, Loader2, MessageSquare, ListChecks } from 'lucide-react';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*, tasks(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      navigate('/leads');
    } else {
      setLead(data);
      setNotes(data.notes || '');
    }
    setLoading(false);
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleUpdateNotes = async () => {
    setSaving(true);
    const { error } = await supabase.from('leads').update({ notes }).eq('id', id);
    if (error) alert('Erro ao salvar');
    else alert('Notas salvas!');
    setSaving(false);
  };

  const handleStatusChange = async (newStatus) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) setLead({ ...lead, status: newStatus });
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/leads" className="p-2 hover:bg-muted-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-muted-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-muted-900">{lead.name}</h1>
          <p className="text-sm text-muted-500 italic">ID: {lead.id.split('-')[0]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-700">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="truncate">{lead.email || 'Sem e-mail'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-700">
                <Phone className="w-5 h-5 text-primary-500" />
                <span>{lead.phone || 'Sem telefone'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-700">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span>Desde: {new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-muted-700 mb-2">Fase do Funil</label>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input"
              >
                <option value="New">Novo Lead</option>
                <option value="Proposal">Proposta Enviada</option>
                <option value="FollowUp">Follow-up</option>
                <option value="Converted">Cliente Convertido</option>
                <option value="Lost">Perdido</option>
              </select>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" /> Notas
              </h2>
              <button onClick={handleUpdateNotes} disabled={saving} className="btn-primary py-1 px-3 text-xs flex items-center gap-2">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Salvar
              </button>
            </div>
            <textarea 
              className="input min-h-[150px] resize-none p-4"
              placeholder="Histórico da conversa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary-500" /> Tarefas do Lead
            </h2>
            <div className="space-y-2">
              {lead.tasks?.length > 0 ? (
                lead.tasks.map(t => (
                  <div key={t.id} className="p-3 bg-muted-50 rounded-lg flex justify-between">
                    <span className="text-sm">{t.title}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-400">{t.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-500 text-sm italic">Sem tarefas vinculadas.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
          }
