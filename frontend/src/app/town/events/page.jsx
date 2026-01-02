'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Search, Plus } from 'lucide-react';
import TodayFlashSection from '@/app/components/TodayFlashSection';
import EventCard from '@/app/components/EventCard';
import { getTodayFlashEvents } from '@/app/mocks/todayFlashEvents';

const CATEGORIES = ['전체', '축제', '봉사', '문화', '체육', '교육', '기타'];

const MOCK_EVENTS = [
  {
    id: 1,
    title: '동네 장터',
    category: '문화',
    date: '2025-01-25',
    time: '14:00',
    location: '중앙공원',
    participants: 23,
    maxParticipants: 50,
    description: '동네 주민들이 함께하는 벼룩시장',
  },
  {
    id: 2,
    title: '벚꽃 산책',
    category: '문화',
    date: '2025-04-10',
    time: '10:00',
    location: '한강공원',
    participants: 45,
    maxParticipants: 100,
    description: '봄맞이 벚꽃 구경 행사',
  },
  {
    id: 3,
    title: '환경 정화 활동',
    category: '봉사',
    date: '2025-02-15',
    time: '09:00',
    location: '동네 일대',
    participants: 18,
    maxParticipants: 30,
    description: '깨끗한 동네를 위한 정화 활동',
  },
  {
    id: 4,
    title: '주민 체육대회',
    category: '체육',
    date: '2025-03-20',
    time: '13:00',
    location: '동네 운동장',
    participants: 67,
    maxParticipants: 100,
    description: '이웃과 함께하는 체육대회',
  },
];

export default function EventListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 오늘의 번개 이벤트 가져오기
  // [개발용 임시 데이터] 추후 API 연동 시 이 부분을 API 호출로 교체 예정
  const todayFlashEvents = getTodayFlashEvents();

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-gray-900">이벤트</h1>
            <p className="text-gray-600">우리 동네에서 열리는 다양한 이벤트에 참여해보세요</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/town/events/calendar"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              캘린더 보기
            </Link>
            <Link
              href="/town/events/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              이벤트 만들기
            </Link>
          </div>
        </div>

        {/* 오늘의 번개 섹션 */}
        <TodayFlashSection events={todayFlashEvents} />

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이벤트 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
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
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
