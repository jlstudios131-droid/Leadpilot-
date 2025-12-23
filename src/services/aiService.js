import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa a conexão com o Google Gemini usando a chave de ambiente
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const aiService = {
  /**
   * 1. LEAD SCORE (Matemático & Instantâneo)
   * Analisa a qualidade dos dados para priorizar o funil.
   */
  calculateLeadScore(lead) {
    if (!lead) return 0;
    let score = 10;

    if (lead.email) score += 15;
    if (lead.phone) score += 20;
    if (lead.notes && lead.notes.length > 50) score += 15;

    const statusWeights = {
      'New': 5,
      'FollowUp': 20,
      'Proposal': 45,
      'Converted': 50,
      'Lost': 0
    };

    score += statusWeights[lead.status] || 0;
    return Math.min(Math.max(score, 0), 100);
  },

  /**
   * 2. SMART RECOMMENDATION (IA Real via Gemini 1.5 Flash)
   * Analisa o contexto das notas e do status para dar uma estratégia real.
   */
  async getSmartRecommendation(lead) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "tua_chave_aqui") {
        console.warn("AI Key not configured properly.");
        return "AI system pending setup. Please check environment variables.";
      }

      // Usamos o modelo 'flash' por ser o mais rápido e otimizado para o plano gratuito
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a world-class sales strategist for a B2B SaaS company.
        Analyze this lead and provide ONE specific, high-impact tactical advice.
        
        Lead Name: ${lead.name}
        Current Pipeline Stage: ${lead.status}
        Notes/History: "${lead.notes || 'No notes provided yet'}"
        Contact available: ${lead.email || lead.phone ? 'Yes' : 'No'}

        Task: Provide a single sentence (max 20 words) with the next best action to close this deal. 
        Be professional, aggressive (but polite), and highly strategic. 
        Respond only in English.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim() || "Deep dive into lead history to identify pain points.";

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback inteligente caso a API falhe ou a cota de 15/min expire
      return "Critical follow-up required. Review the latest interaction for immediate response.";
    }
  }
};
