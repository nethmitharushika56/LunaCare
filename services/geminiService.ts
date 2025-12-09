import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize Gemini. 
// Note: In a real app, we'd handle missing keys more robustly.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeSymptoms = async (symptoms: string, userContext: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable: Please configure your API Key.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User Context: ${userContext}. 
      Symptoms/Query reported: ${symptoms}.
      
      Task: Act as Luna AI, a compassionate women's health assistant and expert in the reproductive system.
      1. If the user describes symptoms, analyze them based on their cycle phase and suggest 3 actionable lifestyle tips.
      2. If the user asks about reproductive anatomy, disorders (like PCOS, Endometriosis), or health, provide clear, educational, and scientifically accurate information suitable for a layperson.
      3. Indicate if any symptom described is a "Red Flag" requiring a doctor.
      
      Disclaimer: Start by stating you are an AI, not a doctor. Keep the tone empathetic and calm. Keep the response under 150 words.`,
    });
    return response.text || "I couldn't analyze that right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the health database right now.";
  }
};

export const getWellnessAdvice = async (mood: string): Promise<string> => {
    if (!ai) return "Take a deep breath. Drink some water. You've got this.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user is feeling ${mood}. Give a short, 2-sentence motivational quote or self-care tip specific to this mood.`,
        });
        return response.text || "Rest is productive.";
    } catch (error) {
        return "Rest is productive.";
    }
}