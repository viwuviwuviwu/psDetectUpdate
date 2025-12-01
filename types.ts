
export enum VerdictType {
  REAL = 'Real',
  AI = 'AI-Generated',
  TAMPERED = 'Tampered',
  UNCERTAIN = 'Uncertain'
}

export interface EvidencePoint {
  feature: string;
  description: string;
  reasoning: string;
  boundingBox?: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1
}

export interface AnalysisResult {
  verdict: VerdictType;
  confidence: number;
  evidence: EvidencePoint[];
  summary: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  imagePreview: string | null;
}
