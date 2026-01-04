"use client";

export function getApiBaseUrl() {
  // 환경변수 우선 (배포/프록시 환경 대응)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 개발 기본값: 쿠키 도메인 혼선을 막기 위해 localhost로 고정 권장
  return "http://localhost:8080";
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function loginApi(email, password) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    const message =
      body?.message || "로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.";
    const err = new Error(message);
    err.status = res.status;
    err.code = body?.code;
    err.body = body;
    throw err;
  }

  return body; // ApiResponse<LoginResponse>
}

export async function reissueApi() {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/users/token/reissue`, {
    method: "POST",
    credentials: "include",
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    return {
      ok: false,
      status: res.status,
      code: body?.code || null,
      message: body?.message || null,
      body,
    };
  }

  return {
    ok: true,
    status: res.status,
    accessToken: body?.data?.accessToken || null,
    body,
  };
}

export async function logoutApi() {
  const API_BASE_URL = getApiBaseUrl();
  await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
}

export async function signupApi({ email, password, nickname, province, city }) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nickname, province, city }),
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    const message = body?.message || "회원가입에 실패했습니다.";
    const err = new Error(message);
    err.status = res.status;
    err.code = body?.code;
    err.body = body;
    throw err;
  }
  return body;
}

export async function meApi(accessToken) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    return null;
  }
  return body; // ApiResponse<UserMeResponse>
}

export async function checkEmailApi(email) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/api/users/check-email?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    const err = new Error(body?.message || "이메일 중복검증에 실패했습니다.");
    err.status = res.status;
    err.code = body?.code;
    err.body = body;
    throw err;
  }
  return body; // ApiResponse<DuplicateCheckResponse>
}

export async function checkNicknameApi(nickname) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/api/users/check-nickname?nickname=${encodeURIComponent(
      nickname
    )}`,
    { method: "GET" }
  );

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    const err = new Error(body?.message || "닉네임 중복검증에 실패했습니다.");
    err.status = res.status;
    err.code = body?.code;
    err.body = body;
    throw err;
  }
  return body; // ApiResponse<DuplicateCheckResponse>
}


