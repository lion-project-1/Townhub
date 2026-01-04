import { authFetch } from "@/app/api/authFetch";
import { getApiBaseUrl } from "@/app/api/authApi";

const API_BASE_URL = getApiBaseUrl();
const BASE_URL = `${API_BASE_URL}/api/questions`;

export async function updateQuestion(id, data) {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("질문 수정 실패");
  }

  return res.json();
}

export async function deleteQuestion(id) {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("질문 삭제 실패");
  }
}
