"use client";

import { apiFetch } from "@/app/api/utils/api";

/**
 * 동네 대시보드 조회
 * GET /api/towns/{townId}/dashboard
 */
export async function getTownDashboard(townId) {
  if (!townId) {
    throw new Error("townId is required");
  }

  const res = await apiFetch(`/api/towns/${townId}/dashboard`, {
    method: "GET",
  });

  return res.data;
}
