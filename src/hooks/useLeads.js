import { useState, useCallback } from 'react';
import { supabase } from '@/supabase/client';
import { useNotify } from '@/context/NotificationContext';

export const useLeads = () => {
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  // Buscar todos os leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, tasks(id, status)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      notify.error("Failed to sync leads with database.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [notify]);

  /**
   * Criar novo Lead (Manual ou Automático)
   * @param {Object} leadData - Dados do lead
   * @param {boolean} isSilent - Se true, não mostra notificação (usado para captura externa)
   */
  const createLead = async (leadData, isSilent = false) => {
    setLoading(true);
    try {
      // Garante que o lead tem uma origem definida
      const finalLeadData = {
        ...leadData,
        source: leadData.source || 'Manual',
        status: leadData.status || 'New'
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([finalLeadData])
        .select()
        .single();

      if (error) throw error;

      if (!isSilent) {
        notify.success(`Lead ${leadData.name} captured successfully!`);
      }
      
      return data;
    } catch (error) {
      if (!isSilent) notify.error(error.message);
      console.error("Capture error:", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar (necessária para gestão)
  const deleteLead = async (id) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      notify.success("Lead removed from pipeline.");
      return true;
    } catch (error) {
      notify.error("Failed to delete lead.");
      return false;
    }
  };

  return { loading, fetchLeads, createLead, deleteLead };
};
