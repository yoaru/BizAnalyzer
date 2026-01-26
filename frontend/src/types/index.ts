// API 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error_code?: string;
  message?: string;
  details?: any;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string | null;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

// 아이디어 타입
export interface Idea {
  id: string;
  title: string;
  problem: string;
  target_customer: string;
  value_proposition: string;
  revenue_model: string;
  differentiation: string;
  constraints?: string;
  status: 'created' | 'collecting' | 'analyzing' | 'completed' | 'failed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIdeaRequest {
  title: string;
  problem: string;
  target_customer: string;
  value_proposition: string;
  revenue_model: string;
  differentiation: string;
  constraints?: string;
}

export interface UpdateIdeaRequest {
  title?: string;
  problem?: string;
  target_customer?: string;
  value_proposition?: string;
  revenue_model?: string;
  differentiation?: string;
  constraints?: string;
}

// 데이터 수집 타입
export interface CollectionStatus {
  idea_id: string;
  status: 'collecting' | 'completed' | 'failed';
  tasks: string[];
  completed_tasks?: string[];
  progress?: number;
}

// 분석 결과 타입
export interface AnalysisResult {
  idea_id: string;
  market_score: number;
  competition_score: number;
  customer_demand_score: number;
  financial_score: number;
  execution_score: number;
  overall_score: number;
  status: 'analyzing' | 'completed' | 'failed';
  created_at: string;
}

// 보고서 타입
export interface Report {
  report_id: string;
  idea_id: string;
  executive_summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  market_analysis: any;
  competition_analysis: any;
  financial_analysis: any;
  risk_assessment: any;
  recommendation: 'Go' | 'No-Go' | 'Conditional';
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
}

// 검색 결과 타입
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url?: string;
  source?: string;
  relevance_score?: number;
}
