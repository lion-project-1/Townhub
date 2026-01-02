const BASE_URL = "http://localhost:8080/api/meetings";

export async function getMeetingList(
  { page = 0, keyword, category, status, province, city },
  token
) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", 6);

  if (keyword) params.append("keyword", keyword);
  if (category && category !== "전체") params.append("category", category);
  if (status && status !== "전체") params.append("status", status);
  if (province) params.append("province", province);
  if (city) params.append("city", city);

  const url = `${BASE_URL}?${params.toString()}`;
  console.log("REQUEST URL:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("모임 목록 조회 실패");
  }

  return res.json();
}

/**
 * 모임 상세 조회
 * @param {number|string} meetingId
 */
export async function getMeetingDetail(meetingId, token) {
  const res = await fetch(`${BASE_URL}/${meetingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("모임 상세 조회 실패");
  }

  return res.json();
}

export async function createMeeting(data, token) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("모임 생성 실패:", error);
    throw new Error("모임 생성 실패");
  }

  return res.json();
}

export async function updateMeeting(meetingId, data, token) {
  const res = await fetch(`${BASE_URL}/${meetingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("모임 수정 실패:", error);
    throw new Error("모임 수정 실패");
  }

  return res.json();
}

export async function requestJoinMeeting(meetingId, token, message) {
  const res = await fetch(`${BASE_URL}/${meetingId}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("가입 요청 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 가입 신청 목록 조회 (HOST 전용)
 */
export async function getJoinRequests(meetingId, token) {
  const res = await fetch(`${BASE_URL}/${meetingId}/manage/join-requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("가입 신청 목록 조회 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 가입 신청 승인
 */
export async function approveJoinRequest(meetingId, requestId, token) {
  const res = await fetch(
    `${BASE_URL}/${meetingId}/manage/join-requests/${requestId}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("가입 승인 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 가입 신청 거절
 */
export async function rejectJoinRequest(meetingId, requestId, token) {
  const res = await fetch(
    `${BASE_URL}/${meetingId}/manage/join-requests/${requestId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("가입 거절 실패");
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 모임 멤버 목록 조회
 */
export async function getMeetingMembers(meetingId, token) {
  const res = await fetch(`${BASE_URL}/${meetingId}/manage/members`, {
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
    error.response = { data };
    throw error;
  }

  return data;
}

/**
 * 멤버 강퇴
 */
export async function removeMeetingMember(meetingId, memberId, token) {
  const res = await fetch(
    `${BASE_URL}/${meetingId}/manage/members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error("멤버 강퇴 실패");
    error.response = { data };
    throw error;
  }

  return data;
}
