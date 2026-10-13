export type CategoryKey =
  | 'coding'
  | 'research'
  | 'automation'
  | 'content'
  | 'data'
  | 'productivity'
  | 'builder';

export type StatusKey = 'FREE' | 'OSS' | 'TIER';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type MoneyPotential = 'Low' | 'Medium' | 'High';

export interface Tool {
  id: string;
  name: string;
  category: CategoryKey;
  desc: string;
  func: string;
  status: StatusKey;
  cc: boolean;
  browser: boolean;
  lowend: boolean;
  warnet: boolean | 'partial';
  vps: boolean;
  apikey: boolean;
  oss: boolean;
  github: string;
  site: string;
  pros: string;
  cons: string;
  usecase: string;
  difficulty: DifficultyLevel;
  money: MoneyPotential;
  score: number;
  verify?: boolean;
}

export type HardwareFilter = 'all' | 'w' | 'k' | 'd';

export interface PlanNode {
  id: string;
  type: 'ide' | 'langkah' | 'tool' | 'hasil' | 'risiko';
  t: string;
  note: string;
  tid?: string;
  x: number;
  y: number;
}

export interface PlanEdge {
  f: string;
  t: string;
  r?: string;
}

export interface EdgeAnalysisResult {
  v: 0 | 1 | 2; // 0: cocok (green), 1: perlu dicek (yellow), 2: sebaiknya diganti (red)
  yes: string[];
  no: string[];
  tip: string[];
}

export interface PipelinePreset {
  id: string;
  name: string;
  description: string;
  steps: {
    toolId: string;
    label: string;
    prompt: string;
  }[];
}

export interface SubscriptionItem {
  id: string;
  name: string;
  monthlyUSD: number;
  alternativeToolId: string;
  defaultChecked?: boolean;
}

export interface WorkflowStep {
  title: string;
  tool: string;
  input: string;
  output: string;
  execution: string;
  proTip: string;
  prompt: string;
}

export interface WorkflowTrack {
  id: string;
  label: string;
  title: string;
  steps: WorkflowStep[];
}
