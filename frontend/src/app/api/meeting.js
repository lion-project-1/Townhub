const BASE_URL = "http://localhost:8080/api/meetings";

export async function getMeetingList({
  page = 0,
  keyword,
  category,
  status,
  province,
  city,
}) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", 6);

  if (keyword) params.append("keyword", keyword);
  if (category && category !== "전체") params.append("category", category);
  if (status && status !== "전체") params.append("status", status);
  if (province) params.append("province", province);
  if (city) params.append("city", city);

  const url = `${BASE_URL}?${params.toString()}`;
  console.log("REQUEST URL:", url); // 디버깅용 (꼭 확인)

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer {마스터 토큰}}",
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
export async function getMeetingDetail(meetingId) {
  const res = await fetch(`${BASE_URL}/${meetingId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer {마스터 토큰}}",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("모임 상세 조회 실패");
  }

  return res.json();
}

export async function createMeeting(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer {마스터 토큰}}",
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

export async function updateMeeting(meetingId, data) {
  const res = await fetch(`${BASE_URL}/${meetingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      //Authorization: "Bearer {마스터 토큰}}",
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
