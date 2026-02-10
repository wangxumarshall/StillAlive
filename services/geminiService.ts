import { GoogleGenAI, Type } from "@google/genai";
import { LifeAnalysisResult } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a "Life Auditor" and "Existential Mentor". Your goal is to analyze a user's daily summary and determine if their day contributed positively or negatively to their life's meaning and longevity.

Rules:
1.  **Analyze the Input:** Look for physical health (exercise, sleep, diet), mental growth (learning, reading, focus), emotional connection (socializing, kindness), or vices (doomscrolling, procrastination, toxic behavior).
2.  **Calculate Time Delta:** Award or deduct "Life Seconds".
    *   High Positive (Major achievement, intense workout): +7200 to +14400 seconds (2-4 hours).
    *   Moderate Positive (Good habit, productive): +1800 to +3600 seconds.
    *   Neutral: 0 seconds.
    *   Moderate Negative (Lazy, minor vices): -1800 to -3600 seconds.
    *   High Negative (Harmful behavior, severe waste of time): -7200 to -14400 seconds.
3.  **Provide Reasoning:** A short, sharp, slightly philosophical or witty sentence explaining why. Be direct.
4.  **Category:** Return 'POSITIVE', 'NEGATIVE', or 'NEUTRAL'.

Output JSON format only.
`;

export const analyzeDailyLog = async (text: string): Promise<LifeAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            timeDeltaSeconds: { type: Type.INTEGER, description: "The number of seconds added or subtracted from life." },
            reasoning: { type: Type.STRING, description: "Short explanation for the adjustment." },
            category: { type: Type.STRING, description: "POSITIVE, NEGATIVE, or NEUTRAL" }
          },
          required: ["timeDeltaSeconds", "reasoning", "category"],
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LifeAnalysisResult;
    }
    
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes if API fails
    return {
      timeDeltaSeconds: 0,
      reasoning: "The universe is silent right now. (API Error)",
      category: "NEUTRAL"
    };
  }
};