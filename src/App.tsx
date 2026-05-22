import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  GraduationCap, 
  Car, 
  Settings, 
  Brain, 
  Cpu, 
  Send, 
  CheckCircle2, 
  User, 
  HelpCircle, 
  FileText, 
  Download, 
  Play, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layers, 
  Network,
  Users,
  Award,
  Calendar,
  BookOpen,
  Check,
  ClipboardList
} from "lucide-react";
import { AGENT_TEMPLATES } from "./data";
import { AgentTemplate, PEAS, SimulationResult, DuplaInfo } from "./types";

export default function App() {
  // Preset Templates
  const [templates, setTemplates] = useState<AgentTemplate[]>(AGENT_TEMPLATES);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("hospitalar");
  
  // Custom Agent Creation Form states
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Geral");
  const [customProblem, setCustomProblem] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customPeas, setCustomPeas] = useState<PEAS>({
    performance: "",
    environment: "",
    actuators: "",
    sensors: ""
  });
  const [customNodeEnv, setCustomNodeEnv] = useState("");
  const [customNodeSensors, setCustomNodeSensors] = useState("");
  const [customNodeProc, setCustomNodeProc] = useState("");
  const [customNodeAct, setCustomNodeAct] = useState("");

  // Current active agent details
  const [activeAgent, setActiveAgent] = useState<AgentTemplate>(AGENT_TEMPLATES[0]);

  // Academic Info for formatting deliverables
  const [dupla, setDupla] = useState<DuplaInfo>({
    student1: "",
    student2: "",
    course: "Mineração de Dados e Inteligência Artificial",
    institution: "Faculdade de Tecnologia / Universidade",
    professor: "Prof. Dr. Roberto Assis Magalhães",
    date: "22/05/2026"
  });

  // Current Input & Simulation results
  const [inputData, setInputData] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: Idle, 1: Reading, 2: Thinking, 3: Acting, 4: Finished
  const [simulationHistory, setSimulationHistory] = useState<Array<{
    timestamp: string;
    agentName: string;
    input: string;
    result: SimulationResult;
  }>>([]);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Load configuration to check for Gemini API key
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasApiKey);
      })
      .catch((err) => {
        console.error("Erro ao verificar configuração de API:", err);
        setHasApiKey(false);
      });
  }, []);

  // Update dynamic fields when active agent changes
  useEffect(() => {
    const current = templates.find((t) => t.id === selectedAgentId);
    if (current) {
      setActiveAgent(current);
      setInputData(current.defaultInputs[0] || "");
      setSimulationResult(null);
      setActiveStep(0);
    }
  }, [selectedAgentId, templates]);

  // Handle preset input click
  const handleSelectPresetInput = (text: string) => {
    setInputData(text);
    setSimulationResult(null);
    setActiveStep(0);
    showNotice("Entrada de exemplo de sensor carregada!", "info");
  };

  const showNotice = (message: string, type: "success" | "info" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Run the Simulation (calls backend, or does extremely smart fallback simulation if offline)
  const handleSimulate = async () => {
    if (!inputData.trim()) {
      showNotice("Por favor, preencha as entradas dos sensores para simular.", "error");
      return;
    }

    setIsSimulating(true);
    setSimulationResult(null);
    
    // Step-by-step visual animation trigger
    setActiveStep(1); // Sensors reading
    await delay(1200);
    
    setActiveStep(2); // Brain thinking
    await delay(1500);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentName: activeAgent.name,
          problem: activeAgent.problem,
          peas: activeAgent.peas,
          inputData: inputData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSimulationResult(data.simulation);
        setActiveStep(3); // Acting
        await delay(1200);
        setActiveStep(4); // Completed

        // Add to history
        setSimulationHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            agentName: activeAgent.name,
            input: inputData,
            result: data.simulation
          },
          ...prev
        ]);
        showNotice("Ciclo cognitivo do agente executado com o Gemini!", "success");
      } else {
        throw new Error(data.error || "Erro de API");
      }
    } catch (err: any) {
      console.warn("Simulação via API falhou (usarei fallback inteligente sem chave API):", err);
      
      // Fallback Engine: Generates highly customized simulations using the current PEAS guidelines
      const fallbackResult = generateSmartFallback(activeAgent, inputData);
      
      setSimulationResult(fallbackResult);
      setActiveStep(3); // Acting
      await delay(1200);
      setActiveStep(4); // Completed

      setSimulationHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          agentName: activeAgent.name,
          input: inputData,
          result: fallbackResult
        },
        ...prev
      ]);
      showNotice("Simulação executada via Processamento Convencional Local.", "info");
    } finally {
      setIsSimulating(false);
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // High quality offline simulator that dynamically merges input contents with PEAS structure
  const generateSmartFallback = (agent: AgentTemplate, input: string): SimulationResult => {
    const defaultSteps = [
      `1. Filtro Sensorial: Processando o sinal bruto de entrada "${input.substring(0, 50)}..." através da malha de sensores [${agent.peas.sensors.split(",")[0] || "Sensores Dedicados"}] e normalizando os dados ruidosos.`,
      `2. Validação contra Métricas de PEAS: Analisando se os parâmetros ultrapassam os limites estipulados para o ambiente operacional [${agent.peas.environment.split(",")[0]}].`,
      `3. Raciocínio Baseado em Regras e Objetivos: Mapeando condições críticas para maximizar o Desempenho de "${agent.peas.performance.substring(0, 60)}...".`,
      `4. Geração de Comando Autônomo: Definindo a instrução operacional ideal calculando impactos colaterais no sistema.`
    ];

    let decision = `Iniciar protocolo de contingência e despacho otimizado de ações corretivas.`;
    let action = `Enviar sinal elétrico/digital focado na mitigação dos sintomas informados no painel geral.`;
    let effect = `Otimização direta das métricas do PEAS, protegendo a segurança de uso do ambiente.`;
    let change = `Redução da latência de tratamento operacional e normalização acústica/térmica/física do ambiente de simulação.`;

    // Dynamic customization based on keywords
    const inputUpper = input.toUpperCase();
    if (agent.id === "hospitalar") {
      if (inputUpper.includes("DOR RETROESTERNAL") || inputUpper.includes("CORAÇÃO") || inputUpper.includes("PRESSÃO") || inputUpper.includes("APERTO")) {
        decision = "Prioridade Máxima (VERMELHA - Emergência Imediata) via Protocolo de Manchester.";
        action = "Ativando painel de emergência luminosa na ala de choque, notificando bleep/pager do cardiologista plantonista e transferindo pré-prontuário para a sala vermelha.";
        effect = "Remoção imediata de gargalos de triagem de risco de infarto, reduzindo o tempo de atendimento essencial porta-balão de 60 minutos para menos de 5 minutos.";
        change = "Paciente deslocado do saguão comum para a área assistida de alta complexidade médica.";
      } else if (inputUpper.includes("FEBRE") || inputUpper.includes("CRIANÇA")) {
        decision = "Prioridade Moderada (VERDE / AMARELO - Pouco urgente ou Urgência Menor).";
        action = "Sinalizar cor Amarela no monitor de chamadas virtuais, direcionando a ficha da criança para o pediatra clínico e emitindo lembrete de antitérmico no cadastro.";
        effect = "Acurácia no gerenciamento de frentes simultâneas de pronto-socorro para evitar superlotação por queixas ambulatoriais leves.";
        change = "Painel atualizado e responsável clínico alertado sobre o caso infantil estável.";
      } else {
        decision = "Prioridade Verde (Não urgente) - Encaminhamento para atendimento padrão ordenado.";
        action = "Designação da pulseira de identificação Verde, gerando fila sequencial comum de consultório geral.";
        effect = "Preservação de recursos médicos para os casos mais severos classificados correlatamente.";
        change = "Paciente de baixa aclamação monitorado em repouso pós-atendimento primário.";
      }
    } else if (agent.id === "escolar") {
      if (inputUpper.includes("FRAÇÕES") || inputUpper.includes("DESISTO") || inputUpper.includes("ERRO")) {
        decision = "Disparar Trilha Adaptativa de Reforço Conceitual visual interativo.";
        action = "Apresentar pop-up de apoio com infográfico lúdico de frações usando comida (fatias de pizza), sugerir pausa de 3 minutos e enviar notificação de assistência especial sugerida ao tutor humano.";
        effect = "Combate à desmotivação imediata e preenchimento de lacunas de base matemática crítica antes do avanço do aluno.";
        change = "Plataforma LMS atualizada com novos exercícios conceituais e nível de engajamento do discente protegido.";
      } else if (inputUpper.includes("DEDICADA") || inputUpper.includes("ÁLGEBRA") || inputUpper.includes("ÁPICE")) {
        decision = "Promover para Trilha de Enriquecimento e Desafios Avançados.";
        action = "Desbloquear módulo opcional de Topologia Computacional, fornecer link de e-books avançados da biblioteca e enviar parabéns motivacional automático.";
        effect = "Maximização de engajamento intelectual para perfis de alta velocidade acadêmica.";
        change = "Status pedagógico do aluno atualizado para 'Avançado' com desbloqueio de novas trilhas opcionais.";
      }
    } else if (agent.id === "transito") {
      if (inputUpper.includes("AMBULÂNCIA") || inputUpper.includes("BOMBEIROS") || inputUpper.includes("RESGATE")) {
        decision = "Ciclo Emergencial de Prioridade Verde Absoluta para o corredor do resgate.";
        action = "Fechar semáforo Norte-Sul no vermelho absoluto em 2 segundos e abrir onda verde na Via Leste-Oeste, emitindo alerta sonoro auxiliar para pedestres circundantes.";
        effect = "Garantia de segurança de via de transporte médico prioritário com tempo de resposta de socorro otimizado.";
        change = "Cruzamento totalmente desobstruído para passagem do veículo de urgência em alta velocidade.";
      } else if (inputUpper.includes("NORTE-SUL") || inputUpper.includes("CONGESTIONAMENTO")) {
        decision = "Ajustar ciclo de passagem com acréscimo de 30 segundos de verde para a via saturada.";
        action = "Alteração instantânea do temporizador elétrico do semáforo da Via Norte-Sul, estendendo a fase verde ativa e mantendo a via deserta no vermelho dinâmico.";
        effect = "Redução imediata do comprimento de fila de veículos represados em cruzamentos fantasma.";
        change = "Trânsito normalizado na via principal e liberação gradual de 32 veículos estáticos.";
      }
    } else if (agent.id === "manutencao") {
      if (inputUpper.includes("TEMPERATURA") || inputUpper.includes("VIBRAÇÃO") || inputUpper.includes("84°C") || inputUpper.includes("ANÔMALA")) {
        decision = "Sinalizar Anomalia Crítica de Rolamento (Estágio de Degradação 3).";
        action = "Abrir Ordem de Serviço de nível Crítico no módulo SAP do gestor de mecânica, modular redução preventiva de RPM da bomba em 25% para evitar engripamento térmico e acender luz vermelha no painel industrial.";
        effect = "Prevenção de quebras catastróficas inesperadas, salvando maquinários de alto custo e evitando paradas forçadas de linha de refino.";
        change = "Máquina operando em modo de segurança controlado com plano de inspeção preditiva agendado de emergência.";
      }
    }

    return {
      perceptionDetails: `Sinais capturados e higienizados. Os sensores de [${agent.peas.sensors}] leram os parâmetros fundamentais. Entrada limpa de ruídos térmicos e oscilados.`,
      reasoningSteps: defaultSteps,
      decisionMade: decision,
      actuatorAction: action,
      peasImpact: {
        performanceEffect: effect,
        environmentChange: change
      }
    };
  };

  // Create Custom Agent
  const handleCreateCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customProblem.trim() || !customPeas.performance.trim() || !customPeas.sensors.trim()) {
      showNotice("Por favor, preencha os campos obrigatórios (*).", "error");
      return;
    }

    const uniqueId = "custom_" + Date.now();
    const newAgent: AgentTemplate = {
      id: uniqueId,
      name: customName,
      category: customCategory,
      problem: customProblem,
      description: customDescription || `Agente inteligente desenvolvido conceitualmente para resolver o problema de: ${customProblem}`,
      peas: {
        performance: customPeas.performance,
        environment: customPeas.environment || "Ambiente geral de controle",
        actuators: customPeas.actuators || "Interfaces de alerta e controle web",
        sensors: customPeas.sensors
      },
      inputLabel: "Dados do Sensor / Eventos Ambientais",
      inputPlaceholder: "Digite dados ou métricas do sensor como o agente captaria do ambiente de operação...",
      defaultInputs: [
        "Exemplo de Telemetria de Entrada 1: Parâmetros operando sob variação padrão de teste no ambiente.",
        "Exemplo de Feedback crítico ou sinal inesperado captado na rede do sistema."
      ],
      flowchartNodes: {
        environment: customNodeEnv || "Ambiente Operacional",
        sensors: customNodeSensors || "Sensores IoT de Captura",
        processing: customNodeProc || "Mapeamento e Decisão Cognitiva (LLM)",
        actuators: customNodeAct || "Atuadores Física/Lógica"
      }
    };

    setTemplates((prev) => [...prev, newAgent]);
    setSelectedAgentId(uniqueId);
    setIsCreatingCustom(false);
    showNotice(`Agente "${customName}" criado e selecionado com sucesso!`, "success");

    // Reset Form
    setCustomName("");
    setCustomProblem("");
    setCustomDescription("");
    setCustomPeas({ performance: "", environment: "", actuators: "", sensors: "" });
    setCustomNodeEnv("");
    setCustomNodeSensors("");
    setCustomNodeProc("");
    setCustomNodeAct("");
  };

  // Remove created custom agent
  const handleRemoveAgent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja realmente remover este agente customizado?")) {
      const idx = templates.findIndex((t) => t.id === id);
      const filtered = templates.filter((t) => t.id !== id);
      setTemplates(filtered);
      showNotice("Agente customizado removido.", "info");

      // Switch to first remaining
      if (selectedAgentId === id) {
        setSelectedAgentId(filtered[0]?.id || "hospitalar");
      }
    }
  };

  // Print Page or trigger visual download
  const handlePrint = () => {
    window.print();
  };

  const getStepStatusClass = (step: number) => {
    if (activeStep === 0) return "bg-slate-100 text-slate-400 border-slate-200";
    if (activeStep === step) return "bg-indigo-50 text-indigo-600 border-indigo-300 ring-2 ring-indigo-100 animate-pulse font-semibold";
    if (activeStep > step) return "bg-emerald-50 text-emerald-600 border-emerald-300 font-semibold";
    return "bg-slate-50 text-slate-300 border-slate-100";
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased font-sans pb-16 print:bg-white print:pb-0">
      
      {/* Dynamic Toast Notification */}
      {notification && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 border
            ${notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : ""}
            ${notification.type === "info" ? "bg-indigo-50 border-indigo-200 text-indigo-800" : ""}
            ${notification.type === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : ""}
          `}
          id="toast-notification"
        >
          {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {notification.type === "info" && <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />}
          {notification.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Primary Banner: Academic Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-400/20 uppercase tracking-wider print:border-slate-300 print:text-black">
                  Trabalho Acadêmico
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/20">
                  Entrega: 22/05/2026
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Simulador de Agente Inteligente
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl print:text-slate-600">
                Análise de PEAS, modelagem conceitual, fluxo de processamento e simulação cognitiva com Inteligência Artificial para resolução de problemas reais.
              </p>
            </div>
            
            {/* Quick Stats or Meta details */}
            <div className="flex flex-col shrink-0 bg-slate-850/50 border border-slate-700/50 p-3.5 rounded-xl text-slate-300 max-w-sm w-full md:w-auto print:border-slate-300 print:text-slate-900">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold mb-1 uppercase tracking-wide print:text-indigo-600">
                <Users className="w-3.5 h-3.5" /> Integrantes da Dupla
              </div>
              <div className="space-y-1 text-sm">
                <input 
                  type="text" 
                  placeholder="Nome do Aluno 1"
                  value={dupla.student1}
                  onChange={(e) => setDupla({...dupla, student1: e.target.value})}
                  className="bg-transparent border-b border-slate-700/60 focus:border-indigo-400 focus:outline-none w-full text-white placeholder-slate-400 py-0.5 print:text-slate-900 print:border-slate-300"
                  id="dupla-aluno1"
                />
                <input 
                  type="text" 
                  placeholder="Nome do Aluno 2 (ou individual)"
                  value={dupla.student2}
                  onChange={(e) => setDupla({...dupla, student2: e.target.value})}
                  className="bg-transparent border-b border-slate-700/60 focus:border-indigo-400 focus:outline-none w-full text-white placeholder-slate-400 py-0.5 print:text-slate-900 print:border-slate-300"
                  id="dupla-aluno2"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Info Banner about LLM / Configuration */}
        <div className="mb-6 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${hasApiKey ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              {hasApiKey ? <Brain className="w-5 h-5 animate-pulse" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                Mecanismo LLM: {hasApiKey ? "Gemini 3.5 Active" : "Processamento Local de Contingência"}
              </h3>
              <p className="text-xs text-slate-500 max-w-xl">
                {hasApiKey 
                  ? "A chave de API do Gemini foi detectada no ambiente. Suas simulações usarão raciocínio generativo real."
                  : "Nenhuma chave GEMINI_API_KEY foi setada nas variáveis ou segredos do AI Studio. Usando o motor conceitual offline baseado em regras PEAS estabelecidas (100% funcional)."
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleSelectPresetInput(activeAgent.defaultInputs[Math.floor(Math.random() * activeAgent.defaultInputs.length)])}
              className="text-xs font-semibold px-3 py-1.5 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1"
              id="btn-random-input"
            >
              <RefreshCw className="w-3 h-3" /> Gerar Nova Entrada
            </button>
            <button 
              onClick={handlePrint}
              className="text-xs font-semibold px-3 py-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors inline-flex items-center gap-1"
              id="btn-print-academic"
            >
              <FileText className="w-3.5 h-3.5" /> Modo Impressão / PDF
            </button>
          </div>
        </div>

        {/* Workspace Split Layout: Configuration vs Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
          
          {/* LEFT 5 COLS: Agent specifications & Model properties */}
          <section className="lg:col-span-5 space-y-6 print:lg:col-span-12">
            
            {/* Component: Selector & Library */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  1. Seleção do Tema / Agente
                </h2>
                {!isCreatingCustom && (
                  <button 
                    onClick={() => setIsCreatingCustom(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1 transition-all"
                    id="btn-create-custom-toggle"
                  >
                    <Plus className="w-3.5 h-3.5" /> Customizar
                  </button>
                )}
              </div>

              {/* Selector List */}
              <div className="grid grid-cols-1 gap-2">
                {templates.map((tpl) => {
                  const isSelected = tpl.id === selectedAgentId;
                  const isCustom = tpl.id.startsWith("custom_");
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setSelectedAgentId(tpl.id);
                        setIsCreatingCustom(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden group
                        ${isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-200" 
                          : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-slate-700"
                        }
                      `}
                      id={`agent-selector-${tpl.id}`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-slate-800 text-indigo-400" : "bg-white text-slate-500 border border-slate-250"} shrink-0`}>
                        {tpl.id === "hospitalar" && <Building2 className="w-4 h-4" />}
                        {tpl.id === "escolar" && <GraduationCap className="w-4 h-4" />}
                        {tpl.id === "transito" && <Car className="w-4 h-4" />}
                        {tpl.id === "manutencao" && <Settings className="w-4 h-4" />}
                        {isCustom && <Cpu className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <span className={`text-[10px] font-bold tracking-wider uppercase block mb-0.5 ${isSelected ? "text-indigo-300" : "text-slate-400"}`}>
                          {tpl.category}
                        </span>
                        <h4 className="text-sm font-semibold truncate leading-snug">{tpl.name}</h4>
                        <p className={`text-xs mt-1 truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {tpl.problem}
                        </p>
                      </div>

                      {/* Remove custom button */}
                      {isCustom && (
                        <button
                          onClick={(e) => handleRemoveAgent(tpl.id, e)}
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border transition-colors
                            ${isSelected 
                              ? "text-slate-400 hover:text-rose-450 border-slate-850 hover:bg-slate-800" 
                              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-transparent"
                            }
                          `}
                          title="Remover Agente Customizado"
                          id={`btn-remove-agent-${tpl.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <ChevronRight className={`w-3.5 h-3.5 absolute right-2 top-3 transition-transform ${isSelected ? "text-slate-400" : "text-slate-300 opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Creator Form block if true */}
              {isCreatingCustom && (
                <div className="bg-indigo-50/40 border border-indigo-150/60 rounded-xl p-4 mt-3 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Configuração do Novo Agente
                    </span>
                    <button 
                      onClick={() => setIsCreatingCustom(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                      id="btn-cancel-custom"
                    >
                      Cancelar
                    </button>
                  </div>
                  <form onSubmit={handleCreateCustomAgent} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Nome do Agente*</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Agente Autônomo de Segurança Física"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                        id="custom-name-input"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Categoria</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Segurança"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                          id="custom-category-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Sensores*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ex: Câmeras IP, PIR"
                          value={customPeas.sensors}
                          onChange={(e) => setCustomPeas({...customPeas, sensors: e.target.value})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                          id="custom-sensors-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Problema Real a Resolver*</label>
                      <textarea 
                        required
                        rows={2}
                        placeholder="Quais as dores, lacunas ou problemas reais que este agente inteligente resolve?"
                        value={customProblem}
                        onChange={(e) => setCustomProblem(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none resize-none"
                        id="custom-problem-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Métrica de Desempenho (Performance)*</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Redução de invasões em 99%, falso positivos < 1%"
                        value={customPeas.performance}
                        onChange={(e) => setCustomPeas({...customPeas, performance: e.target.value})}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                        id="custom-performance-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Ambiente</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Fábrica, Condomínio"
                          value={customPeas.environment}
                          onChange={(e) => setCustomPeas({...customPeas, environment: e.target.value})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                          id="custom-environment-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-650 uppercase mb-1">Atuadores</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Alarmes, Fechaduras"
                          value={customPeas.actuators}
                          onChange={(e) => setCustomPeas({...customPeas, actuators: e.target.value})}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                          id="custom-actuators-input"
                        />
                      </div>
                    </div>

                    <div className="border-t border-indigo-100 pt-2.5 mt-2 space-y-2">
                      <p className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider">Subtítulos do Fluxograma (Opcional)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Filtro Ambiente" 
                          value={customNodeEnv} 
                          onChange={(e) => setCustomNodeEnv(e.target.value)} 
                          className="w-full text-[11px] bg-white border border-slate-200 rounded p-1.5"
                          id="custom-node-env"
                        />
                        <input 
                          type="text" 
                          placeholder="Subtítulo Sensores" 
                          value={customNodeSensors} 
                          onChange={(e) => setCustomNodeSensors(e.target.value)} 
                          className="w-full text-[11px] bg-white border border-slate-200 rounded p-1.5"
                          id="custom-node-sensors"
                        />
                        <input 
                          type="text" 
                          placeholder="Subtítulo Processo" 
                          value={customNodeProc} 
                          onChange={(e) => setCustomNodeProc(e.target.value)} 
                          className="w-full text-[11px] bg-white border border-slate-200 rounded p-1.5"
                          id="custom-node-proc"
                        />
                        <input 
                          type="text" 
                          placeholder="Subtítulo Atuador" 
                          value={customNodeAct} 
                          onChange={(e) => setCustomNodeAct(e.target.value)} 
                          className="w-full text-[11px] bg-white border border-slate-200 rounded p-1.5"
                          id="custom-node-act"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white font-bold text-xs p-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                      id="btn-submit-custom-agent"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Agente Customizado
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Component: Current Agent Problem & Overview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Definição Operacional</span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeAgent.name}
                </h3>
              </div>

              {/* Problem block */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Problema Crítico Identificado
                </h4>
                <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                  {activeAgent.problem}
                </p>
              </div>

              {/* Agent Overview description */}
              <div className="text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Descrição da Abordagem do Agente:</span>
                <p className="leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                  "{activeAgent.description}"
                </p>
              </div>
            </div>

            {/* Component: PEAS Specification Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Network className="w-4 h-4 text-slate-600" />
                Arquitetura PEAS do Agente
              </h3>
              <p className="text-xs text-slate-500 leading-snug">
                Definição formal de propriedades de agentes de Russell & Norvig. Use isto para delimitar a inteligência.
              </p>

              {/* 2x2 Grid for PEAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Performance */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full shrink-0"></div>
                    P - Desempenho
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[50px]">
                    {activeAgent.peas.performance}
                  </p>
                </div>

                {/* Environment */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <div className="w-1.5 h-3.5 bg-sky-500 rounded-full shrink-0"></div>
                    E - Ambiente
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[50px]">
                    {activeAgent.peas.environment}
                  </p>
                </div>

                {/* Actuators */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <div className="w-1.5 h-3.5 bg-amber-500 rounded-full shrink-0"></div>
                    A - Atuadores
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[50px]">
                    {activeAgent.peas.actuators}
                  </p>
                </div>

                {/* Sensors */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <div className="w-1.5 h-3.5 bg-emerald-500 rounded-full shrink-0"></div>
                    S - Sensores
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[50px]">
                    {activeAgent.peas.sensors}
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* RIGHT 7 COLS: Simulation Terminal, Flowchart & Interactive Brain */}
          <section className="lg:col-span-7 space-y-6 print:lg:col-span-12">
            
            {/* Component: Interactive Feedback Flowchart Loop */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-indigo-500" />
                  Diagrama de Funcionamento / Loop de Feedback
                </h3>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 uppercase">
                  Conceito Russell-Norvig
                </span>
              </div>

              {/* Loop Graphic Board */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-5 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                
                {/* Background network grid styling */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

                {/* Flow Lines SVG connector (Interactive lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800" strokeWidth="2" fill="none">
                  {/* Arrow from Environment (Top) to Sensors (Right) */}
                  <path d="M 50% 50 h 120 v 70" className={`${activeStep === 1 ? "stroke-emerald-400 stroke-[3] animate-pulse" : "stroke-slate-700"}`} />
                  
                  {/* Arrow from Sensors (Right) to Cognitive Processor (Bottom) */}
                  <path d="M 50% 120 v 30 h -80 v 50" className={`${activeStep === 2 ? "stroke-indigo-400 stroke-[3] " : "stroke-slate-700"}`} />
                  
                  {/* Arrow from Cognitive Processor (Bottom) to Actuators (Left) */}
                  <path d="M 50% 200 h -120 v -70" className={`${activeStep === 3 ? "stroke-amber-400 stroke-[3]" : "stroke-slate-700"}`} />
                  
                  {/* Arrow from Actuators (Left) to Environment (Top) */}
                  <path d="M 50% 120 v -30 h 80 v -50" className={`${activeStep === 4 ? "stroke-cyan-400 stroke-[3]" : "stroke-slate-700"}`} strokeDasharray="4 4" />
                </svg>

                {/* ROW 1: Environment Node (Central Target) */}
                <div className="flex justify-center z-10">
                  <div className={`p-3.5 rounded-xl border transition-all duration-350 max-w-xs text-center
                    ${activeStep === 4 
                      ? "bg-slate-900/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-102" 
                      : "bg-slate-900/40 border-slate-850 text-slate-300"
                    }`}
                  >
                    <div className="text-[9px] font-bold tracking-wider text-indigo-400 uppercase">AMBIENTE OPERACIONAL</div>
                    <div className="font-semibold text-xs sm:text-sm mt-0.5">{activeAgent.flowchartNodes.environment}</div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">Feedback de saída altera o estado aqui</div>
                  </div>
                </div>

                {/* ROW 2: Sensors (Right) and Actuators (Left) */}
                <div className="flex items-center justify-between z-10 px-2 sm:px-6 my-4 w-full">
                  
                  {/* Node: Actuators */}
                  <div className={`p-3 rounded-xl border transition-all duration-350 max-w-[170px] sm:max-w-[190px]
                    ${activeStep === 3 
                      ? "bg-slate-900 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.25)] scale-102" 
                      : "bg-slate-900/40 border-slate-850 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-amber-400 uppercase">
                      <Settings className="w-3.5 h-3.5 rotate-45 shrink-0" /> Atuadores (SAÍDA)
                    </div>
                    <div className="font-semibold text-xs mt-1">{activeAgent.flowchartNodes.actuators}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">{activeAgent.peas.actuators}</p>
                  </div>

                  {/* Node: Sensors */}
                  <div className={`p-3 rounded-xl border transition-all duration-350 max-w-[170px] sm:max-w-[190px] text-right
                    ${activeStep === 1 
                      ? "bg-slate-900 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-102" 
                      : "bg-slate-900/40 border-slate-850 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold tracking-wider text-emerald-400 uppercase">
                      Sensores (ENTRADA) <Cpu className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div className="font-semibold text-xs mt-1">{activeAgent.flowchartNodes.sensors}</div>
                    <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2">{activeAgent.peas.sensors}</p>
                  </div>

                </div>

                {/* ROW 3: Central Cognitive Processor Node */}
                <div className="flex justify-center z-10">
                  <div className={`p-4 rounded-xl border transition-all duration-350 text-center max-w-sm w-full
                    ${activeStep === 2 
                      ? "bg-slate-900 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-1 ring-indigo-500/20" 
                      : "bg-slate-900/60 border-slate-850 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold tracking-wider text-indigo-400 uppercase mb-0.5">
                      <Brain className={`w-4 h-4 ${activeStep === 2 ? "animate-bounce" : ""}`} /> 
                      Mecanismo de Decisão (PROCESSAMENTO)
                    </div>
                    <div className="font-bold text-xs sm:text-sm mt-0.5">{activeAgent.flowchartNodes.processing}</div>
                    
                    <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/40 py-1.5 px-2 rounded border border-slate-850 flex items-center justify-center gap-1">
                      <span>Status do Mecanismo:</span>
                      {activeStep === 0 && <span className="text-slate-500 font-medium">Aguardando telemetria...</span>}
                      {activeStep === 1 && <span className="text-emerald-400 font-semibold animate-pulse">Capturando sinais de sensores...</span>}
                      {activeStep === 2 && <span className="text-indigo-400 font-semibold animate-pulse">Raciocinando cognitivamente (LLM)...</span>}
                      {activeStep === 3 && <span className="text-amber-400 font-semibold animate-pulse">Enviando comandos para Atuadores...</span>}
                      {activeStep === 4 && <span className="text-cyan-400 font-semibold">Ciclo completo executado v4.1</span>}
                    </div>
                  </div>
                </div>

                {/* Simulation indicator steps bar */}
                <div className="mt-4 pt-4 border-t border-slate-900 flex justify-between gap-1 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeStep >= 1 ? "bg-emerald-400" : "bg-slate-800"}`} />
                    <span className={activeStep >= 1 ? "text-slate-200" : "text-slate-500"}>Sinal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeStep >= 2 ? "bg-indigo-400" : "bg-slate-800"}`} />
                    <span className={activeStep >= 2 ? "text-slate-200" : "text-slate-500"}>Razão</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeStep >= 3 ? "bg-amber-400" : "bg-slate-800"}`} />
                    <span className={activeStep >= 3 ? "text-slate-200" : "text-slate-500"}>Ação</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeStep >= 4 ? "bg-cyan-400" : "bg-slate-800"}`} />
                    <span className={activeStep >= 4 ? "text-slate-200" : "text-slate-500"}>Impacto</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Component: Interactive Input Terminal & Simulation triggers */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-slate-600" />
                2. Teste e Simulação em Tempo Real
              </h3>

              {/* Selector presets of text */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Escolha uma Telemetria de Exemplo:</span>
                <div className="grid grid-cols-1 gap-2">
                  {activeAgent.defaultInputs.map((inputOption, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPresetInput(inputOption)}
                      className={`text-left text-xs p-2.5 rounded-lg border transition-colors leading-relaxed
                        ${inputData === inputOption 
                          ? "bg-indigo-50/50 border-indigo-200 text-indigo-950 font-medium shadow-xs" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650"
                        }
                      `}
                      id={`preset-input-${idx}`}
                    >
                      <span className="font-bold text-indigo-700 block text-[10px] mb-0.5 uppercase tracking-wide">Cenário {idx + 1}</span>
                      {inputOption.substring(0, 150)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Custom Textarea */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {activeAgent.inputLabel}
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-xl p-3 text-xs sm:text-sm text-slate-850 leading-relaxed transition-all focus:outline-none"
                  placeholder={activeAgent.inputPlaceholder}
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  id="sensor-input-box"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isSimulating || !inputData.trim()}
                  onClick={handleSimulate}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none
                    ${isSimulating || !inputData.trim()
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-indigo-650 hover:bg-indigo-700 hover:shadow-indigo-200/50 hover:scale-101 active:scale-98"
                    }
                  `}
                  id="btn-run-simulation"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Processando Ciclo Cognitivo...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-white shrink-0" />
                      Simular Resposta de Agente
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Component: Simulation Output Logs (Full PEAS Reaction) */}
            {(simulationResult || isSimulating) && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 animate-fade-in" id="simulation-output-panel">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="animate-ping rounded-full w-2 h-2 bg-indigo-500"></span>
                    <h3 className="text-base font-bold text-slate-900">
                      Resultado do Ciclo Cognitivo
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 rounded font-semibold px-2 py-0.5 uppercase tracking-wide">
                    SAÍDA DO AGENTE
                  </span>
                </div>

                {isSimulating && !simulationResult ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-sm text-slate-500 font-semibold tracking-wider uppercase animate-pulse">
                      {activeStep === 1 && "Sensores coletando relatórios..."}
                      {activeStep === 2 && "Cérebro processando lógica de Manchester/PEAS..."}
                      {activeStep === 3 && "Emplacando atuação no ambiente físico..."}
                    </span>
                  </div>
                ) : (
                  simulationResult && (
                    <div className="space-y-5">
                      
                      {/* Entradas / Percepção de Sinais */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          1. Entradas (Percepção do Sensor):
                        </div>
                        <p className="text-sm text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-150 leading-relaxed font-mono text-xs">
                          {simulationResult.perceptionDetails}
                        </p>
                      </div>

                      {/* Processamento / Lógica Interna */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                          <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
                          2. Processamento Cognitivo Humano/LLM:
                        </div>
                        <div className="bg-indigo-50/30 border border-indigo-100 rounded-lg p-3.5 space-y-2">
                          {simulationResult.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="flex gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                              <span className="text-indigo-600 font-extrabold select-none">•</span>
                              <p className="flex-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Decisão & Atuação / Saídas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">Comando de Decisão</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-850 leading-snug">
                            {simulationResult.decisionMade}
                          </span>
                        </div>

                        <div className="bg-amber-50/40 border border-amber-200/60 p-3 rounded-xl">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-0.5">Atuação do Atuador (Saída)</span>
                          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {simulationResult.actuatorAction}
                          </p>
                        </div>

                      </div>

                      {/* Feedback Loop on PEAS metrics */}
                      <div className="border-t border-slate-100 pt-4 space-y-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impacto do Evento nas Métricas PEAS:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          
                          <div className="bg-slate-50 p-2.5 rounded border border-slate-250 flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                            <div>
                              <strong className="text-slate-800 block text-[10px] uppercase">Retorno sobre Desempenho (Performance):</strong>
                              <span className="text-slate-650 leading-relaxed block mt-0.5">
                                {simulationResult.peasImpact.performanceEffect}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-250 flex items-start gap-2">
                            <span className="text-sky-600 mt-0.5 font-bold">↵</span>
                            <div>
                              <strong className="text-slate-800 block text-[10px] uppercase">Alteração de Estado no Ambiente (Environment):</strong>
                              <span className="text-slate-650 leading-relaxed block mt-0.5">
                                {simulationResult.peasImpact.environmentChange}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            {/* Academic History block logs */}
            {simulationHistory.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 print:hidden">
                <h4 className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
                  Histórico de Execuções Recentes
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto divide-y divide-slate-100 pr-2">
                  {simulationHistory.map((item, index) => (
                    <div key={index} className="text-xs pt-2 flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">{item.agentName}</span>
                        <p className="text-[11px] text-slate-500 italic truncate mt-0.5">"{item.input}"</p>
                        <span className="text-[10px] text-indigo-600 font-medium block mt-0.5">Decisão: {item.result.decisionMade}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>

        </div>

        {/* SECTION: ACADEMIC WORK REPORT GENERATOR - Full screen export section perfect for Turn-in */}
        <section className="mt-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Relatório Acadêmico Formatado (Atividade Completa)
                </h3>
                <p className="text-xs text-slate-500">
                  O conteúdo abaixo é formatado para entrega acadêmica do portfólio. Preencha os nomes acima para gerar as assinaturas.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md print:hidden transition-all"
              id="btn-print-work"
            >
              <Download className="w-3.5 h-3.5" /> Salvar PDF / Imprimir Relatório
            </button>
          </div>

          {/* Paper sheet preview simulation */}
          <div className="border border-slate-200/70 rounded-2xl p-6 sm:p-8 bg-slate-50/30 font-serif leading-relaxed text-slate-900 print:border-none print:bg-white print:p-0" id="academic-paper-deliverable">
            
            {/* Header / Capa */}
            <div className="text-center space-y-3.5 border-b-2 border-slate-200 pb-6 mb-6">
              <h4 className="text-sm font-bold tracking-widest text-slate-400 font-sans uppercase">
                {dupla.institution || "FACULDADE DE TECNOLOGIA E CIÊNCIAS COGNITIVAS"}
              </h4>
              <h5 className="text-[11px] font-bold text-indigo-700 tracking-wider font-sans uppercase block">
                {dupla.course || "CURSO DE SISTEMAS DE INFORMAÇÃO / ENGENHARIA DA COMPUTAÇÃO"}
              </h5>
              
              <div className="py-2">
                <h2 className="text-xl sm:text-2xl font-black font-sans text-slate-900 leading-tight">
                  PROPOSTA CONCEITUAL E SIMULAÇÃO DE AGENTE INTELIGENTE
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Atividade de Inteligência Artificial — Modelo Racional de Resolução de Problemas Reais
                </p>
              </div>

              {/* Student Metadata box inside the deliverable */}
              <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto pt-2 text-xs font-sans">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wide mb-1">DESENVOLVEDORES (DUPLA)</span>
                  <div className="space-y-0.5 text-slate-800 font-semibold text-xs sm:text-sm">
                    <p>{dupla.student1 || "____________________________________"}</p>
                    <p>{dupla.student2 || "____________________________________"}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wide mb-1">METADADOS DO TRABALHO</span>
                  <div className="space-y-0.5 text-slate-650 font-medium text-[11px] sm:text-xs">
                    <p><strong>Orientador:</strong> {dupla.professor || "Prof. Dr. Roberto Assis Magalhães"}</p>
                    <p><strong>Entrega oficial:</strong> {dupla.date || "22/05/2026"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Paper Contents */}
            <div className="space-y-6 font-serif text-xs sm:text-sm text-slate-900">
              
              {/* Seção 1 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 font-sans border-l-3 border-slate-800 pl-2 uppercase tracking-wide">
                  1. Definição do Problema Real
                </h4>
                <p className="leading-relaxed text-slate-850">
                  A presente proposta acadêmica aborda a seguinte problemática do cenário real contemporâneo:
                </p>
                <div className="bg-slate-50/70 rounded-lg p-3.5 border border-slate-200 italic text-slate-800 my-1 font-sans text-xs sm:text-sm font-medium">
                  "{activeAgent.problem}"
                </div>
                <p className="leading-relaxed text-slate-850">
                  Para mitigar este problema, projetou-se conceitualmente o modelamento do <strong>{activeAgent.name}</strong>, que utiliza inferências cognitivas inteligentes e canais de sensores de fluxo constante para modular respostas autônomas otimizadas, preenchendo as lacunas operacionais humanas correlacionadas.
                </p>
              </div>

              {/* Seção 2 */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-sm font-bold text-slate-900 font-sans border-l-3 border-slate-800 pl-2 uppercase tracking-wide">
                  2. Funcionamento do Agente & PEAS
                </h4>
                <p className="leading-relaxed text-slate-850">
                  O arquétipo do agente baseia-se na racionalidade de atuação e em sua especificação <strong>PEAS (Performance, Environment, Actuators, Sensors)</strong>. A especificação completa é detalhada a seguir:
                </p>
                
                <table className="w-full text-left border-collapse border border-slate-250 font-sans text-xs my-3 bg-white">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-800">
                      <th className="border border-slate-250 p-2.5 font-bold w-1/4">Atributo</th>
                      <th className="border border-slate-250 p-2.5 font-bold">Definição Operacional do Agente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-250 p-2.5 font-bold bg-slate-50/30">Métrica de Desempenho (P)</td>
                      <td className="border border-slate-250 p-2.5 text-slate-700 leading-relaxed">{activeAgent.peas.performance}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-250 p-2.5 font-bold bg-slate-50/30">Ambiente Operacional (E)</td>
                      <td className="border border-slate-250 p-2.5 text-slate-700 leading-relaxed">{activeAgent.peas.environment}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-250 p-2.5 font-bold bg-slate-50/30">Atuadores Físicos/Lógicos (A)</td>
                      <td className="border border-slate-250 p-2.5 text-slate-705 leading-relaxed">{activeAgent.peas.actuators}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-250 p-2.5 font-bold bg-slate-50/30">Sensores de Entrada (S)</td>
                      <td className="border border-slate-250 p-2.5 text-slate-700 leading-relaxed">{activeAgent.peas.sensors}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seção 3 */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-sm font-bold text-slate-900 font-sans border-l-3 border-slate-800 pl-2 uppercase tracking-wide">
                  3. Entradas, Processamento e Saídas
                </h4>
                <p className="leading-relaxed text-slate-850">
                  O fluxo de dados segue a arquitetura de feedback recursivo em ciclo fechado:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs my-2">
                  <div className="border border-slate-200 rounded-lg p-3 bg-white">
                    <span className="font-bold text-emerald-600 block mb-1">A. ENTRADAS (Entrada)</span>
                    <p className="text-slate-650 leading-relaxed">
                      Sinais digitais e analógicos higienizados a partir dos sensores: <strong>{activeAgent.peas.sensors}</strong>.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-white">
                    <span className="font-bold text-indigo-600 block mb-1">B. PROCESSAMENTO (Razão)</span>
                    <p className="text-slate-650 leading-relaxed">
                      Lógica interpretativa baseada no modelo <strong>{activeAgent.flowchartNodes.processing}</strong> para encontrar a ação ótima.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-white">
                    <span className="font-bold text-amber-600 block mb-1">C. SAÍDAS (Atuação)</span>
                    <p className="text-slate-650 leading-relaxed">
                      Modificação do estado do ambiente através dos atuadores digitais/físicos: <strong>{activeAgent.peas.actuators}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 4 - Se houver simulação ativa, adiciona as evidências práticas! */}
              {simulationResult && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-sans text-xs space-y-2 pb-3 shadow-inner my-4">
                  <h5 className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Anexo Acadêmico: Evidências Práticas de Simulação de Telemetria
                  </h5>
                  <p className="text-slate-600">
                    Durante a bateria diagnóstica de ensaio, o seguinte input foi apresentado e validado pela heurística cognitiva do agente:
                  </p>
                  <p className="font-mono bg-white p-2 border rounded text-slate-700 italic">" {inputData} "</p>
                  
                  <div className="space-y-1.5 text-slate-700 text-[11px] pt-1">
                    <p><strong>Decisão Heurística Formulada:</strong> {simulationResult.decisionMade}</p>
                    <p><strong>Ação imediata nos Atuadores:</strong> {simulationResult.actuatorAction}</p>
                    <p><strong>Efeito de Desempenho Medido:</strong> {simulationResult.peasImpact.performanceEffect}</p>
                  </div>
                </div>
              )}

              {/* Conclusão / Assinaturas */}
              <div className="border-t border-slate-200 pt-6 mt-8">
                <p className="text-[11px] text-slate-400 font-sans text-center">
                  Documento lavrado eletronicamente em conformidade com as diretivas curriculares da disciplina de Agentes Inteligentes.
                </p>
                <div className="flex justify-around pt-6 max-w-lg mx-auto font-sans text-[11px] sm:text-xs">
                  <div className="text-center w-5/12 border-t border-slate-350 pt-2 text-slate-600">
                    <p className="font-bold text-slate-800">{dupla.student1 || "Assinatura do Aluno 1"}</p>
                    <p>Integrante da Dupla</p>
                  </div>
                  {dupla.student2 && (
                    <div className="text-center w-5/12 border-t border-slate-350 pt-2 text-slate-600">
                      <p className="font-bold text-slate-800">{dupla.student2}</p>
                      <p>Integrante da Dupla</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
