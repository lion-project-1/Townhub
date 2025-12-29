'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getQuestions } from 'src/app/api/questions';

const CATEGORIES = ['전체', '맛집', '교통', '생활', '의료', '교육', '기타'];
const SORT_OPTIONS = ['최신순', '인기순', '미해결'];

export default function QnaListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('최신순');

  const [questions, setQuestions] = useState([]); // API 데이터 상태
  const [loading, setLoading] = useState(true);

  // 페이지 로딩 시 질문 리스트 가져오기
  useEffect(() => {
     async function fetchQuestions() {
         try {
             const data = await getQuestions();
             setQuestions(data);
         } catch (err) {
                console.error(err);
         } finally {
             setLoading(false);
         }
     }
     fetchQuestions();
  }, []);


  let filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === '인기순') {
    filteredQuestions = [...filteredQuestions].sort((a, b) => b.views - a.views);
  } else if (sortBy === '미해결') {
    filteredQuestions = filteredQuestions.filter((q) => !q.isResolved);
  }

  if (loading) {
     return <div className="text-center py-20">로딩 중...</div>;
  }


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-gray-900">Q&A</h1>
            <p className="text-gray-600">이웃들에게 궁금한 것을 물어보세요</p>
          </div>
          <Link
            href="/town/qna/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            질문하기
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="질문 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">정렬</label>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      sortBy === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Link
              key={question.id}
              href={`/town/qna/${question.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                {/* Stats */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-sm text-gray-900">{question.answers}</span>
                    <span className="text-xs text-gray-500">답변</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <h2 className="text-gray-900">{question.title}</h2>
                      {question.isResolved && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm flex-shrink-0 ml-2">
                      {question.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{question.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {question.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      조회 {question.views}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-20">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
            <Link href="/town/qna/new" className="text-blue-600 hover:underline">
              첫 질문을 남겨보세요
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
