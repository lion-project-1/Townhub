import { authFetch } from "@/app/api/authFetch";
import { getApiBaseUrl } from "@/app/api/authApi";
const BASE_URL = "http://localhost:8080/api/questions";
const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

const API_BASE_URL = getApiBaseUrl();

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

export async function createQuestion(data) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ⭐ 토큰 추가
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      questionCategory: data.category, // category도 같이 보내야 함
      userId: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text(); // 서버가 보낸 에러 메시지 확인
    console.error("Server Response:", text);
    throw new Error("질문 등록 실패");
  }

  return res.json(); // 백엔드가 반환하는 등록된 질문 정보
}

// 질문 상세 페이지

// 1️⃣ 질문 데이터만 가져오기 (조회수 증가 없음)
export async function getQuestionData(id) {
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error("질문 조회 실패");
  }

  const json = await res.json();
  return json.data; // 기존 코드처럼 data만 반환
}

// 2️⃣ 조회수 1 증가 전용
export async function incrementQuestionViews(id) {
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/${id}/views`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    throw new Error("조회수 증가 실패");
  }

  const json = await res.json();
  return json.data;
}

// 모든 질문 조회
export async function getQuestions({
  page = 0,
  size = 10,
  search = "",
  category = null,
  sort = "createdAt,desc", // 기본 정렬
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (sort) params.append("sort", sort);

  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
  if (!token) throw new Error("env 토큰이 없습니다");

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("TOKEN:", token);
  console.log("FETCH URL:", `${BASE_URL}?${params.toString()}`);

  if (!res.ok) throw new Error("질문 조회 실패");

  const json = await res.json();

  // 프론트에서 바로 사용하기 좋게 content + page 정보만 반환
  return {
    content: json.data.content,
    number: json.data.page.number,
    totalPages: json.data.page.totalPages,
  };
}
