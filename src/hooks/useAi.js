import { useState } from 'react';
import { aiService } from '@/services/aiService';

export const useAi = () => {
  const [analyzing, setAnalyzing] = useState(false);

  const getInsight = async (lead) => {
    setAnalyzing(true);
    // Simulando delay de "pensamento" da IA para efeito visual Premium
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendation = await aiService.getSmartRecommendation(lead);
    const score = await aiService.calculateLeadScore(lead.id);
    
    setAnalyzing(false);
    return { recommendation, score };
  };

  return { getInsight, analyzing };
};
