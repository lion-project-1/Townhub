"use client";

import { apiFetch } from "@/app/api/utils/api.js";

/**
 * 동네 검색
 * GET /api/locations?keyword=
 * @param {string} keyword - 검색 키워드 (2자 이상)
 * @returns {Promise<Array>} LocationResponse 배열
 */
export async function searchTowns(keyword) {
  if (!keyword || keyword.trim().length < 2) return [];

  const apiResponse = await apiFetch(
    `/api/locations?keyword=${encodeURIComponent(keyword)}`,
    {
      method: "GET",
    }
  );

  return apiResponse;
}
