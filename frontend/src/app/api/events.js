import { apiFetch } from "@/app/api/utils/api";

/**
 * 이벤트 목록 조회
 * @param {Object} condition - 검색 조건
 * @param {string} condition.category - 카테고리
 * @param {string} condition.status - 상태
 * @param {string} condition.keyword - 키워드
 * @param {string} condition.province - 시/도
 * @param {string} condition.city - 시/군/구
 * @param {number} page - 페이지 번호 (기본값: 0)
 */
export async function getEventList(condition = {}, page = 0) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", 6);

  if (condition.category && condition.category !== "전체") {
    params.append("category", condition.category);
  }
  if (condition.status && condition.status !== "전체") {
    params.append("status", condition.status);
  }
  if (condition.keyword) {
    params.append("keyword", condition.keyword);
  }
  if (condition.province) {
    params.append("province", condition.province);
  }
  if (condition.city) {
    params.append("city", condition.city);
  }

  return await apiFetch(`/api/events?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 번개 이벤트 목록 조회
 * @param {Object} condition - 검색 조건
 * @param {number} page - 페이지 번호 (기본값: 0)
 */
export async function getFlashEventList(condition = {}, page = 0) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", 3);

  if (condition.keyword) {
    params.append("keyword", condition.keyword);
  }
  if (condition.province) {
    params.append("province", condition.province);
  }
  if (condition.city) {
    params.append("city", condition.city);
  }

  return await apiFetch(`/api/events/flash?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 이벤트 캘린더 조회
 * @param {Object} condition - 검색 조건
 * @param {string} condition.from - 시작 날짜 (YYYY-MM-DD)
 * @param {string} condition.to - 종료 날짜 (YYYY-MM-DD)
 * @param {string} condition.province - 시/도
 * @param {string} condition.city - 시/군/구
 */
export async function getEventCalendar(condition) {
  const params = new URLSearchParams();

  if (condition.from) {
    params.append("from", condition.from);
  }
  if (condition.to) {
    params.append("to", condition.to);
  }
  if (condition.province) {
    params.append("province", condition.province);
  }
  if (condition.city) {
    params.append("city", condition.city);
  }

  return await apiFetch(`/api/events/calendar?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 이벤트 상세 조회
 * @param {number|string} eventId - 이벤트 ID
 */
export async function getEventDetail(eventId) {
  return await apiFetch(`/api/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 이벤트 참여 신청
 * @param {number|string} eventId - 이벤트 ID
 * @param {Object} request - 신청 정보
 * @param {string} request.message - 신청 메시지
 */
export async function requestJoinEvent(eventId, request) {
  return await apiFetch(`/api/events/${eventId}/join-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

/**
 * 이벤트 참여 신청 취소
 * @param {number|string} eventId - 이벤트 ID
 */
export async function cancelJoinRequest(eventId) {
  return await apiFetch(`/api/events/${eventId}/join-requests`, {
    method: "DELETE",
  });
}

/**
 * 참여 신청 목록 조회 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 */
export async function getJoinRequests(eventId) {
  return await apiFetch(`/api/events/${eventId}/manage/join-requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 참여 신청 수락 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} requestId - 참여 신청 ID
 */
export async function approveJoinRequest(eventId, requestId) {
  return await apiFetch(
    `/api/events/${eventId}/manage/join-requests/${requestId}/approve`,
    {
      method: "PATCH",
    }
  );
}

/**
 * 참여 신청 거절 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} requestId - 참여 신청 ID
 */
export async function rejectJoinRequest(eventId, requestId) {
  return await apiFetch(
    `/api/events/${eventId}/manage/join-requests/${requestId}/reject`,
    {
      method: "PATCH",
    }
  );
}

/**
 * 이벤트 생성
 * @param {Object} data - 이벤트 생성 데이터
 * @param {string} data.title - 이벤트 제목
 * @param {string} data.description - 설명
 * @param {string} data.category - 카테고리 (EventCategory enum)
 * @param {number} data.locationId - 지역 ID
 * @param {string} data.eventPlace - 장소
 * @param {string} data.startAt - 시작 시간 (ISO string)
 * @param {number} data.capacity - 최대 인원
 */
export async function createEvent(data) {
  return await apiFetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * 이벤트 수정
 * @param {number|string} eventId - 이벤트 ID
 * @param {Object} data - 이벤트 수정 데이터
 * @param {string} data.title - 이벤트 제목
 * @param {string} data.description - 설명
 * @param {string} data.category - 카테고리 (EventCategory enum)
 * @param {number} data.locationId - 지역 ID
 * @param {string} data.eventPlace - 장소
 * @param {string} data.startAt - 시작 시간 (ISO string)
 * @param {number} data.capacity - 최대 인원
 */
export async function updateEvent(eventId, data) {
  return await apiFetch(`/api/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * 이벤트 삭제
 * @param {number|string} eventId - 이벤트 ID
 */
export async function deleteEvent(eventId) {
  return await apiFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
}

/**
 * 이벤트 참여자 목록 조회 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 */
export async function getEventManageMembers(eventId) {
  return await apiFetch(`/api/events/${eventId}/manage/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 이벤트 참여자 삭제 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} memberId - 멤버 ID
 */
export async function removeEventManageMember(eventId, memberId) {
  return await apiFetch(`/api/events/${eventId}/manage/members/${memberId}`, {
    method: "DELETE",
  });
}

