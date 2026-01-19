import React, { useState } from 'react';
import { Brain, TrendingUp, Users, AlertTriangle, Sparkles, ChevronRight, Loader2, CheckCircle, BarChart3, Target, Shield, DollarSign, FileText, ArrowRight, Star, Zap } from 'lucide-react';

// Industry options
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

// Revenue model options
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

// Feature cards data
const FEATURES = [
  {
    icon: Brain,
    title: 'AI 분석',
    description: 'GPT 기반 심층 분석',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    icon: TrendingUp,
    title: '시장성 평가',
    description: 'TAM/SAM/SOM 추정',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Users,
    title: '경쟁 분석',
    description: '경쟁사 매핑 및 위협 분석',
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    icon: AlertTriangle,
    title: '리스크 진단',
    description: '잠재적 위험 요소 도출',
    gradient: 'from-rose-500 to-pink-600'
  }
];

// Loading messages
const LOADING_MESSAGES = [
  '시장 데이터 수집 중...',
  '경쟁사 분석 중...',
  '고객 인사이트 추출 중...',
  '규제 환경 검토 중...',
  '기술 트렌드 분석 중...',
  '수익성 벤치마크 비교 중...',
  'AI 종합 분석 생성 중...'
];

// Main App Component
export default function BizAnalyzerApp() {
  const [currentView, setCurrentView] = useState('home'); // home, loading, result
  const [formData, setFormData] = useState({
    description: '',
    problem: '',
    targetCustomer: '',
    industry: '',
    revenueModel: '',
    differentiation: ''
  });
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setCurrentView('loading');
    setLoadingStep(0);

    // Simulate loading steps
    for (let i = 0; i < LOADING_MESSAGES.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setLoadingStep(i + 1);
    }

    // Generate mock analysis result
    const result = generateAnalysisResult(formData);
    setAnalysisResult(result);
    setCurrentView('result');
  };

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
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">BizAnalyzer AI</span>
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
          />
        )}
        {currentView === 'loading' && (
          <LoadingView step={loadingStep} />
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

// Home View Component
function HomeView({ formData, onInputChange, onAnalyze, isFormValid }) {
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
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
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
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
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
              사업 타당성 분석하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading View Component
function LoadingView({ step }) {
  return (
    <div className="px-6 py-24">
      <div className="max-w-md mx-auto text-center">
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
          {LOADING_MESSAGES.map((message, index) => (
            <div
              key={index}
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
                {message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Result View Component
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
          <ScoreCard
            icon={TrendingUp}
            title="시장성"
            score={result.marketScore}
            color="emerald"
          />
          <ScoreCard
            icon={Users}
            title="경쟁 환경"
            score={result.competitionScore}
            color="orange"
          />
          <ScoreCard
            icon={Target}
            title="고객 수요"
            score={result.customerDemandScore}
            color="blue"
          />
          <ScoreCard
            icon={DollarSign}
            title="수익성"
            score={result.financialScore}
            color="yellow"
          />
          <ScoreCard
            icon={Zap}
            title="실행 가능성"
            score={result.executionScore}
            color="purple"
          />
          <ScoreCard
            icon={Shield}
            title="리스크 대응"
            score={result.riskScore}
            color="rose"
          />
        </div>

        {/* Detailed Analysis */}
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
                  {result.swot.strengths.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-orange-400 mb-2">약점 (W)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.weaknesses.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-400 mb-2">기회 (O)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.opportunities.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-rose-400 mb-2">위협 (T)</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {result.swot.threats.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
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

// Score Card Component
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

// Score Gauge Component
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
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="12"
      />
      <circle
        cx="70"
        cy="70"
        r="60"
        fill="none"
        stroke={getColor(score)}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 70 70)"
        className="transition-all duration-1000"
      />
      <text
        x="70"
        y="75"
        textAnchor="middle"
        fill="white"
        fontSize="28"
        fontWeight="bold"
      >
        {score}
      </text>
    </svg>
  );
}

// Generate mock analysis result
function generateAnalysisResult(formData) {
  const baseScore = 60 + Math.random() * 25;
  
  return {
    overallScore: Math.round(baseScore),
    marketScore: Math.round(65 + Math.random() * 25),
    competitionScore: Math.round(50 + Math.random() * 30),
    customerDemandScore: Math.round(60 + Math.random() * 25),
    financialScore: Math.round(55 + Math.random() * 30),
    executionScore: Math.round(50 + Math.random() * 35),
    riskScore: Math.round(55 + Math.random() * 30),
    recommendation: baseScore >= 70 ? '사업 추진 권장' : baseScore >= 55 ? '조건부 추진 검토' : '추가 검토 필요',
    swot: {
      strengths: [
        'AI 기술 기반 차별화',
        '명확한 타겟 시장',
        '확장 가능한 비즈니스 모델'
      ],
      weaknesses: [
        '초기 자본 투자 필요',
        '기술 의존도 높음',
        '고객 신뢰 구축 필요'
      ],
      opportunities: [
        '성장하는 시장 규모',
        '디지털 전환 트렌드',
        'B2B 확장 가능성'
      ],
      threats: [
        '대기업 진입 가능성',
        '규제 환경 변화',
        '기술 변화 속도'
      ]
    },
    market: {
      tam: '₩15조',
      sam: '₩2.5조',
      som: '₩500억',
      cagr: '12.5%'
    },
    keyInsights: [
      '타겟 시장의 디지털 전환이 가속화되고 있어 진입 시점이 적절합니다.',
      'AI 기반 서비스에 대한 소비자 수용도가 빠르게 증가하고 있습니다.',
      '구독 모델은 안정적인 수익 창출에 유리한 구조입니다.',
      '초기 고객 확보를 위한 차별화된 마케팅 전략이 필요합니다.'
    ],
    risks: [
      '기술 발전 속도에 따른 서비스 업데이트 비용 증가 가능성',
      '대기업의 유사 서비스 출시로 인한 경쟁 심화',
      '개인정보 보호 규제 강화에 따른 컴플라이언스 비용',
      '초기 고객 획득 비용(CAC)이 예상보다 높을 수 있음'
    ],
    actionItems: [
      {
        title: 'MVP 개발',
        description: '핵심 기능 중심의 최소 기능 제품 개발',
        timeline: '1-3개월'
      },
      {
        title: '베타 테스트',
        description: '초기 사용자 피드백 수집 및 제품 개선',
        timeline: '3-6개월'
      },
      {
        title: '시장 진입',
        description: '마케팅 캠페인 및 본격 서비스 런칭',
        timeline: '6-9개월'
      }
    ]
  };
}
