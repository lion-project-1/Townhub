"use client";

import { getAccessToken } from "@/app/api/tokenStorage";
import { reissueOnce } from "@/app/api/reissueOnce";
import { emitSessionExpired } from "@/app/utils/uiEvents";

/**
 * 공통 인증 fetch
 * - Authorization 자동 부착(메모리 accessToken)
 * - 401이면 refresh 쿠키로 1회 재발급 후 재시도
 * - 재발급 실패 시 세션 만료 UX 트리거
 */
export async function authFetch(url, options = {}) {
  const { _retried, ...fetchOptions } = options;

  const accessToken = getAccessToken();
  const headers = new Headers(fetchOptions.headers || {});

  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: fetchOptions.credentials ?? "include",
  });

  if (res.status !== 401) return res;
  if (_retried) return res;

  const reissueResult = await reissueOnce();
  if (!reissueResult?.ok || !reissueResult?.accessToken) {
    // 미로그인: 조용히 종료(페이지/라우터가 알아서 /login 유도)
    if (reissueResult?.code === "TOKEN_003") return res;
    emitSessionExpired();
    return res;
  }

  const retryHeaders = new Headers(headers);
  retryHeaders.set("Authorization", `Bearer ${reissueResult.accessToken}`);

  return fetch(url, {
    ...fetchOptions,
    headers: retryHeaders,
    credentials: fetchOptions.credentials ?? "include",
  });
}


