"use client";

import { authFetch } from "@/app/api/authFetch";
import { getApiBaseUrl } from "@/app/api/authApi";

const API_BASE_URL = getApiBaseUrl();
const BASE_URL = `${API_BASE_URL}/api/meetings`;

export async function getMeetingList(
  { page = 0, keyword, category, status, province, city },
  _token
) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", 6);

  if (keyword) params.append("keyword", keyword);
  if (category && category !== "전체") params.append("category", category);
  if (status && status !== "전체") params.append("status", status);
  if (province) params.append("province", province);
  if (city) params.append("city", city);

  const res = await authFetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("모임 목록 조회 실패");
  return res.json();
}

export async function getMeetingDetail(meetingId, _token) {
  const res = await authFetch(`${BASE_URL}/${meetingId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("모임 상세 조회 실패");
  return res.json();
}

export async function createMeeting(data, _token) {
  const res = await authFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("모임 생성 실패");
  return res.json();
}

export async function updateMeeting(meetingId, data, _token) {
  const res = await authFetch(`${BASE_URL}/${meetingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("모임 수정 실패");
  return res.json();
}

export async function requestJoinMeeting(meetingId, _token, message) {
  const res = await authFetch(`${BASE_URL}/${meetingId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("가입 요청 실패");
    err.response = { data };
    throw err;
  }
  return data;
}

export async function getJoinRequests(meetingId, _token) {
  const res = await authFetch(`${BASE_URL}/${meetingId}/manage/join-requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("가입 신청 목록 조회 실패");
    err.response = { data };
    throw err;
  }
  return data;
}

export async function approveJoinRequest(meetingId, requestId, _token) {
  const res = await authFetch(
    `${BASE_URL}/${meetingId}/manage/join-requests/${requestId}/approve`,
    { method: "POST" }
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("가입 승인 실패");
    err.response = { data };
    throw err;
  }
  return data;
}

export async function rejectJoinRequest(meetingId, requestId, _token) {
  const res = await authFetch(
    `${BASE_URL}/${meetingId}/manage/join-requests/${requestId}/reject`,
    { method: "POST" }
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("가입 거절 실패");
    err.response = { data };
    throw err;
  }
  return data;
}

export async function getMeetingMembers(meetingId, _token) {
  const res = await authFetch(`${BASE_URL}/${meetingId}/manage/members`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("멤버 목록 조회 실패");
    err.response = { data };
    throw err;
  }
  return data;
}

export async function removeMeetingMember(meetingId, memberId, _token) {
  const res = await authFetch(
    `${BASE_URL}/${meetingId}/manage/members/${memberId}`,
    { method: "DELETE" }
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("멤버 강퇴 실패");
    err.response = { data };
    throw err;
  }
  return data;
}


