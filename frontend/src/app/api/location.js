"use client";

import { authFetch } from "@/app/api/authFetch";
import { getApiBaseUrl } from "@/app/api/authApi";

const API_BASE_URL = getApiBaseUrl();
const BASE_URL = `${API_BASE_URL}/api/locations`;

export async function searchTowns(keyword) {
  if (!keyword || keyword.trim().length < 2) return [];

  const res = await authFetch(`${BASE_URL}?keyword=${encodeURIComponent(keyword)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("동네 검색 실패");
  return res.json();
}


