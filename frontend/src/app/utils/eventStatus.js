/**
 * 이벤트 상태에 따른 CTA 버튼 상태 계산 유틸 함수
 * 
 * @param {string} status - 이벤트 상태 (CANCELED, CLOSED, RECRUITING 등)
 * @param {number} capacity - 최대 인원
 * @param {number} memberCount - 현재 참여 인원
 * @param {boolean} ended - 종료 여부 (상세 응답에만 있음, 선택적)
 * @returns {Object} { disabled: boolean, label: string, statusBadge: string | null }
 */
export function getEventCtaState(status, capacity, memberCount, ended = false) {
  // 우선순위: CANCELED > (CLOSED or ended) > isFull > 그 외
  const isFull = capacity > 0 && memberCount >= capacity;

  // 1. CANCELED 우선
  if (status === 'CANCELED') {
    return {
      disabled: true,
      label: '취소된 이벤트',
      statusBadge: '취소',
    };
  }

  // 2. CLOSED 또는 ended
  if (status === 'CLOSED' || ended === true) {
    return {
      disabled: true,
      label: '종료된 이벤트',
      statusBadge: '종료',
    };
  }

  // 3. 마감
  if (isFull) {
    return {
      disabled: true,
      label: '마감',
      statusBadge: '마감',
    };
  }

  // 4. 그 외 (RECRUITING 등)
  return {
    disabled: false,
    label: '참여하기',
    statusBadge: null,
  };
}

