import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we assume it's set.
  console.warn("Gemini API key not found in process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Identifies a pill from a base64 encoded image.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns The text description of the pill from the Gemini API.
 */
export const identifyPill = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const textPart = {
      text: "Please identify this pill. Provide its common name, typical dosage strengths, and what it's generally used for. Be concise and clear, as this is for a senior-friendly application.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error identifying pill:", error);
    return "Could not identify the pill. Please try again or contact a healthcare provider.";
  }
};

/**
 * Gets information about a medication from the Gemini API.
 * @param medicationName The name of the medication.
 * @param medicationDosage The dosage of the medication.
 * @returns A senior-friendly explanation of the medication.
 */
export const getMedicationInfo = async (medicationName: string, medicationDosage: string): Promise<string> => {
  try {
    const prompt = `Explain the medication "${medicationName}" (${medicationDosage}). 
    Describe its main purpose, common side effects, and any important instructions.
    Write it in very simple, clear language suitable for a senior citizen with no medical background. 
    AVOID medical jargon. Use short sentences and bullet points for readability. Format the response clearly. Do not use markdown syntax.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting medication info:", error);
    return "Could not retrieve information for this medication. Please try again later.";
  }
};