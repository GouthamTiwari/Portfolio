import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  // In a real app, you'd have better error handling or a check at startup.
  // For this context, we'll log a warning. The UI will handle the disabled state.
  console.warn("Gemini API key not found. Fun Fact feature will be disabled.");
}

export const getFunFactAboutMorse = async (): Promise<string> => {
  if (!ai) {
    return "API Key is not configured. This feature is currently unavailable.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Tell me a short, interesting, and little-known fun fact about Morse code, suitable for a general audience. Make it just one or two sentences long.'
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact from Gemini API:", error);
    return "Could not fetch a fun fact at this time. Please try again later.";
  }
};