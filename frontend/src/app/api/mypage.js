const BASE_URL = "http://localhost:8080/api/users";

const defaultHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/* =========================
   My Page Summary
========================= */
export async function getMyPageUser(token) {
  const res = await fetch(`${BASE_URL}/mypage`, {
    headers: defaultHeaders(token),
    credentials: "include",
  });

  if (!res.ok) throw new Error("마이페이지 요약 조회 실패");
  const json = await res.json();
  return json.data;
}

/* =========================
   Meetings
========================= */
export async function getMyMeetings({ token, cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";
  const res = await fetch(`${BASE_URL}/me/meetings${params}`, {
    headers: defaultHeaders(token),
    credentials: "include",
  });

  if (!res.ok) throw new Error("모임 조회 실패");
  return res.json();
}

/* =========================
   Events
========================= */
export async function getMyEvents({ token, cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";
  const res = await fetch(`${BASE_URL}/me/events${params}`, {
    headers: defaultHeaders(token),
    credentials: "include",
  });

  if (!res.ok) throw new Error("이벤트 조회 실패");
  return res.json();
}

/* =========================
   Questions
========================= */
export async function getMyQuestions({ token, cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";
  const res = await fetch(`${BASE_URL}/me/questions${params}`, {
    headers: defaultHeaders(token),
    credentials: "include",
  });

  if (!res.ok) throw new Error("질문 조회 실패");
  return res.json();
}
