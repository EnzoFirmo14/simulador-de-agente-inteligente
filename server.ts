import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve os arquivos estáticos da pasta public (HTML, CSS, JS)
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// Rota raiz envia o index.html explicitamente
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Endpoint super simples para conversar com o Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { message, modelProvider } = req.body;

    if (!message) {
      return res.status(400).json({ error: "A mensagem não pode estar vazia." });
    }

    const promptEnhancerInstruction = `Você é um Engenheiro de Prompt Especialista. 
O usuário enviará uma dúvida ou solicitação. Sua única tarefa é reescrever essa mensagem transformando-a em um prompt perfeito, rico em contexto, estruturado e claro, focado para um assistente educacional.
Não responda à pergunta do usuário, APENAS retorne o prompt melhorado.`;

    const systemInstruction = `Você é o "Assistente Inteligente Escolar" (EduAI).
Você ajuda alunos com resumos, explicações didáticas de matérias escolares e tira dúvidas de forma amigável, clara e paciente. 
Use exemplos fáceis de entender.`;

    let reply = "";

    if (modelProvider === "grok") {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GROQ_API_KEY não configurada no .env" });
      }

      const groq = new Groq({ apiKey });

      // Passo 1: Melhorar o prompt do usuário
      const enhancerCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: promptEnhancerInstruction },
          { role: "user", content: message }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      const perfectPrompt = enhancerCompletion.choices[0]?.message?.content || message;
      console.log(`[Grok] Prompt original: ${message}\n[Grok] Prompt aprimorado: ${perfectPrompt}\n`);

      // Passo 2: Responder usando o prompt aprimorado
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: perfectPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      reply = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui formular uma resposta.";

    } else {
      // Default to Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY não configurada no .env" });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Passo 1: Melhorar o prompt do usuário
      const enhancerResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: promptEnhancerInstruction,
          temperature: 0.5,
        }
      });

      const perfectPrompt = enhancerResponse.text || message;
      console.log(`[Gemini] Prompt original: ${message}\n[Gemini] Prompt aprimorado: ${perfectPrompt}\n`);

      // Passo 2: Responder usando o prompt aprimorado
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: perfectPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      reply = response.text || "Desculpe, não consegui formular uma resposta.";
    }

    res.json({
      success: true,
      reply: reply,
    });
  } catch (error: any) {
    console.error("Erro no Chat API:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro interno de servidor",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`Interface limpa e simplificada pronta!`);
});
