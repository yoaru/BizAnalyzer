// API 기본 설정
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
  },

  // 아이디어
  IDEAS: {
    LIST: '/api/v1/ideas',
    CREATE: '/api/v1/ideas',
    GET: (id: string) => `/api/v1/ideas/${id}`,
    UPDATE: (id: string) => `/api/v1/ideas/${id}`,
    DELETE: (id: string) => `/api/v1/ideas/${id}`,

    // 데이터 수집
    COLLECT: (id: string) => `/api/v1/ideas/${id}/collect`,
    COLLECT_STATUS: (id: string) => `/api/v1/ideas/${id}/collect/status`,

    // 분석
    ANALYZE: (id: string) => `/api/v1/ideas/${id}/analyze`,
    ANALYSIS: (id: string) => `/api/v1/ideas/${id}/analysis`,

    // 보고서
    REPORT: (id: string) => `/api/v1/ideas/${id}/report`,
  },

  // 보고서
  REPORTS: {
    GET: (id: string) => `/api/v1/reports/${id}`,
  },

  // 검색
  SEARCH: {
    COMPETITORS: '/api/v1/search/competitors',
    MARKET: '/api/v1/search/market',
    REVIEWS: '/api/v1/search/reviews',
    REGULATIONS: '/api/v1/search/regulations',
    TECHNOLOGY: '/api/v1/search/technology',
    PROFITABILITY: '/api/v1/search/profitability',
  },
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
