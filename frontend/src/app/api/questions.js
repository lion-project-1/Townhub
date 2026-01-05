import { authFetch } from "@/app/api/authFetch";
import { getApiBaseUrl } from "@/app/api/authApi";
const BASE_URL = `${getApiBaseUrl()}/api/questions`;

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateQuestion(id, data) {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "질문 수정 실패");
  }
  return body;
}

export async function deleteQuestion(id) {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "질문 삭제 실패");
  }
}

export async function createQuestion(data) {
  const res = await authFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      questionCategory: data.category, // category도 같이 보내야 함
    }),
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "질문 등록 실패");
  }
  return body; // ApiResponse<Long>
}

// 질문 상세 페이지

// 1️⃣ 질문 데이터만 가져오기 (조회수 증가 없음)
export async function getQuestionData(id) {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "GET",
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "질문 조회 실패");
  }
  return body.data; // QuestionResponseRequest
}

// 2️⃣ 조회수 1 증가 전용
export async function incrementQuestionViews(id) {
  const res = await authFetch(`${BASE_URL}/${id}/views`, {
    method: "POST",
  });

  const body = await safeJson(res);
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "조회수 증가 실패");
  }
  return body.data;
}

// 모든 질문 조회

export async function getQuestions({
  page = 0,
  size = 6,
  search = null,
  category = null,
  sort = "createdAt,desc",
  province = null,
  city = null,
}) {
  const API_BASE_URL = getApiBaseUrl();

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  params.append("sort", sort);

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (province) params.append("province", province);
  if (city) params.append("city", city);

  const res = await fetch(
    `${API_BASE_URL}/api/questions?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("질문 목록 조회 실패");
  }

  const body = await res.json();
  return body;
}
