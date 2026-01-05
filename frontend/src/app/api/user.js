"use client";

import { apiFetch } from "@/app/api/utils/api.js";

/**
 * 내 정보 수정
 * PATCH /api/users/me
 */
export async function updateMyProfile(payload) {
  return apiFetch("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * 회원 탈퇴
 * DELETE /api/users/me
 */
export async function withdrawUser(currentPassword) {
  return apiFetch("/api/users/me", {
    method: "DELETE",
    body: JSON.stringify({ currentPassword }),
  });
}
