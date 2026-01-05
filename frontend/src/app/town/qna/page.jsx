'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getQuestions } from '@/app/api/questions';
import { useAuth } from "@/app/contexts/AuthContext";

const CATEGORIES = [
    {label: "맛집", value: "RESTAURANT"},
    {label: "의료", value: "HOSPITAL"},
    {label: "생활", value: "LIVING"},
    {label: "교통", value: "TRAFFIC"},
    {label: "교육", value: "EDUCATION"},
    {label: "주거", value: "HOUSING"},
    {label: "기타", value: "ETC"},
];


const SORT_OPTIONS = [
    {label: '최신순', value: 'createdAt,desc'},
    {label: '인기순', value: 'viewCount,desc'},
];

export default function QnaListPage() {
    const { isAuthenticated } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);


    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300); // 300ms
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // useEffect에서 API 호출 시 debouncedQuery 사용
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getQuestions({
                    page,
                    size: 10,
                    search: debouncedQuery || null,
                    category: selectedCategory === 'ALL' ? null : selectedCategory,
                    sort: sortOption,
                });
                setPageData(data);
            } catch (err) {
                console.error(err);
                setPageData({content: [], totalPages: 0, number: 0});
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [debouncedQuery, page, selectedCategory, sortOption]);


    const getCategoryLabel = (value) =>
        CATEGORIES.find(c => c.value === value)?.label ?? value;

    function formatDate(dateString) {
        if (!dateString) return "";

        return dateString
            .replace("T", " ")
            .slice(0, 16); // 2025-12-27 22:47
    }


    if (loading) {
        return <div className="text-center py-20">로딩 중...</div>;
    }



    return (
        <>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="mb-2 text-gray-900">Q&A</h1>
                        <p className="text-gray-600">이웃들에게 궁금한 것을 물어보세요</p>
                    </div>
                    {isAuthenticated && (
                        <Link
                            href="/town/qna/new"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5"/>
                            질문하기
                        </Link>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="질문 검색..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                카테고리
                            </label>
                            {/*카테고리 버튼*/}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('ALL')}
                                    className={`px-3 py-1.5 rounded-full text-sm ${
                                        selectedCategory === 'ALL'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    전체
                                </button>

                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => setSelectedCategory(category.value)}
                                        className={`px-3 py-1.5 rounded-full text-sm ${
                                            selectedCategory === category.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/*정렬 버튼*/}
                        <div className="ml-auto">
                            <label className="block text-sm text-gray-700 mb-2">정렬</label>
                            <div className="flex flex-wrap gap-2">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                            setPage(0); // 페이지 초기화
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-sm ${
                                            sortOption === option.value  // ✅ 문자열로 비교
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {pageData.content.length === 0 ? (
                        <div className="text-center py-20">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
                            {isAuthenticated && (
                                <Link href="/town/qna/new" className="text-blue-600 hover:underline">
                                    첫 질문을 남겨보세요
                                </Link>
                            )}
                        </div>
                    ) : (pageData.content.map((question) =>(
                        <Link
                            key={question.id}
                            href={`/town/qna/${question.id}`}
                            className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex gap-4">
                                {/* Stats */}
                                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className="flex flex-col items-center">
                                        <MessageCircle className="w-5 h-5 text-blue-600 mb-1"/>
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
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0"/>
                                            )}
                                        </div>
                                        <span
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm flex-shrink-0 ml-2">
                                            {getCategoryLabel(question.category)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{question.author}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4"/>
                                            {formatDate(question.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4"/>
                                            조회 {question.views}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        ))
                    )}
                </div>

                {/*{filteredQuestions.length === 0 && (
                    <div className="text-center py-20">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
                        <Link href="/town/qna/new" className="text-blue-600 hover:underline">
                            첫 질문을 남겨보세요
                        </Link>
                    </div>
                )}*/}


                {/* Pagination */}
                {pageData?.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            disabled={pageData.number === 0}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            이전
                        </button>

                        <span className="text-sm text-gray-600">
                            {pageData.number + 1} / {pageData.totalPages}
                        </span>

                        <button
                            disabled={pageData.number + 1 === pageData.totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            다음
                        </button>
                    </div>
                )}



            </div>
        </div>
        </>
    );
}
