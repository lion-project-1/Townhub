"use client";

import { apiFetch } from "@/app/api/utils/api.js";

/* =========================
   My Page Summary
========================= */
export async function getMyPageUser() {
  const res = await apiFetch("/api/users/mypage", {
    method: "GET",
  });

  return res.data;
}

/* =========================
   Meetings
========================= */
export async function getMyMeetings({ cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";

  const res = await apiFetch(`/api/users/me/meetings${params}`, {
    method: "GET",
  });

  return res;
}

/* =========================
   Events
========================= */
export async function getMyEvents({ cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";

  const res = await apiFetch(`/api/users/me/events${params}`, {
    method: "GET",
  });

  return res;
}

/* =========================
   Questions
========================= */
export async function getMyQuestions({ cursor }) {
  const params = cursor ? `?cursor=${cursor}` : "";

  const res = await apiFetch(`/api/users/me/questions${params}`, {
    method: "GET",
  });

  return res;
}
