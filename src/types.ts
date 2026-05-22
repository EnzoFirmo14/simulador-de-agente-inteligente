export interface PEAS {
  performance: string;
  environment: string;
  actuators: string;
  sensors: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  problem: string;
  description: string;
  peas: PEAS;
  inputLabel: string;
  inputPlaceholder: string;
  defaultInputs: string[];
  flowchartNodes: {
    environment: string;
    sensors: string;
    processing: string;
    actuators: string;
  };
}

export interface SimulationResult {
  perceptionDetails: string;
  reasoningSteps: string[];
  decisionMade: string;
  actuatorAction: string;
  peasImpact: {
    performanceEffect: string;
    environmentChange: string;
  };
}

export interface SimulationResponse {
  success: boolean;
  agentName: string;
  inputRaw: string;
  simulation: SimulationResult;
}

export interface DuplaInfo {
  student1: string;
  student2: string;
  course: string;
  institution: string;
  professor: string;
  date: string;
}
