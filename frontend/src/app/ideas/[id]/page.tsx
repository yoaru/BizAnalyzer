'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIdea } from '@/hooks/useIdeas';
import { useState, useEffect } from 'react';

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;

  const {
    idea,
    isIdeaLoading,
    startCollectionAsync,
    collectionStatus,
    refetchCollectionStatus,
    startAnalysisAsync,
    analysis,
    refetchAnalysis,
    generateReportAsync,
  } = useIdea(ideaId);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // 데이터 수집 시작
  const handleStartCollection = async () => {
    setError('');
    setIsProcessing(true);
    try {
      await startCollectionAsync();
      // 수집 상태 폴링 시작
      const pollInterval = setInterval(async () => {
        const status = await refetchCollectionStatus();
        if (status.data?.status === 'completed') {
          clearInterval(pollInterval);
          setIsProcessing(false);
        } else if (status.data?.status === 'failed') {
          clearInterval(pollInterval);
          setIsProcessing(false);
          setError('데이터 수집에 실패했습니다.');
        }
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || '데이터 수집 시작에 실패했습니다.');
      setIsProcessing(false);
    }
  };

  // 분석 시작
  const handleStartAnalysis = async () => {
    setError('');
    setIsProcessing(true);
    try {
      await startAnalysisAsync();
      // 분석 상태 폴링 시작
      const pollInterval = setInterval(async () => {
        const result = await refetchAnalysis();
        if (result.data?.status === 'completed') {
          clearInterval(pollInterval);
          setIsProcessing(false);
        } else if (result.data?.status === 'failed') {
          clearInterval(pollInterval);
          setIsProcessing(false);
          setError('분석에 실패했습니다.');
        }
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || '분석 시작에 실패했습니다.');
      setIsProcessing(false);
    }
  };

  // 보고서 생성
  const handleGenerateReport = async () => {
    setError('');
    setIsProcessing(true);
    try {
      const result = await generateReportAsync();
      router.push(`/reports/${result.report_id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || '보고서 생성에 실패했습니다.');
      setIsProcessing(false);
    }
  };

  if (isIdeaLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">아이디어를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">상태</h3>
              <p className="text-lg">{idea.status}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">등록일</h3>
              <p className="text-lg">{new Date(idea.created_at).toLocaleDateString()}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">해결하려는 문제</h3>
              <p className="text-gray-900">{idea.problem}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">목표 고객</h3>
              <p className="text-gray-900">{idea.target_customer}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">수익 모델</h3>
              <p className="text-gray-900">{idea.revenue_model}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">가치 제안</h3>
              <p className="text-gray-900">{idea.value_proposition}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">차별화 요소</h3>
              <p className="text-gray-900">{idea.differentiation}</p>
            </div>

            {idea.constraints && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">제약 사항</h3>
                <p className="text-gray-900">{idea.constraints}</p>
              </div>
            )}
          </div>
        </div>

        {/* 분석 프로세스 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">분석 프로세스</h2>

          <div className="space-y-4">
            {/* 데이터 수집 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">1. 데이터 수집</h3>
                <p className="text-sm text-gray-600">시장, 경쟁사, 고객 데이터 수집</p>
              </div>
              {idea.status === 'created' && (
                <button
                  onClick={handleStartCollection}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  수집 시작
                </button>
              )}
              {idea.status === 'collecting' && (
                <span className="text-blue-600">수집 중...</span>
              )}
            </div>

            {/* AI 분석 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">2. AI 분석</h3>
                <p className="text-sm text-gray-600">수집된 데이터 기반 종합 분석</p>
              </div>
              {idea.status === 'collecting' && collectionStatus?.status === 'completed' && (
                <button
                  onClick={handleStartAnalysis}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  분석 시작
                </button>
              )}
              {idea.status === 'analyzing' && <span className="text-blue-600">분석 중...</span>}
            </div>

            {/* 보고서 생성 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">3. 보고서 생성</h3>
                <p className="text-sm text-gray-600">종합 타당성 분석 보고서</p>
              </div>
              {analysis?.status === 'completed' && (
                <button
                  onClick={handleGenerateReport}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  보고서 생성
                </button>
              )}
            </div>
          </div>

          {/* 분석 결과 미리보기 */}
          {analysis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-4">분석 점수</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">시장성</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.market_score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">경쟁 환경</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.competition_score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">고객 수요</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysis.customer_demand_score}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">재무 건전성</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.financial_score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">실행 가능성</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.execution_score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">종합 점수</p>
                  <p className="text-2xl font-bold text-green-600">{analysis.overall_score}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
