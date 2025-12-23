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

  // Criar novo Lead com feedback Premium
  const createLead = async (leadData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;
      notify.success(`Lead ${leadData.name} captured successfully!`);
      return data;
    } catch (error) {
      notify.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchLeads, createLead };
};
