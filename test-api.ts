import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelsToTest = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro-latest"];

async function run() {
  for (const m of modelsToTest) {
    try {
      const response = await ai.models.generateContent({ model: m, contents: "Oi" });
      console.log(`[${m}]: Sucesso!`);
    } catch (e: any) {
      console.log(`[${m}]: Erro - ${e.message}`);
    }
  }
}
run();
