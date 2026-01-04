const BASE_URL = "http://localhost:8080/api/users";

export async function updateMyProfile(token, payload) {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "사용자 정보 수정 실패");
  }

  return res.json();
}

export async function withdrawUser(token, currentPassword) {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "회원 탈퇴 실패");
  }

  return res.json();
}
