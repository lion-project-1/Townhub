"use client";

import { apiFetch } from "@/app/api/utils/api.js";

/**
 * 모임 목록 조회
 * GET /api/meetings
 */
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

  const res = await apiFetch(`/api/meetings?${params.toString()}`, {
    method: "GET",
  });

  return res;
}

/**
 * 모임 상세 조회
 * GET /api/meetings/{meetingId}
 */
export async function getMeetingDetail(meetingId) {
  const res = await apiFetch(`/api/meetings/${meetingId}`, {
    method: "GET",
  });

  return res;
}

/**
 * 모임 생성
 * POST /api/meetings
 */
export async function createMeeting(data) {
  return apiFetch("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 모임 수정
 * PATCH /api/meetings/{meetingId}
 */
export async function updateMeeting(meetingId, data) {
  return apiFetch(`/api/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 모임 가입 신청
 * POST /api/meetings/{meetingId}/join
 */
export async function requestJoinMeeting(meetingId, message) {
  return apiFetch(`/api/meetings/${meetingId}/join`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

/**
 * 가입 신청 목록 조회
 * GET /api/meetings/{meetingId}/manage/join-requests
 */
export async function getJoinRequests(meetingId) {
  const res = await apiFetch(
    `/api/meetings/${meetingId}/manage/join-requests`,
    { method: "GET" }
  );

  return res;
}

/**
 * 가입 신청 승인
 * POST /api/meetings/{meetingId}/manage/join-requests/{requestId}/approve
 */
export async function approveJoinRequest(meetingId, requestId) {
  return apiFetch(
    `/api/meetings/${meetingId}/manage/join-requests/${requestId}/approve`,
    { method: "POST" }
  );
}

/**
 * 가입 신청 거절
 * POST /api/meetings/{meetingId}/manage/join-requests/{requestId}/reject
 */
export async function rejectJoinRequest(meetingId, requestId) {
  return apiFetch(
    `/api/meetings/${meetingId}/manage/join-requests/${requestId}/reject`,
    { method: "POST" }
  );
}

/**
 * 모임 멤버 목록 조회
 * GET /api/meetings/{meetingId}/manage/members
 */
export async function getMeetingMembers(meetingId) {
  const res = await apiFetch(`/api/meetings/${meetingId}/manage/members`, {
    method: "GET",
  });

  return res;
}

/**
 * 모임 멤버 강퇴
 * DELETE /api/meetings/{meetingId}/manage/members/{memberId}
 */
export async function removeMeetingMember(meetingId, memberId) {
  return apiFetch(`/api/meetings/${meetingId}/manage/members/${memberId}`, {
    method: "DELETE",
  });
}

