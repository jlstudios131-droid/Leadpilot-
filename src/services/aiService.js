/**
 * LeadPilot AI Service (Free Engine)
 * Usa heurística avançada para simular IA sem custos de API.
 */
export const aiService = {
  // Sincrono: Calcula instantaneamente para listas grandes
  calculateLeadScore(lead) {
    if (!lead) return 0;

    let score = 10; // Pontuação base de existência

    // 1. Dados de Contato (Dados valem ouro)
    if (lead.email) score += 15;
    if (lead.phone) score += 20;

    // 2. Engajamento (Tamanho das notas indica interação)
    if (lead.notes && lead.notes.length > 20) score += 10;
    if (lead.notes && lead.notes.length > 100) score += 10;

    // 3. Estágio do Funil (Pipeline Weight)
    const statusWeights = {
      'New': 5,
      'FollowUp': 20,
      'Proposal': 45,
      'Converted': 50, // Leads convertidos não são 100% até pagarem (exemplo)
      'Lost': 0
    };

    score += statusWeights[lead.status] || 0;
    
    // Teto máximo de 100 e mínimo de 0
    return Math.min(Math.max(score, 0), 100);
  },

  // Assincrono: Simula "pensamento" para dar conselhos
  async getSmartRecommendation(lead) {
    // Simula delay de rede/processamento (1.2s) para UX Premium
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Lógica de Recomendação "Mock AI"
    if (lead.status === 'Lost') {
      return "Analyze rejection reason. Send a 'break-up' email to keep door open for future.";
    }

    if (!lead.email && !lead.phone) {
      return "Critical Missing Data: Use LinkedIn or company website to find contact info immediately.";
    }

    if (lead.status === 'New') {
      return "High Priority: Send the 'Introduction Template' within the first 2 hours.";
    }

    if (lead.status === 'FollowUp') {
      if (lead.notes?.length > 50) {
        return "Deep engagement detected. Suggest a demo call to clarify specific points found in notes.";
      }
      return "Low engagement. Send a value-add article or case study instead of asking for a meeting.";
    }

    if (lead.status === 'Proposal') {
      return "Closing Window: Send a gentle reminder 48h after proposal sent. Focus on ROI.";
    }

    return "Maintain periodic contact to nurture this relationship.";
  }
};
