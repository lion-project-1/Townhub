/**
 * 오늘의 번개 이벤트 더미 데이터
 * 
 * [개발용 임시 데이터]
 * 추후 API 연동 시 이 파일의 데이터를 API 응답으로 교체 예정
 */

export const MOCK_TODAY_FLASH_EVENTS = [
  {
    id: 101,
    title: '오늘 저녁 번개 모임',
    category: 'FLASH',
    startAt: new Date().toISOString(), // 오늘
    endAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3시간 후
    place: '카페 모닝',
    capacity: 10,
    activeMemberCount: 5,
    description: '갑자기 모이는 번개 모임입니다',
  },
  {
    id: 102,
    title: '즉석 배드민턴',
    category: 'FLASH',
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2시간 후
    endAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4시간 후
    place: '동네 체육관',
    capacity: 8,
    activeMemberCount: 3,
    description: '지금 바로 배드민턴 치러 오세요!',
  },
];

/**
 * 오늘의 번개 이벤트 목록을 가져옵니다
 * 
 * [개발용 임시 함수]
 * 추후 API 연동 시 이 함수를 API 호출로 교체 예정
 * 
 * @returns {Array} 오늘의 번개 이벤트 배열
 */
export function getTodayFlashEvents() {
  // 오늘 날짜인 이벤트만 필터링 (더미 데이터이므로 현재는 그대로 반환)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return MOCK_TODAY_FLASH_EVENTS.filter((event) => {
    const eventDate = new Date(event.startAt);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });
}

