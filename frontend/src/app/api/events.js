const BASE_URL = "http://localhost:8080/api/events";

/**
 * 이벤트 목록 조회
 * @param {Object} condition - 검색 조건
 * @param {string} condition.category - 카테고리
 * @param {string} condition.status - 상태
 * @param {string} condition.keyword - 키워드
 * @param {string} condition.province - 시/도
 * @param {string} condition.city - 시/군/구
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {string} token - 인증 토큰
 */
export async function getEventList(condition = {}, page = 0, token) {
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

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("이벤트 목록 조회 실패");
  }

  return res.json();
}

/**
 * 번개 이벤트 목록 조회
 * @param {Object} condition - 검색 조건
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {string} token - 인증 토큰
 */
export async function getFlashEventList(condition = {}, page = 0, token) {
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

  const url = `${BASE_URL}/flash?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("번개 이벤트 목록 조회 실패");
  }

  return res.json();
}

/**
 * 이벤트 캘린더 조회
 * @param {Object} condition - 검색 조건
 * @param {string} condition.from - 시작 날짜 (YYYY-MM-DD)
 * @param {string} condition.to - 종료 날짜 (YYYY-MM-DD)
 * @param {string} condition.province - 시/도
 * @param {string} condition.city - 시/군/구
 * @param {string} token - 인증 토큰
 */
export async function getEventCalendar(condition, token) {
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

  const url = `${BASE_URL}/calendar?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 캘린더 조회 실패");
    error.response = { data, status: res.status };
    throw error;
  }

  return data;
}

/**
 * 이벤트 상세 조회
 * @param {number|string} eventId - 이벤트 ID
 * @param {string} token - 인증 토큰
 */
export async function getEventDetail(eventId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("이벤트 상세 조회 실패");
  }

  return res.json();
}

/**
 * 이벤트 참여 신청
 * @param {number|string} eventId - 이벤트 ID
 * @param {Object} request - 신청 정보
 * @param {string} request.message - 신청 메시지
 * @param {string} token - 인증 토큰
 */
export async function requestJoinEvent(eventId, request, token) {
  const res = await fetch(`${BASE_URL}/${eventId}/join-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(request),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 참여 신청 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 이벤트 참여 신청 취소
 * @param {number|string} eventId - 이벤트 ID
 * @param {string} token - 인증 토큰
 */
export async function cancelJoinRequest(eventId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}/join-requests`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 참여 신청 취소 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 참여 신청 목록 조회 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {string} token - 인증 토큰
 */
export async function getJoinRequests(eventId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}/manage/join-requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("참여 신청 목록 조회 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 참여 신청 수락 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} requestId - 참여 신청 ID
 * @param {string} token - 인증 토큰
 */
export async function approveJoinRequest(eventId, requestId, token) {
  const res = await fetch(
    `${BASE_URL}/${eventId}/manage/join-requests/${requestId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("참여 신청 수락 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 참여 신청 거절 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} requestId - 참여 신청 ID
 * @param {string} token - 인증 토큰
 */
export async function rejectJoinRequest(eventId, requestId, token) {
  const res = await fetch(
    `${BASE_URL}/${eventId}/manage/join-requests/${requestId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("참여 신청 거절 실패");
    error.response = { data };
    throw error;
  }

  return data;
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
 * @param {string} token - 인증 토큰
 */
export async function createEvent(data, token) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 생성 실패");
    error.response = { data: responseData };
    throw error;
  }

  return responseData;
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
 * @param {string} token - 인증 토큰
 */
export async function updateEvent(eventId, data, token) {
  const res = await fetch(`${BASE_URL}/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 수정 실패");
    error.response = { data: responseData };
    throw error;
  }

  return responseData;
}

/**
 * 이벤트 삭제
 * @param {number|string} eventId - 이벤트 ID
 * @param {string} token - 인증 토큰
 */
export async function deleteEvent(eventId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const responseData = await res.json();

  if (!res.ok) {
    const error = new Error("이벤트 삭제 실패");
    error.response = { data: responseData };
    throw error;
  }

  return responseData;
}

/**
 * 이벤트 참여자 목록 조회 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {string} token - 인증 토큰
 */
export async function getEventManageMembers(eventId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}/manage/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("멤버 목록 조회 실패");
    error.response = { data, status: res.status };
    throw error;
  }

  return data;
}

/**
 * 이벤트 참여자 삭제 (호스트 전용)
 * @param {number|string} eventId - 이벤트 ID
 * @param {number|string} memberId - 멤버 ID
 * @param {string} token - 인증 토큰
 */
export async function removeEventManageMember(eventId, memberId, token) {
  const res = await fetch(`${BASE_URL}/${eventId}/manage/members/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("멤버 삭제 실패");
    error.response = { data, status: res.status };
    throw error;
  }

  return data;
}

