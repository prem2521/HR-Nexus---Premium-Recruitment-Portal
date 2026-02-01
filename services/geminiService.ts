
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const composeInterviewEmail = async (candidateName: string, role: string) => {
  const ai = getAIClient();
  const prompt = `Compose a professional and warm interview invitation email for a candidate named "${candidateName}" for the position of "${role}" at "TechNexus Solutions". 
  Include placeholders for Date, Time, and Interviewer Name. 
  The tone should be professional yet welcoming, suitable for a modern tech startup.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate email content.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating email. Please try manual composition.";
  }
};
