'use client';

import { useParams, useRouter } from 'next/navigation';
import { useReport } from '@/hooks/useReport';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const { report, isReportLoading, reportError } = useReport(reportId);

  if (isReportLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">보고서 로딩 중...</p>
      </div>
    );
  }

  if (reportError || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">보고서를 불러올 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">사업 타당성 분석 보고서</h1>
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
        {/* 최종 권고사항 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">최종 권고사항</h2>
            <span
              className={`px-6 py-2 text-lg font-bold rounded-lg ${
                report.recommendation === 'Go'
                  ? 'bg-green-100 text-green-800'
                  : report.recommendation === 'No-Go'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {report.recommendation}
            </span>
          </div>
        </div>

        {/* 요약 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">요약</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{report.executive_summary}</p>
        </div>

        {/* SWOT 분석 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">SWOT 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">강점 (Strengths)</h3>
              <ul className="space-y-2">
                {report.swot.strengths.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-3">약점 (Weaknesses)</h3>
              <ul className="space-y-2">
                {report.swot.weaknesses.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">기회 (Opportunities)</h3>
              <ul className="space-y-2">
                {report.swot.opportunities.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-3">위협 (Threats)</h3>
              <ul className="space-y-2">
                {report.swot.threats.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 시장 분석 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">시장 분석</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {JSON.stringify(report.market_analysis, null, 2)}
            </pre>
          </div>
        </div>

        {/* 경쟁 분석 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">경쟁 분석</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {JSON.stringify(report.competition_analysis, null, 2)}
            </pre>
          </div>
        </div>

        {/* 재무 분석 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">재무 분석</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {JSON.stringify(report.financial_analysis, null, 2)}
            </pre>
          </div>
        </div>

        {/* 리스크 평가 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">리스크 평가</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {JSON.stringify(report.risk_assessment, null, 2)}
            </pre>
          </div>
        </div>

        {/* 보고서 정보 */}
        <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          <p>보고서 ID: {report.report_id}</p>
          <p>생성일: {new Date(report.created_at).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
}
