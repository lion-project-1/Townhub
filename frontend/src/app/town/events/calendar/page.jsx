'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, Users, Plus } from 'lucide-react';

const MOCK_EVENTS = [
  {
    id: 1,
    title: '동네 장터',
    date: '2025-01-25',
    time: '14:00',
    participants: 23,
  },
  {
    id: 2,
    title: '환경 정화 활동',
    date: '2025-01-15',
    time: '09:00',
    participants: 18,
  },
  {
    id: 3,
    title: '주민 체육대회',
    date: '2025-01-20',
    time: '13:00',
    participants: 67,
  },
];

export default function EventCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return MOCK_EVENTS.filter((event) => event.date === dateStr);
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
                    {events.map((event) => (
                      <Link
                        key={event.id}
                        href={`/town/events/${event.id}`}
                        className="block text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded truncate hover:bg-green-200"
                      >
                        {event.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="mb-6 text-gray-900">다가오는 이벤트</h2>
          <div className="space-y-4">
            {MOCK_EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(
              (event) => (
                <Link
                  key={event.id}
                  href={`/town/events/${event.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
                      <div className="text-xl">{new Date(event.date).getDate()}</div>
                      <div className="text-xs">
                        {new Date(event.date).toLocaleString('ko-KR', { month: 'short' })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.participants}명 참여</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
