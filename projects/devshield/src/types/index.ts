export type Plan = 'free' | 'premium' | 'enterprise';

export type ClauseType = 'IP' | 'Payment' | 'Scope' | 'Liability';

export type Severity = 'Critical' | 'Warning' | 'Safe';

export interface AuditFinding {
  id: string;
  clauseType: ClauseType;
  severity: Severity;
  originalText: string;
  issue: string;
  suggestion: string;
}

export interface Contract {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  riskScore: number;
  createdAt: Date;
  findings: AuditFinding[];
}

export interface UserProfile {
  id: string;
  email: string;
  plan: Plan;
  credits: number;
}
