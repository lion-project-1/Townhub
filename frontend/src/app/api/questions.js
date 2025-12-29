const BASE_URL = "http://localhost:8080/api/questions";

export async function updateQuestion(id, data, token) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("질문 수정 실패");
  }

  return res.json();
}

export async function deleteQuestion(id, token) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("질문 삭제 실패");
  }
}


export async function createQuestion(data, token) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 로그인 토큰이 있다면
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("질문 등록 실패");
    }

    return res.json(); // 백엔드가 반환하는 등록된 질문 정보
}

export async function getQuestion(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: token
            ? { Authorization: `Bearer ${token}` } // 로그인 필요 시
            : undefined,
    });

    if (!res.ok) {
        throw new Error("질문 조회 실패");
    }

    return res.json(); // 백엔드가 반환하는 질문 데이터
}

// 모든 질문 조회
export async function getQuestions(token) {
    const res = await fetch(BASE_URL, {
        method: "GET",
        headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
    });

    if (!res.ok) {
        throw new Error("질문 리스트 조회 실패");
    }

    return res.json(); // 질문 배열 반환
}