'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { useEffect } from 'react';

export default function IdeasPage() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const { ideas, isIdeasLoading, deleteIdea } = useIdeas();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">내 아이디어</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/ideas/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            새 아이디어 등록
          </button>
        </div>

        {isIdeasLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : ideas && ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      idea.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : idea.status === 'analyzing'
                        ? 'bg-blue-100 text-blue-800'
                        : idea.status === 'collecting'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {idea.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{idea.problem}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/ideas/${idea.id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        deleteIdea(idea.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">등록된 아이디어가 없습니다.</p>
            <button
              onClick={() => router.push('/ideas/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 아이디어 등록하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
