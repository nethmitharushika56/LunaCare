
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize Gemini. 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeSymptoms = async (symptoms: string, userContext: string, language: string = 'en'): Promise<string> => {
  if (!ai) {
      if (language === 'es') return "Servicio IA no disponible.";
      if (language === 'fr') return "Service IA indisponible.";
      if (language === 'de') return "KI-Dienst nicht verfügbar.";
      if (language === 'pt') return "Serviço de IA indisponível.";
      if (language === 'zh') return "AI 服务不可用。";
      if (language === 'hi') return "AI सेवा उपलब्ध नहीं है।";
      if (language === 'si') return "AI සේවාව ලබා ගත නොහැක.";
      if (language === 'ta') return "AI சேவை கிடைக்கவில்லை.";
      return "AI Service Unavailable: Please configure your API Key.";
  }

  try {
    const promptMap: Record<string, string> = {
      es: 'RESPOND IN SPANISH.',
      fr: 'RESPOND IN FRENCH.',
      de: 'RESPOND IN GERMAN.',
      pt: 'RESPOND IN PORTUGUESE.',
      zh: 'RESPOND IN SIMPLIFIED CHINESE.',
      hi: 'RESPOND IN HINDI.',
      si: 'RESPOND IN SINHALA.',
      ta: 'RESPOND IN TAMIL.',
      en: 'RESPOND IN ENGLISH.'
    };
    const langPrompt = promptMap[language] || 'RESPOND IN ENGLISH.';
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Context: ${userContext}. 
      Symptoms/Query reported: ${symptoms}.
      
      Task: Act as Luna AI, a compassionate women's health assistant and expert in the reproductive system.
      1. If the user describes symptoms, analyze them based on their cycle phase and suggest 3 actionable lifestyle tips.
      2. If the user asks about reproductive anatomy, disorders (like PCOS, Endometriosis), or health, provide clear, educational, and scientifically accurate information suitable for a layperson.
      3. Indicate if any symptom described is a "Red Flag" requiring a doctor.
      
      Disclaimer: Start by stating you are an AI, not a doctor. Keep the tone empathetic and calm. Keep the response under 150 words.
      CRITICAL INSTRUCTION: ${langPrompt}`,
    });
    return response.text || "I couldn't analyze that right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the health database right now.";
  }
};

export const getWellnessAdvice = async (mood: string, language: string = 'en'): Promise<string> => {
    if (!ai) return "Rest is productive.";

    try {
        const promptMap: Record<string, string> = {
          es: 'RESPOND IN SPANISH.',
          fr: 'RESPOND IN FRENCH.',
          de: 'RESPOND IN GERMAN.',
          pt: 'RESPOND IN PORTUGUESE.',
          zh: 'RESPOND IN SIMPLIFIED CHINESE.',
          hi: 'RESPOND IN HINDI.',
          si: 'RESPOND IN SINHALA.',
          ta: 'RESPOND IN TAMIL.',
          en: 'RESPOND IN ENGLISH.'
        };
        const langPrompt = promptMap[language] || 'RESPOND IN ENGLISH.';
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user is feeling ${mood}. Give a short, 2-sentence motivational quote or self-care tip specific to this mood. ${langPrompt}`,
        });
        return response.text || "Rest is productive.";
    } catch (error) {
        return "Rest is productive.";
    }
}
