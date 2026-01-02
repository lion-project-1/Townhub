'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Zap } from 'lucide-react';

/**
 * 이벤트 카드 컴포넌트
 * 일반 이벤트와 번개 이벤트 모두에서 사용
 * 
 * @param {Object} event - 이벤트 객체
 * @param {number} event.id - 이벤트 ID
 * @param {string} event.title - 이벤트 제목
 * @param {string} event.category - 이벤트 카테고리 (FLASH인 경우 번개로 처리)
 * @param {string} event.date - 날짜 (YYYY-MM-DD 형식, 일반 이벤트용)
 * @param {string} event.startAt - 시작 시간 (ISO string, 번개 이벤트용)
 * @param {string} event.time - 시간 (HH:mm 형식, 일반 이벤트용)
 * @param {string} event.location - 장소 (일반 이벤트용)
 * @param {string} event.place - 장소 (번개 이벤트용)
 * @param {number} event.participants - 참여 인원 (일반 이벤트용)
 * @param {number} event.activeMemberCount - 현재 참여 인원 (번개 이벤트용)
 * @param {number} event.maxParticipants - 최대 인원 (일반 이벤트용)
 * @param {number} event.capacity - 최대 인원 (번개 이벤트용)
 * @param {string} event.description - 설명
 */
export default function EventCard({ event }) {
  const isFlash = event.category === 'FLASH' || event.category === '번개';
  
  // 날짜 처리
  const eventDate = event.startAt ? new Date(event.startAt) : new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('ko-KR', { month: 'short' });
  
  // 시간 처리
  let displayTime = '';
  if (isFlash && event.startAt) {
    // 번개 이벤트: 시작 시간만 표시
    const time = new Date(event.startAt);
    displayTime = time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else {
    // 일반 이벤트: time 필드 사용
    displayTime = event.time || '';
  }
  
  // 날짜 표시 (메타 정보용)
  const displayDate = event.startAt
    ? eventDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    : event.date;
  
  // 장소 처리
  const location = event.place || event.location || '';
  
  // 인원 처리
  const participants = event.activeMemberCount !== undefined ? event.activeMemberCount : event.participants;
  const maxParticipants = event.capacity !== undefined ? event.capacity : event.maxParticipants;
  
  // 카테고리 배지 색상
  const getCategoryBadgeClass = () => {
    if (isFlash) {
      return 'px-3 py-1 bg-yellow-100 text-yellow-800 rounded';
    }
    return 'px-3 py-1 bg-green-100 text-green-700 rounded';
  };

  return (
    <Link
      href={`/town/events/${event.id}`}
      className="block bg-white rounded-xl border border-gray-200 px-7 py-7 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-6">
        {/* Date Badge */}
        <div
          className={`flex-shrink-0 w-20 aspect-square rounded-lg flex flex-col items-center justify-center text-white ${
            isFlash
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}
        >
          <div className="text-2xl">{day}</div>
          <div className="text-xs">{month}</div>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1.5 gap-2">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h2>
            <span className={`${getCategoryBadgeClass()} flex-shrink-0`}>
              {isFlash ? (
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  번개
                </span>
              ) : (
                <span>{event.category}</span>
              )}
            </span>
          </div>
          {event.description && (
            <p className="text-gray-600 mb-3 line-clamp-1 text-sm leading-tight">{event.description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 leading-tight">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{displayDate}</span>
            </div>
            {displayTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{displayTime}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {(participants !== undefined || maxParticipants !== undefined) && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>
                  {participants !== undefined && maxParticipants !== undefined
                    ? `${participants}/${maxParticipants}명`
                    : maxParticipants !== undefined
                    ? `${maxParticipants}명`
                    : `${participants}명`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

