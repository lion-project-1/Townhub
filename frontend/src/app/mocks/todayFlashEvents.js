/**
 * 오늘의 번개 이벤트 더미 데이터
 * 
 * [개발용 임시 데이터]
 * 추후 API 연동 시 이 파일의 데이터를 API 응답으로 교체 예정
 */

/**
 * 오늘 날짜의 특정 시간으로 Date 객체 생성
 * @param {number} hours - 시간 (0-23)
 * @param {number} minutes - 분 (0-59)
 * @returns {Date} 오늘 날짜의 지정된 시간 Date 객체
 */
function getTodayAtTime(hours, minutes = 0) {
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today;
}

/**
 * 오늘의 번개 이벤트 목록을 가져옵니다
 * 
 * [개발용 임시 함수]
 * 추후 API 연동 시 이 함수를 API 호출로 교체 예정
 * 
 * @returns {Array} 오늘의 번개 이벤트 배열
 */
export function getTodayFlashEvents() {
  // 오늘 날짜로 고정된 시간의 더미 데이터 생성
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 오늘 날짜의 고정된 시간으로 이벤트 생성
  const events = [
    {
      id: 101,
      title: '오늘 저녁 번개 모임',
      category: 'FLASH',
      startAt: getTodayAtTime(19, 0).toISOString(), // 오늘 19:00
      endAt: getTodayAtTime(22, 0).toISOString(), // 오늘 22:00
      place: '카페 모닝',
      capacity: 10,
      activeMemberCount: 5,
      description: '갑자기 모이는 번개 모임입니다',
    },
    {
      id: 102,
      title: '즉석 배드민턴',
      category: 'FLASH',
      startAt: getTodayAtTime(20, 30).toISOString(), // 오늘 20:30
      endAt: getTodayAtTime(22, 30).toISOString(), // 오늘 22:30
      place: '동네 체육관',
      capacity: 8,
      activeMemberCount: 3,
      description: '지금 바로 배드민턴 치러 오세요!',
    },
  ];
  
  // 오늘 날짜인 이벤트만 필터링 (모두 오늘 날짜이므로 그대로 반환)
  return events.filter((event) => {
    const eventDate = new Date(event.startAt);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });
}


