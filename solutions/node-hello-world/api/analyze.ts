// File: api/analyze.ts
import { GoogleGenAI, Type } from "@google/genai";

// This is a generic handler for Vercel's Edge Functions.
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { fileName, genre, language, referenceFile } = body;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured on the server.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // The prompt and schema are moved here, to the secure backend.
    const referencePrompt = referenceFile ? `
        **REFERENCE TRACK COMPARISON:**
        The user has also provided a reference track for comparison.
        - Reference Filename: ${referenceFile.name}
        Your analysis MUST include a direct comparison to this reference track in the 'referenceAnalysis' object.
    ` : `
        No reference track was provided. The 'referenceAnalysis' field in the JSON response should be omitted.
    `;

    const prompt = `
        You are an expert AI audio engineer from VDSS Audio Academy. Your task is to provide a highly technical and professional analysis of an audio file.
        - Filename: ${fileName}
        - Genre: ${genre}
        - Language for response: ${language}
        ${referencePrompt}
        **CRITICAL METRIC ACCURACY:** You must follow these rules without exception.
        - **IF MASTERED:** 'maxTruePeak' MUST be between -1.0 and -0.1 dBTP. 'integratedLufs' should be high (e.g., -6 to -10 LUFS).
        - **IF PRE-MASTER:** 'maxTruePeak' MUST be between -6.0 and -3.0 dBTP for headroom. 'integratedLufs' should be lower (e.g., -16 to -23 LUFS).
        **LANGUAGE REQUIREMENT:** All text in the response JSON MUST be in the requested language: '${language}'.
        Generate the response according to the provided JSON schema.
    `;
    
    // NOTE: The full schema from your original file would be placed here.
    // It is omitted for brevity but is required for the function to work.
    const analysisSchema = { type: Type.OBJECT, properties: { /* ... PASTE FULL SCHEMA HERE ... */ } };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
        },
    });
    
    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in serverless function:", error);
    return new Response(JSON.stringify({ error: "Failed to get analysis from AI." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
