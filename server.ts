import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API: Check status & keys
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// API: Simulate Intelligent Agent step-by-step
app.post("/api/simulate", async (req, res) => {
  try {
    const { agentName, problem, peas, inputData } = req.body;

    if (!agentName || !problem || !inputData) {
      return res.status(400).json({ error: "Parâmetros 'agentName', 'problem' e 'inputData' são obrigatórios." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é o mecanismo cognitivo central (cérebro) do Agente Inteligente "${agentName}".
Este agente foi desenvolvido para resolver o seguinte problema real: "${problem}".

Arquitetura PEAS do Agente:
- Desempenho (Performance): ${peas?.performance || "Não especificado"}
- Ambiente (Environment): ${peas?.environment || "Não especificado"}
- Atuadores (Actuators): ${peas?.actuators || "Não especificado"}
- Sensores (Sensors): ${peas?.sensors || "Não especificado"}

Seu papel é receber os dados capturados pelos sensores do agente, processar cognitivamente (raciocinar de acordo com suas regras e objetivos do PEAS), determinar a melhor resposta ou ação, e explicar como os atuadores interagem com o ambiente.`;

    const userPrompt = `Os sensores capturaram o seguinte sinal/evento do ambiente:
"${inputData}"

Atue agora como o Agente Inteligente. Processe essa entrada e formule a saída de acordo com o esquema JSON especificado.`;

    // Prompt Gemini with a detailed schema to structure inputs, processing, and outputs
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            perceptionDetails: {
              type: Type.STRING,
              description: "Análise e higienização dos dados capturados pelos sensores (Entrada).",
            },
            reasoningSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Os passos lógicos que o cérebro do agente percorreu para processar os dados e decidir a ação (Processamento). Mínimo 3 passos explicativos.",
            },
            decisionMade: {
              type: Type.STRING,
              description: "A decisão tomada ou comando gerado para execução imediata.",
            },
            actuatorAction: {
              type: Type.STRING,
              description: "Descrição de como o atuador executa a decisão no ambiente físico/digital (Saída).",
            },
            peasImpact: {
              type: Type.OBJECT,
              properties: {
                performanceEffect: {
                  type: Type.STRING,
                  description: "Como essa ação específica afeta positivamente as métricas de desempenho.",
                },
                environmentChange: {
                  type: Type.STRING,
                  description: "A modificação ou feedback gerado no ambiente operacional após a ação.",
                },
              },
              required: ["performanceEffect", "environmentChange"],
            },
          },
          required: [
            "perceptionDetails",
            "reasoningSteps",
            "decisionMade",
            "actuatorAction",
            "peasImpact",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json({
      success: true,
      agentName,
      inputRaw: inputData,
      simulation: resultJson,
    });
  } catch (error: any) {
    console.error("Simulation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro interno ao simular o agente.",
    });
  }
});

// Start server function incorporating Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
