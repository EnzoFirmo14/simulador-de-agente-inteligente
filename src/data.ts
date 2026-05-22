import { AgentTemplate } from "./types";

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "hospitalar",
    name: "Agente de Triagem Hospitalar Inteligente",
    category: "Saúde / Hospitalar",
    problem: "Demora crônica no atendimento inicial de emergências em prontos-socorros, gerando agrupamento de filas críticas e risco aumentado para pacientes urgentes não diagnosticados.",
    description: "Um agente cognitivo voltado a agilizar a triagem de prontos-socorros. Ele consome dados de sensores IoT e relatos verbais, aplicando de forma autônoma o sistema de classificação de gravidade com o objetivo de otimizar a escala de prioridades médicas.",
    peas: {
      performance: "Acurácia de triagem (consonância com o Protocolo de Manchester), redução no tempo médio de classificação de risco e priorização efetiva de casos com perigo iminente de óbito.",
      environment: "Pronto-socorro clínico, guichês de recepção de triagem, rede de dados do hospital.",
      actuators: "Atribuição de classificação de prioridade de cores (Cores de Risco) no painel eletrônico, despacho automático de alertas urgentes para pager médico de plantão, e escrita do pré-prontuário digital.",
      sensors: "Dispositivos médicos IoT conectados (oxímetro, termômetro, frequencímetro digital), terminal de autoatendimento onde o paciente lista sintomas e nível subjetivo de dor."
    },
    inputLabel: "Relato de Sintomas e Sinais Vitais (Dados de Entrada do Agente)",
    inputPlaceholder: "Insira os sintomas alegados e as medições dos sensores...",
    defaultInputs: [
      "Paciente adulto deu entrada no guichê relatando forte dor retroesternal em aperto, irradiando para o membro superior esquerdo e pescoço, acompanhada de náusea leve e sudorese fria há 15 minutos. Oxímetro de pulso indica saturação de Oxigênio em 92% e batimentos cardíacos a 115 bpm.",
      "Criança de 3 anos levada pelos pais. Apresenta febre de 38,4°C aferida pelo termômetro infravermelho há 2 horas. Está ativa, cooperativa, hidratada, respirando normalmente sem ruídos e respondeu bem ao estímulo verbal de brincadeira.",
      "Paciente jovem informa dor intensa na perna direita após sofrer pancada durante partida de futebol. Há inchaço e vermelhidão visíveis na panturrilha direita, com dificuldade moderada para apoiar o pé no chão, sem relato de febre ou falta de ar."
    ],
    flowchartNodes: {
      environment: "Pronto-Socorro & Sala de Entrada",
      sensors: "Triagem IoT & Terminal de Teclado",
      processing: "Raciocínio Clínico de Risco (Gemini Inside)",
      actuators: "Painel de Cores & Alertas de Pager"
    }
  },
  {
    id: "escolar",
    name: "Tutor & Assistente Virtual de Aprendizagem Escolar",
    category: "Educação / Virtual Escolar",
    problem: "Dificuldade em oferecer ensino personalizado para alunos com diferentes ritmos e lacunas de aprendizado em salas com alta densidade de estudantes, resultando em desmotivação acadêmica.",
    description: "Um agente inteligente que atua em ambientes virtuais de aprendizagem. Ele monitora de forma constante o desempenho e comportamento dos estudantes nas trilhas de conteúdo e intervém adaptando materiais de suporte ou agendando tutorias humanas.",
    peas: {
      performance: "Aumento no índice médio de retenção de conteúdo das disciplinas, redução das taxas de evasão escolar no sistema online de ensino e satisfação discente com as trilhas adaptadas.",
      environment: "Plataforma Virtual de Aprendizagem (LMS/Moodle), interfaces digitais de chat acadêmico, repositório interno de materiais e vídeos didáticos.",
      actuators: "Geração de rotas alternativas de exercícios personalizados, liberação de explicações animadas suplementares, alertas com relatórios de alerta preventivo para o professor, envio de feedback motivacional customizado.",
      sensors: "Tempo médio gasto em cada slide ou página de conteúdo, taxa de erro nos quizzes diagnósticos, análise semântica das postagens feitas no fórum público de dúvidas."
    },
    inputLabel: "Perfil de Atividade e Desempenho do Aluno (Dados de Entrada do Agente)",
    inputPlaceholder: "Insira a atividade recente, erros ou dúvidas deixadas pelo aluno...",
    defaultInputs: [
      "Aluno concluiu a atividade de frações equivalentes errando 6 das 8 questões propostas de forma consecutiva em sua segunda tentativa. Logo após os erros, postou no canal de ajuda: 'Desisto, nunca vou entender isso, frações são impossíveis.'",
      "Aluna dedicada completou o módulo básico e intermediário de Álgebra Linear 5 dias antes do cronograma oficial com 100% de acertos rápidos em todos os desafios. No chat de feedback, perguntou sobre indicações de livros de topologia linear aplicada.",
      "Perfil de uso de aluno indica inatividade completa na plataforma nas últimas duas semanas, não tendo visualizado nenhum dos quatro vídeos de revisão obrigatórios postados pelo tutor da matéria."
    ],
    flowchartNodes: {
      environment: "Alunos navegando na plataforma LMS",
      sensors: "Logs de acesso, tempos e histórico de acertos",
      processing: "Adaptabilidade e Pedagogia Ativa (Gemini Inside)",
      actuators: "Envio de trilha personalizada & Alerts para Professor"
    }
  },
  {
    id: "transito",
    name: "Controlador de Tráfego Urbano Adaptativo",
    category: "Infraestrutura / Cidades Inteligentes",
    problem: "Semáforos estáticos causam atrasos excessivos de veículos e aumento vertiginoso da poluição do ar devido ao tempo prolongado de carros parados em cruzamentos fantasma (vazios).",
    description: "Um agente inteligente instalado diretamente na interseção urbana. Ele percebe em tempo real o fluxo de automóveis em cada via do cruzamento através de sensores ópticos e ajusta as durações das luzes verdes de forma adaptativa para otimizar o tempo de viagem geral.",
    peas: {
      performance: "Minimização do tempo médio de retenção do cruzamento por veículo, redução da emissão evitada de CO2 por queima ociosa e garantia absoluta de prioridade total a veículos de resgate.",
      environment: "Interseções físicas de ruas urbanas, ciclo de tráfego circundante, sinalização semafórica.",
      actuators: "Controlador físico dos relés elétricos das lâmpadas semafóricas (Sinais Vermelho, Amarelo e Verde), painel eletrônico de velocidade recomendada.",
      sensors: "Sensores de laço indutivos enterrados sob as faixas de asfalto, câmeras aéreas de visão computacional contadoras de veículos por imagem, transponders GPS compartilhados de ônibus e ambulâncias próximas."
    },
    inputLabel: "Relatório de Sensores do Cruzamento (Dados de Entrada do Agente)",
    inputPlaceholder: "Descreva a contagem de veículos detectados nas faixas de tráfego...",
    defaultInputs: [
      "Via Norte-Sul apresenta congestionamento pesado com 32 veículos retidos estaticamente e fila crescendo. A via cruzada (Leste-Oeste) está totalmente vazia, sem nenhum veículo detectado nos sensores de aproximação há mais de 120 segundos.",
      "Sensores de radar captam uma Ambulância do Corpo de Bombeiros em trânsito de emergência a 250 metros do semáforo na Via Leste-Oeste em alta velocidade. No quadrante Norte-Sul, há fluxo brando de 5 automóveis comuns trafegando em ritmo normal.",
      "Cruzamento em horário de pico (18:15h). Todas as quatro vias conectadas apresentam trânsito acentuado (faixa de 15 a 20 veículos por minuto em cada). Sistema precisa manter equilíbrio de passagem e calcular sincronização de ondas verdes com os cruzamentos adjacentes."
    ],
    flowchartNodes: {
      environment: "Cruzamento Viário Urbano Físico",
      sensors: "Câmeras de Tráfego & GPS de Ônibus",
      processing: "Mecanismo Adaptativo de Tempo (Gemini Inside)",
      actuators: "Relés dos Tempos dos Semáforos e Placas de Alerta"
    }
  },
  {
    id: "manutencao",
    name: "Agente IoT de Manutenção Preditiva Industrial",
    category: "Indústria / Manutenção Preditiva",
    problem: "Falhas imprevistas em rolamentos e eixos giratórios de bombas industriais de grande porte desestabilizam linhas inteiras de produção, provocando perdas financeiras colossais e perigo operacional em refinarias.",
    description: "Um agente inteligente embarcado em sistemas industriais que analisa correlações de telemetria de vibração, temperatura e corrente de alimentação. O agente detecta anomalias sutis de assinatura acústica indicativas de fim de vida útil de componentes, emitindo alertas antes que ocorra a quebra mecânica.",
    peas: {
      performance: "Acurácia no prognóstico temporal de falha mecânica (MTBF estendido), taxa nula de falhas graves inesperadas sem alerta prévio e diminuição nos custos de reposição de peças urgentes.",
      environment: "Planta de montagem industrial, ambiente ruidoso, eixos rotativos metálicos pesados da planta.",
      actuators: "Ordens de serviço de inspeção enviadas diretamente ao software ERP / SAP corporativo, modulação automática e limitação da velocidade do motor para proteção térmica, acionamento de válvulas de segurança.",
      sensors: "Sensores de vibração ultrassônica por acelerômetros nas três direções espaciais (X, Y, Z), sensores infravermelhos de medição térmica superficial e medidores de amperagem eletromagnética do motor."
    },
    inputLabel: "Telemetria Industrial de Maquinário (Dados de Entrada do Agente)",
    inputPlaceholder: "Insira os índices de vibração, temperatura e correntes de alimentação...",
    defaultInputs: [
      "Termopar do Turboalimentador 3 aponta aumento contínuo de temperatura interna média de 58°C para 84°C nas últimas 6 horas de atividade ininterrupta. O sensor triaxial de vibração registra oscilações anômalas no plano radial X a 4.1 mm/s RMS (padrão ótimo é inferior a 1.8 mm/s).",
      "Leituras do Compressor CNC indicam funcionamento estabilizado: vibração uniforme em 1.1 mm/s RMS, temperatura de mancais a 42°C estável e taxa de consumo de corrente uniforme compatível com torque operacional padrão.",
      "Sensor acústico de ultra-alta frequência do exaustor de gases tóxicos detecta ruído sutil intermitente de alta impedância (fricção metálica esporádica) a cada 12 ciclos, acompanhado de pico de corrente elétrica na partida elétrica maior do que 30% da linha base convencional."
    ],
    flowchartNodes: {
      environment: "Planta de Motores e Turbinas Físicas",
      sensors: "Acelerômetros de Vibração & Sensores Térmicos",
      processing: "Raciocínio Diagnóstico Preditivo (Gemini Inside)",
      actuators: "Criação de O.S. no SAP & Corte de Rotação Emergencial"
    }
  }
];
