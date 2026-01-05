'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, Search, Plus, ChevronLeft, ChevronRight, Loader2, Zap } from 'lucide-react';
import EventCard from '@/app/components/EventCard';
import { getEventList, getFlashEventList } from '@/app/api/events';
import { useTown } from '@/app/contexts/TownContext';

const CATEGORIES = ['전체', 'FESTIVAL', 'VOLUNTEER', 'CULTURE', 'SPORTS', 'EDUCATION', 'ETC'];

// 카테고리 한글 매핑
const CATEGORY_LABELS = {
  '전체': '전체',
  'FESTIVAL': '축제',
  'VOLUNTEER': '봉사',
  'CULTURE': '문화',
  'SPORTS': '체육',
  'EDUCATION': '교육',
  'ETC': '기타',
};

export default function EventListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 일반 이벤트 상태
  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(0);
  const [hasNextEvent, setHasNextEvent] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventLoadingMore, setEventLoadingMore] = useState(false);
  
  // 번개 이벤트 상태 - 초기값: 기본은 "없다"로 시작
  const [flashEvents, setFlashEvents] = useState([]);
  const [flashPage, setFlashPage] = useState(0);
  const [flashIsLast, setFlashIsLast] = useState(true); // 기본은 "없다"로 시작
  const [flashLoading, setFlashLoading] = useState(false);
  
  const { selectedTown } = useTown();
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
  
  // 무한 스크롤을 위한 observer ref
  const loadMoreRef = useRef(null);
  // 최신 상태를 참조하기 위한 ref
  const hasNextEventRef = useRef(hasNextEvent);
  const eventLoadingMoreRef = useRef(eventLoadingMore);
  
  // ref 동기화
  useEffect(() => {
    hasNextEventRef.current = hasNextEvent;
  }, [hasNextEvent]);
  
  useEffect(() => {
    eventLoadingMoreRef.current = eventLoadingMore;
  }, [eventLoadingMore]);

  // 일반 이벤트 목록 조회 (초기 로드 및 필터 변경 시)
  useEffect(() => {
    if (!selectedTown) return;

    const loadEvents = async () => {
      try {
        setEventLoading(true);
        setEventPage(0);

        const condition = {
          keyword: searchQuery || undefined,
          category: selectedCategory !== '전체' ? selectedCategory : undefined,
          province: selectedTown.province,
          city: selectedTown.city,
        };

        const result = await getEventList(condition, 0);
        
        // API 응답을 EventCard 형식에 맞게 변환
        const formattedEvents = (result.data?.content || []).map((event) => {
          // 디버깅 로그 (개발 모드)
          if (process.env.NODE_ENV === 'development') {
            console.log('목록 카드:', event.eventId, event.status, event.capacity, event.memberCount);
          }
          
          return {
            id: event.eventId,
            title: event.title,
            category: event.category,
            date: event.startAt ? new Date(event.startAt).toISOString().split('T')[0] : '',
            time: event.startAt ? new Date(event.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
            location: event.eventPlace,
            participants: event.memberCount || 0,
            maxParticipants: event.capacity || 0,
            description: event.description,
            startAt: event.startAt,
            createdAt: event.createdAt,
            status: event.status || null,
            // 하위 호환성을 위해 유지
            eventStatus: event.status || event.eventStatus || null,
          };
        });

        setEvents(formattedEvents);
        
        // hasNext 계산: res.data.page 기반으로 고정
        const pageInfo = result.data?.page || {};
        const currentPage = pageInfo.number ?? 0;
        const totalPages = pageInfo.totalPages ?? 0;
        const hasNext = (currentPage + 1) < totalPages;
        
        setHasNextEvent(hasNext);
      } catch (e) {
        console.error('이벤트 목록 조회 실패:', e);
        setEvents([]);
        setHasNextEvent(false);
      } finally {
        setEventLoading(false);
      }
    };

    loadEvents();
  }, [searchQuery, selectedCategory, selectedTown, token]);

  // 다음 페이지 로드 (더보기)
  const loadMoreEvents = useCallback(async () => {
    // 가드: 중복/무한 요청 방지 - 반드시 먼저 실행
    if (!selectedTown) return;
    if (eventLoadingMore) return;
    if (!hasNextEvent) return;

    try {
      setEventLoadingMore(true);
      const nextPage = eventPage + 1;

      const condition = {
        keyword: searchQuery || undefined,
        category: selectedCategory !== '전체' ? selectedCategory : undefined,
        province: selectedTown.province,
        city: selectedTown.city,
      };

      const result = await getEventList(condition, nextPage);
      
      const formattedEvents = (result.data?.content || []).map((event) => ({
        id: event.eventId,
        title: event.title,
        category: event.category,
        date: event.startAt ? new Date(event.startAt).toISOString().split('T')[0] : '',
        time: event.startAt ? new Date(event.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
        location: event.eventPlace,
        participants: event.memberCount || 0,
        maxParticipants: event.capacity || 0,
        description: event.description,
        startAt: event.startAt,
        createdAt: event.createdAt,
        status: event.status || null,
        // 하위 호환성을 위해 유지
        eventStatus: event.status || event.eventStatus || null,
      }));

      setEvents((prev) => [...prev, ...formattedEvents]);
      setEventPage(nextPage);
      
      // hasNext 계산: res.data.page 기반으로 고정
      const pageInfo = result.data?.page || {};
      const currentPage = pageInfo.number ?? nextPage;
      const totalPages = pageInfo.totalPages ?? 0;
      const hasNext = (currentPage + 1) < totalPages;
      
      setHasNextEvent(hasNext);
    } catch (e) {
      console.error('이벤트 목록 추가 조회 실패:', e);
      // 에러 발생 시에도 hasNext를 false로 설정하여 무한 요청 방지
      setHasNextEvent(false);
    } finally {
      // 반드시 로딩 상태를 false로 전환
      setEventLoadingMore(false);
    }
  }, [selectedTown, eventPage, hasNextEvent, eventLoadingMore, searchQuery, selectedCategory, token]);

  // 무한 스크롤 설정
  useEffect(() => {
    // 마지막 페이지이거나 로딩 중이면 observer 설정하지 않음
    if (!hasNextEvent || eventLoadingMore) {
      return;
    }

    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 가드: 중복 요청 방지 - 반드시 먼저 실행
        if (eventLoadingMoreRef.current) return;
        if (!hasNextEventRef.current) {
          // hasNext가 false가 되면 observer 즉시 해제
          observer.unobserve(loadMoreRef.current);
          observer.disconnect();
          return;
        }

        if (entries[0].isIntersecting) {
          loadMoreEvents();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
      observer.disconnect();
    };
  }, [hasNextEvent, eventLoadingMore, loadMoreEvents]);

  // 번개 이벤트 목록 조회
  const loadFlashEvents = useCallback(async (page = 0) => {
    if (!selectedTown) return;

    try {
      setFlashLoading(true);

      const condition = {
        province: selectedTown.province,
        city: selectedTown.city,
      };

      const result = await getFlashEventList(condition, page);
      
      const content = result.data?.content || [];
      const pageInfo = result.data?.page || {};
      
      // 안전장치: 응답이 비어있으면 기존 items 유지
      if (content.length === 0) {
        // 기존 items는 그대로 유지하고, isLast를 true로 설정하여 버튼 비활성화
        setFlashIsLast(true);
        // page는 업데이트하지 않음 (이전 페이지 유지)
      } else {
        // API 응답을 EventCard 형식에 맞게 변환
        const formattedEvents = content.map((event) => ({
          id: event.eventId,
          title: event.title,
          category: 'FLASH',
          startAt: event.startAt,
          place: event.eventPlace,
          capacity: event.capacity || 0,
          activeMemberCount: event.memberCount || 0,
          description: event.description,
          createdAt: event.createdAt,
          status: event.status || null,
          // 하위 호환성을 위해 유지
          eventStatus: event.status || event.eventStatus || null,
        }));

        setFlashEvents(formattedEvents);
        
        // 응답을 받으면 hasNext를 정확히 계산해서 갱신
        const currentPage = pageInfo.number ?? page;
        const totalPages = pageInfo.totalPages ?? 0;
        const hasNext = (currentPage + 1) < totalPages;
        const isLast = !hasNext;
        
        setFlashPage(currentPage);
        setFlashIsLast(isLast);
      }
    } catch (e) {
      console.error('번개 이벤트 목록 조회 실패:', e);
      // 에러 발생 시에도 기존 items는 유지하고, isLast를 true로 설정
      setFlashIsLast(true);
    } finally {
      // 반드시 로딩 상태를 false로 전환
      setFlashLoading(false);
    }
  }, [selectedTown, token]);

  // 번개 이벤트 초기 로드
  useEffect(() => {
    loadFlashEvents(0);
  }, [loadFlashEvents]);

  // 번개 이벤트 페이지 이동 핸들러
  const handleFlashPageChange = (direction) => {
    // 가드: 중복 요청 방지 - 반드시 먼저 실행
    if (flashLoading) return;
    
    if (direction === 'next') {
      // 오른쪽 화살표: isLast일 때 아예 호출 금지
      if (flashIsLast) return;
      loadFlashEvents(flashPage + 1);
    } else if (direction === 'prev') {
      // 왼쪽 화살표: page === 0일 때 아예 호출 금지
      if (flashPage === 0) return;
      loadFlashEvents(flashPage - 1);
    }
  };

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">오늘의 번개</h2>
            </div>
            
            {/* 번개 이벤트 페이지네이션 컨트롤 - items 유무와 관계없이 항상 렌더링 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFlashPageChange('prev')}
                disabled={flashPage === 0 || flashLoading}
                className={`p-2 rounded-lg border ${
                  flashPage === 0 || flashLoading
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {flashLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  `${flashPage + 1}`
                )}
              </span>
              <button
                onClick={() => handleFlashPageChange('next')}
                disabled={flashIsLast || flashLoading}
                className={`p-2 rounded-lg border ${
                  flashIsLast || flashLoading
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {flashLoading && flashEvents.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
            </div>
          ) : flashEvents.length > 0 ? (
            <div className="space-y-4">
              {flashEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">표시할 번개 이벤트가 없습니다.</p>
            </div>
          )}
        </div>

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
                  {CATEGORY_LABELS[category] || category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        {eventLoading && events.length === 0 && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">로딩 중...</p>
          </div>
        )}

        {!eventLoading && events.length > 0 && (
        <div className="space-y-4">
            {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        )}

        {!eventLoading && events.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 더보기 버튼 및 무한 스크롤 트리거 */}
        {!eventLoading && events.length > 0 && hasNextEvent && (
          <>
            <div ref={loadMoreRef} className="h-10" />
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreEvents}
                disabled={eventLoadingMore}
                className={`px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 ${
                  eventLoadingMore ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {eventLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>로딩 중...</span>
                  </>
                ) : (
                  <span>더보기</span>
                )}
              </button>
            </div>
          </>
        )}

        {/* 마지막 페이지 도달 시 종료 문구 */}
        {!eventLoading && !eventLoadingMore && events.length > 0 && !hasNextEvent && (
          <div className="text-center py-8">
            <p className="text-gray-500">더 이상 이벤트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
