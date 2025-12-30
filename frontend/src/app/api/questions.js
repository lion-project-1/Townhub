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


export async function createQuestion(data) {
    const headers = { "Content-Type": "application/json" };
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            title: data.title,
            content: data.content,
            questionCategory: data.category,  // category도 같이 보내야 함
            userId: 1
        }),
    });

    if (!res.ok) {
        const text = await res.text();  // 서버가 보낸 에러 메시지 확인
        console.error("Server Response:", text);
        throw new Error("질문 등록 실패");
    }

    return res.json(); // 백엔드가 반환하는 등록된 질문 정보
}

export async function getQuestion(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("질문 조회 실패");
    }

    return res.json();
}

// 모든 질문 조회
export async function getQuestions() {
    const res = await fetch(BASE_URL, {
        method: "GET"
    });

    if (!res.ok) {
        throw new Error("질문 리스트 조회 실패");
    }

    return res.json(); // 질문 배열 반환
}