"use client";

// ✅ AccessToken은 XSS 리스크를 줄이기 위해 메모리(in-memory)로만 보관
// - 새로고침/탭 종료 시 사라짐
// - refreshToken 쿠키가 유효하면 reissue로 다시 세팅
let accessTokenMemory = null;

function emit(eventName) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return accessTokenMemory;
}

export function setAccessToken(token) {
  if (typeof window === "undefined") return;
  accessTokenMemory = token || null;
  emit("auth:token");
}

export function clearAccessToken() {
  setAccessToken(null);
}



