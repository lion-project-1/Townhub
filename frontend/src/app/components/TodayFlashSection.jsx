'use client';

import { Zap } from 'lucide-react';
import EventCard from '@/app/components/EventCard';

/**
 * 오늘의 번개 섹션 컴포넌트
 * 
 * @param {Array} events - 오늘의 번개 이벤트 배열
 */
export default function TodayFlashSection({ events = [] }) {
  // 이벤트가 없으면 렌더링하지 않음
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">오늘의 번개</h2>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

