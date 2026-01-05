'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Users, Plus } from 'lucide-react';
import TodayFlashSection from '@/app/components/TodayFlashSection';
import { getEventCalendar, getFlashEventList } from '@/app/api/events';
import { useTown } from '@/app/contexts/TownContext';

export default function EventCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [flashEvents, setFlashEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedTown } = useTown();
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 캘린더 이벤트 조회
  useEffect(() => {
    if (!selectedTown) return;

    const loadCalendarEvents = async () => {
      try {
        setLoading(true);

        // 현재 월의 시작일과 종료일 계산
        const from = new Date(year, month, 1);
        const to = new Date(year, month + 1, 0);

        const condition = {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          province: selectedTown.province,
          city: selectedTown.city,
        };

        const result = await getEventCalendar(condition);
        setCalendarEvents(result.data || []);
      } catch (e) {
        console.error('캘린더 이벤트 조회 실패:', e);
        setCalendarEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadCalendarEvents();
  }, [year, month, selectedTown, token]);

  // 번개 이벤트 목록 조회
  useEffect(() => {
    if (!selectedTown) return;

    const loadFlashEvents = async () => {
      try {
        const condition = {
          province: selectedTown.province,
          city: selectedTown.city,
        };

        const result = await getFlashEventList(condition, 0);
        
        const formattedEvents = (result.data?.content || []).map((event) => ({
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
      } catch (e) {
        console.error('번개 이벤트 목록 조회 실패:', e);
        setFlashEvents([]);
      }
    };

    loadFlashEvents();
  }, [selectedTown, token]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 일반 이벤트 필터링
    const regularEvents = calendarEvents.filter((event) => {
      if (!event.startAt) return false;
      const eventDate = new Date(event.startAt);
      const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
    
    // 번개 이벤트 필터링
    const flashEventsForDate = flashEvents.filter((event) => {
      if (!event.startAt) return false;
      const eventDate = new Date(event.startAt);
      const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
    
    // 일반 이벤트와 번개 이벤트 합치기
    return [...regularEvents, ...flashEventsForDate];
  };

  const monthName = currentDate.toLocaleString('ko-KR', { month: 'long' });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-gray-900">이벤트 캘린더</h1>
            <p className="text-gray-600">한눈에 보는 동네 이벤트</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/town/events"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              목록 보기
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
        <TodayFlashSection events={flashEvents} />

        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-gray-900">
              {year}년 {monthName}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const events = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border border-gray-200 rounded-lg p-2 ${
                    isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`text-sm mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => {
                      const isFlash = event.category === 'FLASH';
                      return (
                        <Link
                          key={event.id}
                          href={`/town/events/${event.id}`}
                          className={`block text-xs px-1.5 py-0.5 rounded truncate ${
                            isFlash
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {event.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="mb-6 text-gray-900">다가오는 이벤트</h2>
          {loading && (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          )}
          {!loading && (() => {
            // 오늘 날짜 구하기 (시간 제외)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // 오늘 날짜에 시작하는 일반 이벤트만 필터링 (번개 제외)
            const todayEvents = calendarEvents.filter((event) => {
              if (!event.startAt) return false;
              // 번개 이벤트 제외
              if (event.category === 'FLASH') return false;
              
              const eventDate = new Date(event.startAt);
              eventDate.setHours(0, 0, 0, 0);
              
              // 오늘 날짜에 시작하는 이벤트만
              return eventDate.getTime() >= today.getTime() && eventDate.getTime() < tomorrow.getTime();
            }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

            return (
              <div className="space-y-4">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => {
                    const eventDate = new Date(event.startAt);
                    const isFlash = event.category === 'FLASH';
                    return (
                      <Link
                        key={event.id}
                        href={`/town/events/${event.id}`}
                        className={`block p-4 rounded-lg border transition-colors ${
                          isFlash
                            ? 'border-yellow-200 hover:border-yellow-500 hover:bg-yellow-50'
                            : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0 ${
                              isFlash
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                : 'bg-gradient-to-br from-green-500 to-green-600'
                            }`}
                          >
                            <div className="text-xl">{eventDate.getDate()}</div>
                            <div className="text-xs">
                              {eventDate.toLocaleString('ko-KR', { month: 'short' })}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-gray-900">{event.title}</h3>
                              {isFlash && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  번개
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{eventDate.toISOString().split('T')[0]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    다가오는 이벤트가 없습니다.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
