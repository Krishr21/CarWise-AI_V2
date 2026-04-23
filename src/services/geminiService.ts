import { GoogleGenAI, Type } from "@google/genai";
import { CarListing, SearchFilters } from "../types";

// This specifically falls back to GEMINI_API_KEY if OPENROUTER is provided but we need native Google SDK for search
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function searchCars(filters: SearchFilters): Promise<CarListing[]> {
  // Using native Gemini Flash Preview because it supports Google Search Grounding for live URLs
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Find live used car listings strictly matching the user's intent: ${filters.query || filters.makeModel}
    Budget: ${filters.budgetMin} - ${filters.budgetMax}
    Year: ${filters.yearMin}+
    Location: ${filters.location}

    Search for real, current used car listings on major marketplaces (Cars.com, AutoTrader, CarGurus, etc.). 
    Return exactly 5 specific, live listings.
    
    RELEVANCE RULES:
    1. If the user searches for a specific brand (e.g., 'Tesla'), ALL returned listings MUST be of that brand.
    2. If the user searches for a specific model (e.g., 'Model 3'), ALL returned listings MUST be that model.
    3. Do NOT substitute with 'similar' brands or models unless you have zero results for the primary search, in which case you must explicitly state the substitution in the summary.
    
    CRITICAL SAFETY RULES:
    1. NEVER create or guess a URL based on patterns. 
    2. ONLY use URLs that appear directly in your Google Search grounding results or snippets.
    3. If you do not have a real URL for a listing, skip that listing and find another.
    4. Verify that the URL is a direct link to a vehicle detail page, not a general search result page.
    5. Prioritize listings that have been recently updated or posted within the last 30 days.
    
    Text constraints:
    - Summary must be under 150 characters.
    - Pros/Cons must be under 50 characters each.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a professional car search assistant. You rely strictly on your tools for real-time data. You ensure strict brand and model integrity—if a user asks for a Tesla, you only find Teslas. You are forbidden from hallucinating URLs. Every URL must be a verified link found in the search results.",
        // This is the critical piece that gives it live internet access:
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              mileage: { type: Type.STRING },
              year: { type: Type.STRING },
              location: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              imageUrl: { type: Type.STRING, description: "Direct URL to a representative image" },
            },
            required: ["title", "price", "url", "source"],
          },
        },
      },
    });

    let text = response.text;
    if (!text) return [];

    // Clean up potential markdown or whitespace
    text = text.trim();
    if (text.startsWith("\`\`\`json")) {
      text = text.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
    }

    try {
      return JSON.parse(text) as CarListing[];
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text length:", text.length);
      console.error("Partial text (last 100 chars):", text.slice(-100));
      
      // If it's truncated, try to fix it or return what we have
      if (text.endsWith('"}') || text.endsWith('"]')) {
         // It might just be missing the closing array bracket
         try {
           return JSON.parse(text + ']') as CarListing[];
         } catch { /* ignore */ }
      }
      
      throw new Error("The search results were malformed. Please try a more specific search.");
    }
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
}
