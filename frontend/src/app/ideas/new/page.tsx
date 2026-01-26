'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIdeas } from '@/hooks/useIdeas';

export default function NewIdeaPage() {
  const router = useRouter();
  const { createIdeaAsync, isCreating } = useIdeas();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem: '',
    target_customer: '',
    value_proposition: '',
    revenue_model: '',
    differentiation: '',
    constraints: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await createIdeaAsync(formData);
      router.push(`/ideas/${result.idea_id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || '아이디어 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">새 아이디어 등록</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              아이디어 제목 *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

           <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
              아이디어 개요 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
              해결하려는 문제 *
            </label>
            <textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="target_customer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              목표 고객 *
            </label>
            <input
              id="target_customer"
              name="target_customer"
              type="text"
              value={formData.target_customer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="value_proposition"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              가치 제안 *
            </label>
            <textarea
              id="value_proposition"
              name="value_proposition"
              value={formData.value_proposition}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="revenue_model"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              수익 모델 *
            </label>
            <input
              id="revenue_model"
              name="revenue_model"
              type="text"
              value={formData.revenue_model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="differentiation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              차별화 요소 *
            </label>
            <textarea
              id="differentiation"
              name="differentiation"
              value={formData.differentiation}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
              제약 사항 (선택)
            </label>
            <textarea
              id="constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
