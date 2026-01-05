"use client";

import { authFetch } from "@/app/api/authFetch.js";

export function getApiBaseUrl() {
  // 환경변수 우선 (배포/프록시 환경 대응)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 개발 기본값: 쿠키 도메인 혼선을 막기 위해 localhost로 고정 권장
  return "http://localhost:8080";
}

export async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

const API_BASE_URL = getApiBaseUrl();

/**
 * 공통 API Fetch
 * - authFetch 사용 (accessToken 자동, 401 재발급 처리)
 * - ApiResponse(success, code, message, data) 규약 처리
 */
export async function apiFetch(path, options = {}) {
  const res = await authFetch(`${API_BASE_URL}${path}`, options);

  const body = await safeJson(res);

  if (!res.ok || body?.success === false) {
    const err = new Error(body?.message || "요청 처리 중 오류가 발생했습니다.");
    err.status = res.status;
    err.code = body?.code;
    err.body = body;
    throw err;
  }

  return body;
}
