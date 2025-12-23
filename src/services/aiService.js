import { supabase } from '@/supabase/client';

/**
 * LeadPilot AI Service
 * Responsável por gerar insights e automações baseadas em dados.
 */
export const aiService = {
  // Analisa o comportamento e notas do lead para dar uma pontuação (0-100)
  async calculateLeadScore(leadId) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*, tasks(*)')
      .eq('id', leadId)
      .single();

    if (!lead) return 0;

    // Lógica de IA (Mockup de lógica avançada)
    let score = 20; // Base
    if (lead.email && lead.phone) score += 20;
    if (lead.status === 'Proposal') score += 30;
    if (lead.tasks?.length > 0) score += 15;
    
    return Math.min(score, 100);
  },

  // Sugere a próxima melhor ação baseada no histórico
  async getSmartRecommendation(lead) {
    // Aqui seria a chamada à API de IA (GPT-4)
    // Por agora, usamos um motor de regras inteligente
    if (lead.status === 'New') {
      return "Initial discovery call needed. Research their LinkedIn profile first.";
    }
    if (lead.status === 'FollowUp' && lead.notes?.length < 50) {
      return "Follow-up value is low. Send a case study to increase trust.";
    }
    return "Keep monitoring engagement. Lead is warming up.";
  }
};
