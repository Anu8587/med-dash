
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CasePriority } from "../types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_KEY || ''
});

export const analyzeAdverseEvent = async (text: string): Promise<AnalysisResult> => {
  const prompt = `
    You are a Pharmacovigilance (PV) safety expert. Analyze the following Adverse Event (AE) report text.
    Extract key safety information and classify the case priority according to ICH E2B standards.

    Priority Rules:
    - High: Life-threatening, hospitalization, death, congenital anomaly, or significant disability.
    - Medium: Persistent incapacity or medically important events not meeting High criteria.
    - Low: Non-serious events (rash, headache, etc.).

    Input Report:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedInfo: {
              type: Type.OBJECT,
              properties: {
                patient_age: { type: Type.NUMBER },
                gender: { type: Type.STRING },
                drug_name: { type: Type.STRING },
                dose: { type: Type.STRING },
                event_description: { type: Type.STRING },
                seriousness: { type: Type.STRING, description: "'Serious' or 'Non-Serious'" },
                hospitalized: { type: Type.BOOLEAN },
                event_start_date: { type: Type.STRING },
                outcome: { type: Type.STRING },
                reporter_type: { type: Type.STRING, description: "One of: Patient, Doctor, Pharmacist, Consumer" }
              }
            },
            missingFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            priority: {
              type: Type.STRING,
              description: "Must be 'High', 'Medium', or 'Low'"
            },
            reasoning: {
              type: Type.STRING
            }
          },
          required: ["detectedInfo", "missingFields", "priority", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}') as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
