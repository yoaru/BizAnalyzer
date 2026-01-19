import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, AlertTriangle, Sparkles, Loader2, CheckCircle, BarChart3, Target, Shield, DollarSign, FileText, ArrowRight, Star, Zap, LogIn, LogOut, User } from 'lucide-react';

// ============== API 설정 ==============
const API_BASE_URL = 'http://localhost:8000/api/v1';

// API 호출 헬퍼 함수
const api = {
  // 기본 fetch 래퍼
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.');
    }
    
    return response.json();
  },
  
  // GET 요청
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  // POST 요청
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PATCH 요청
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE 요청
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// ============== 인증 API ==============
const authApi = {
  // 회원가입
  register(email, password, name) {
    return api.post('/auth/register', { email, password, name });
  },
  
  // 로그인
  login(email, password) {
    return api.post('/auth/login', { email, password });
  },
  
  // 내 정보 조회
  getMe() {
    return api.get('/auth/me');
  },
  
  // 토큰 갱신
  refresh(refreshToken) {
    return api.post('/auth/refresh', { refresh_token: refreshToken });
  },
};

// ============== 아이디어 API ==============
const ideaApi = {
  // 아이디어 생성
  create(data) {
    return api.post('/ideas', data);
  },
  
  // 아이디어 목록
  list(page = 1, pageSize = 20) {
    return api.get(`/ideas?page=${page}&page_size=${pageSize}`);
  },
  
  // 아이디어 상세
  get(ideaId) {
    return api.get(`/ideas/${ideaId}`);
  },
  
  // 데이터 수집 시작
  startCollect(ideaId) {
    return api.post(`/ideas/${ideaId}/collect`);
  },
  
  // 데이터 수집 상태 확인
  getCollectStatus(ideaId) {
    return api.get(`/ideas/${ideaId}/collect/status`);
  },
  
  // 분석 시작
  startAnalyze(ideaId) {
    return api.post(`/ideas/${ideaId}/analyze`);
  },
  
  // 분석 결과 조회
  getAnalysis(ideaId) {
    return api.get(`/ideas/${ideaId}/analysis`);
  },
  
  // 보고서 생성
  createReport(ideaId, reportType = 'basic') {
    return api.post(`/ideas/${ideaId}/report`, { report_type: reportType });
  },
};

// ============== 보고서 API ==============
const reportApi = {
  // 보고서 조회
  get(reportId) {
    return api.get(`/reports/${reportId}`);
  },
};

// ============== 상수 ==============
const INDUSTRY_OPTIONS = [
  { value: '', label: '산업 분야 선택' },
  { value: 'tech', label: '기술/IT' },
  { value: 'healthcare', label: '헬스케어/의료' },
  { value: 'fintech', label: '핀테크/금융' },
  { value: 'ecommerce', label: '이커머스/유통' },
  { value: 'education', label: '교육/에듀테크' },
  { value: 'food', label: '식품/F&B' },
  { value: 'entertainment', label: '엔터테인먼트/미디어' },
  { value: 'real_estate', label: '부동산/프롭테크' },
  { value: 'manufacturing', label: '제조/생산' },
  { value: 'other', label: '기타' }
];

const REVENUE_OPTIONS = [
  { value: '', label: '수익 모델 선택' },
  { value: 'subscription', label: '구독 모델' },
  { value: 'transaction', label: '거래 수수료' },
  { value: 'advertising', label: '광고 수익' },
  { value: 'freemium', label: '프리미엄' },
  { value: 'licensing', label: '라이센싱' },
  { value: 'saas', label: 'SaaS' },
  { value: 'marketplace', label: '마켓플레이스' },
  { value: 'other', label: '기타' }
];

const FEATURES = [
  { icon: Brain, title: 'AI 분석', description: 'GPT 기반 심층 분석', gradient: 'from-purple-500 to-indigo-600' },
  { icon: TrendingUp, title: '시장성 평가', description: 'TAM/SAM/SOM 추정', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Users, title: '경쟁 분석', description: '경쟁사 매핑 및 위협 분석', gradient: 'from-orange-500 to-amber-600' },
  { icon: AlertTriangle, title: '리스크 진단', description: '잠재적 위험 요소 도출', gradient: 'from-rose-500 to-pink-600' }
];

const LOADING_STEPS = [
  { key: 'saving', message: '아이디어 저장 중...' },
  { key: 'market_data', message: '시장 데이터 수집 중...' },
  { key: 'competitor_data', message: '경쟁사 분석 중...' },
  { key: 'customer_insights', message: '고객 인사이트 추출 중...' },
  { key: 'regulation_data', message: '규제 환경 검토 중...' },
  { key: 'technology_trend', message: '기술 트렌드 분석 중...' },
  { key: 'profitability_benchmark', message: '수익성 벤치마크 비교 중...' },
  { key: 'analyzing', message: 'AI 종합 분석 생성 중...' },
  { key: 'report', message: '보고서 생성 중...' },
];

// ============== 메인 앱 컴포넌트 ==============
export default function BizAnalyzerApp() {
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // 뷰 상태
  const [currentView, setCurrentView] = useState('home'); // home, login, register, loading, result, history
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    description: '',
    problem: '',
    targetCustomer: '',
    industry: '',
    revenueModel: '',
    differentiation: ''
  });
  
  // 로딩 상태
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingError, setLoadingError] = useState(null);
  
  // 분석 결과
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  
  // 초기 로드: 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authApi.getMe()
        .then(userData => {
          setUser(userData);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        });
    }
  }, []);

  // 로그인 처리
  const handleLogin = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('access_token', response.tokens.access_token);
      localStorage.setItem('refresh_token', response.tokens.refresh_token);
      setUser(response.user);
      setIsLoggedIn(true);
      setCurrentView('home');
    } catch (error) {
      throw error;
    }
  };

  // 회원가입 처리
  const handleRegister = async (email, password, name) => {
    try {
      const response = await authApi.register(email, password, name);
      localStorage.setItem('access_token', response.tokens.access_token);
      localStorage.setItem('refresh_token', response.tokens.refresh_token);
      setUser(response.user);
      setIsLoggedIn(true);
      setCurrentView('home');
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  // 폼 입력 처리
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ============== 핵심: 분석 실행 로직 ==============
  const handleAnalyze = async () => {
    if (!isLoggedIn) {
      setCurrentView('login');
      return;
    }

    setCurrentView('loading');
    setLoadingStep(0);
    setLoadingError(null);

    try {
      // 1단계: 아이디어 저장
      setLoadingStep(1);
      const ideaData = {
        title: formData.description.substring(0, 100),
        description: formData.description,
        problem: formData.problem,
        target_customer: formData.targetCustomer,
        industry: formData.industry || null,
        revenue_model: formData.revenueModel || null,
        differentiation: formData.differentiation || null,
        value_proposition: formData.description,
      };
      
      const ideaResponse = await ideaApi.create(ideaData);
      const ideaId = ideaResponse.idea_id;
      setCurrentIdeaId(ideaId);

      // 2단계: 데이터 수집 시작
      setLoadingStep(2);
      await ideaApi.startCollect(ideaId);

      // 3단계: 데이터 수집 상태 폴링 (시뮬레이션)
      for (let i = 3; i <= 7; i++) {
        setLoadingStep(i);
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        
        // 실제로는 여기서 수집 상태를 확인
        // const status = await ideaApi.getCollectStatus(ideaId);
        // if (status.status === 'completed') break;
      }

      // 4단계: AI 분석 시작
      setLoadingStep(8);
      await ideaApi.startAnalyze(ideaId);

      // 5단계: 분석 결과 조회
      const analysisResponse = await ideaApi.getAnalysis(ideaId);

      // 6단계: 보고서 생성
      setLoadingStep(9);
      const reportResponse = await ideaApi.createReport(ideaId);

      // 7단계: 보고서 조회
      const reportData = await reportApi.get(reportResponse.report_id);

      // 결과 변환 및 저장
      const result = transformApiResponse(analysisResponse, reportData);
      setAnalysisResult(result);
      setCurrentView('result');

    } catch (error) {
      console.error('Analysis error:', error);
      setLoadingError(error.message || '분석 중 오류가 발생했습니다.');
      
      // 에러 발생 시 3초 후 홈으로
      setTimeout(() => {
        setCurrentView('home');
        setLoadingError(null);
      }, 3000);
    }
  };

  // API 응답을 프론트엔드 형식으로 변환
  const transformApiResponse = (analysis, report) => {
    return {
      overallScore: analysis.scores?.overall_score || 0,
      marketScore: analysis.scores?.market_score || 0,
      competitionScore: analysis.scores?.competition_score || 0,
      customerDemandScore: analysis.scores?.customer_demand_score || 0,
      financialScore: analysis.scores?.financial_score || 0,
      executionScore: analysis.scores?.execution_score || 0,
      riskScore: analysis.scores?.risk_score || 0,
      recommendation: analysis.recommendation || report.recommendation || '분석 완료',
      swot: analysis.swot || report.swot || {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      },
      market: analysis.market || {
        tam: report.market_analysis?.tam || '-',
        sam: report.market_analysis?.sam || '-',
        som: report.market_analysis?.som || '-',
        cagr: report.market_analysis?.cagr || '-'
      },
      keyInsights: analysis.key_insights || report.key_insights || [],
      risks: analysis.risks || [],
      actionItems: report.action_items || [],
      executiveSummary: report.executive_summary || ''
    };
  };

  // 리셋
  const handleReset = () => {
    setCurrentView('home');
    setFormData({
      description: '',
      problem: '',
      targetCustomer: '',
      industry: '',
      revenueModel: '',
      differentiation: ''
    });
    setAnalysisResult(null);
    setCurrentIdeaId(null);
  };

  const isFormValid = formData.description && formData.problem && formData.targetCustomer && formData.industry;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">BizAnalyzer AI</span>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-400 hidden sm:block">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('login')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  로그인
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'home' && (
          <HomeView 
            formData={formData}
            onInputChange={handleInputChange}
            onAnalyze={handleAnalyze}
            isFormValid={isFormValid}
            isLoggedIn={isLoggedIn}
          />
        )}
        {currentView === 'login' && (
          <LoginView 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
            onBack={() => setCurrentView('home')}
          />
        )}
        {currentView === 'register' && (
          <RegisterView 
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
            onBack={() => setCurrentView('home')}
          />
        )}
        {currentView === 'loading' && (
          <LoadingView 
            step={loadingStep} 
            error={loadingError}
          />
        )}
        {currentView === 'result' && (
          <ResultView 
            result={analysisResult}
            formData={formData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-12 border-t border-white/5">
        <p className="text-center text-sm text-gray-500">
          본 분석 결과는 AI가 생성한 참고 자료이며, 실제 투자 및 사업 결정에는 전문가 상담을 권장합니다.
        </p>
      </footer>
    </div>
  );
}

// ============== 로그인 뷰 ==============
function LoginView({ onLogin, onSwitchToRegister, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-gray-500">계정이 없으신가요? </span>
            <button onClick={onSwitchToRegister} className="text-purple-400 hover:text-purple-300">
              회원가입
            </button>
          </div>
          
          <button
            onClick={onBack}
            className="mt-4 w-full py-2 text-gray-500 hover:text-gray-300 text-sm"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== 회원가입 뷰 ==============
function RegisterView({ onRegister, onSwitchToLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onRegister(email, password, name);
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">비밀번호 (8자 이상)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold disabled:opacity-50"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-gray-500">이미 계정이 있으신가요? </span>
            <button onClick={onSwitchToLogin} className="text-purple-400 hover:text-purple-300">
              로그인
            </button>
          </div>
          
          <button
            onClick={onBack}
            className="mt-4 w-full py-2 text-gray-500 hover:text-gray-300 text-sm"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== 홈 뷰 ==============
function HomeView({ formData, onInputChange, onAnalyze, isFormValid, isLoggedIn }) {
  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            AI 기반 사업 아이디어
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              타당성 분석
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            사업 아이디어를 입력하면 AI가 시장성, 경쟁 환경, 수익성, 리스크를 종합적으로 분석해드립니다.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            사업 아이디어 입력
          </h2>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                사업 아이디어 설명 <span className="text-purple-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="당신의 사업 아이디어를 자세히 설명해주세요. 예: AI 기반 영어 회화 튜터링 앱으로, 사용자의 실력에 맞춰 실시간 피드백을 제공합니다."
                className="w-full h-32 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Problem */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                해결하려는 문제 <span className="text-purple-400">*</span>
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) => onInputChange('problem', e.target.value)}
                placeholder="이 사업이 해결하려는 고객의 문제나 페인포인트는 무엇인가요?"
                className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Target Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                타겟 고객 <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={formData.targetCustomer}
                onChange={(e) => onInputChange('targetCustomer', e.target.value)}
                placeholder="예: 20-30대 직장인, 영어 회화 실력을 향상시키고 싶은 사람들"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Industry & Revenue Model */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  산업 분야 <span className="text-purple-400">*</span>
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => onInputChange('industry', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                >
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  수익 모델
                </label>
                <select
                  value={formData.revenueModel}
                  onChange={(e) => onInputChange('revenueModel', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                >
                  {REVENUE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Differentiation */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                경쟁 우위 / 차별화 포인트
              </label>
              <textarea
                value={formData.differentiation}
                onChange={(e) => onInputChange('differentiation', e.target.value)}
                placeholder="경쟁사 대비 어떤 차별화된 가치를 제공하나요? (선택사항)"
                className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={onAnalyze}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!isLoggedIn && '로그인 후 '}사업 타당성 분석하기
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {!isLoggedIn && (
              <p className="text-center text-sm text-gray-500">
                분석을 위해 로그인이 필요합니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== 로딩 뷰 ==============
function LoadingView({ step, error }) {
  return (
    <div className="px-6 py-24">
      <div className="max-w-md mx-auto text-center">
        {error ? (
          <>
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">오류 발생</h2>
            <p className="text-gray-400">{error}</p>
          </>
        ) : (
          <>
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">AI가 분석 중입니다</h2>
            <p className="text-gray-400 mb-8">잠시만 기다려주세요...</p>

            <div className="space-y-3">
              {LOADING_STEPS.map((item, index) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                    index < step
                      ? 'bg-green-500/10 border border-green-500/20'
                      : index === step
                      ? 'bg-purple-500/10 border border-purple-500/20'
                      : 'bg-white/[0.02] border border-white/[0.05] opacity-40'
                  }`}
                >
                  {index < step ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : index === step ? (
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${index <= step ? 'text-white' : 'text-gray-500'}`}>
                    {item.message}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============== 결과 뷰 ==============
function ResultView({ result, formData, onReset }) {
  return (
    <div className="px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
            <CheckCircle className="w-4 h-4" />
            분석 완료
          </div>
          <h1 className="text-3xl font-bold mb-2">사업 타당성 분석 결과</h1>
          <p className="text-gray-400">{formData.description.substring(0, 50)}...</p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-lg text-gray-400 mb-2">종합 평가 점수</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {result.overallScore}
                </span>
                <span className="text-2xl text-gray-500">/ 100</span>
              </div>
              <p className="text-lg mt-2 text-white">{result.recommendation}</p>
            </div>
            <div className="w-40 h-40">
              <ScoreGauge score={result.overallScore} />
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ScoreCard icon={TrendingUp} title="시장성" score={result.marketScore} color="emerald" />
          <ScoreCard icon={Users} title="경쟁 환경" score={result.competitionScore} color="orange" />
          <ScoreCard icon={Target} title="고객 수요" score={result.customerDemandScore} color="blue" />
          <ScoreCard icon={DollarSign} title="수익성" score={result.financialScore} color="yellow" />
          <ScoreCard icon={Zap} title="실행 가능성" score={result.executionScore} color="purple" />
          <ScoreCard icon={Shield} title="리스크 대응" score={result.riskScore} color="rose" />
        </div>

        {/* SWOT & Market Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* SWOT Analysis */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              SWOT 분석
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-2">강점 (S)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.strengths.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-orange-400 mb-2">약점 (W)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.weaknesses.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-400 mb-2">기회 (O)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.opportunities.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-rose-400 mb-2">위협 (T)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.threats.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              시장 규모 추정
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">TAM (전체 시장)</span>
                  <span className="text-white font-medium">{result.market.tam}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">SAM (접근 가능 시장)</span>
                  <span className="text-white font-medium">{result.market.sam}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">SOM (획득 가능 시장)</span>
                  <span className="text-white font-medium">{result.market.som}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                연평균 성장률: <span className="text-emerald-400 font-medium">{result.market.cagr}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Insights & Risks */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              핵심 인사이트
            </h3>
            <ul className="space-y-3">
              {result.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-purple-400">{index + 1}</span>
                  </div>
                  <span className="text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              주요 리스크
            </h3>
            <ul className="space-y-3">
              {result.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-rose-400">!</span>
                  </div>
                  <span className="text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Items */}
        {result.actionItems && result.actionItems.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              권장 실행 계획
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {result.actionItems.map((item, index) => (
                <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-500">{item.timeline}</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            새로운 아이디어 분석하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== 점수 카드 컴포넌트 ==============
function ScoreCard({ icon: Icon, title, score, color }) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'from-orange-500 to-amber-500 text-orange-400 bg-orange-500/10 border-orange-500/20',
    blue: 'from-blue-500 to-cyan-500 text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'from-yellow-500 to-orange-500 text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    purple: 'from-purple-500 to-indigo-500 text-purple-400 bg-purple-500/10 border-purple-500/20',
    rose: 'from-rose-500 to-pink-500 text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.split(' ').slice(2).join(' ')} border rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${classes.split(' ')[2]}`} />
          <span className="font-medium text-white">{title}</span>
        </div>
        <span className={`text-2xl font-bold ${classes.split(' ')[2]}`}>{score}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${classes.split(' ').slice(0, 2).join(' ')} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ============== 점수 게이지 컴포넌트 ==============
function ScoreGauge({ score }) {
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#a855f7';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full">
      <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      <circle
        cx="70" cy="70" r="60" fill="none"
        stroke={getColor(score)}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 70 70)"
        className="transition-all duration-1000"
      />
      <text x="70" y="75" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">
        {score}
      </text>
    </svg>
  );
}
