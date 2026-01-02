// Next.js API Route를 통한 프록시 사용 (CORS 문제 해결)
const BASE_URL = "/api";

/**
 * ApiResponse 형식 처리 헬퍼 함수
 * @param {Response} res - fetch 응답 객체
 * @returns {Promise<{success: boolean, code: string, message: string, data: any}>}
 */
async function handleApiResponse(res) {
  const data = await res.json();
  
  if (!res.ok) {
    console.error("API Error:", {
      status: res.status,
      code: data.code,
      message: data.message,
    });
    throw new Error(data.message || "API 요청 실패");
  }

  // ApiResponse 형식 확인
  if (data.success === false) {
    console.error("API Response Error:", {
      code: data.code,
      message: data.message,
    });
    throw new Error(data.message || "요청 처리 실패");
  }

  return data;
}

/**
 * 답변 목록 조회
 * GET /api/questions/{questionId}/answers
 * @param {string|number} questionId - 질문 ID
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<Array>} AnswerResponse 배열
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function getAnswers(questionId, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/questions/${questionId}/answers`;
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const apiResponse = await handleApiResponse(res);
    
    // data가 null이거나 배열이 아닌 경우 빈 배열 반환
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;
  } catch (error) {
    console.error("답변 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 답변 등록
 * POST /api/questions/{questionId}/answers
 * @param {string|number} questionId - 질문 ID
 * @param {string} content - 답변 내용
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<void>}
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function createAnswer(questionId, content, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/questions/${questionId}/answers`;
    const body = { content };
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 등록 실패:", error);
    throw error;
  }
}

/**
 * 답변 수정
 * PATCH /api/answers/{answerId}
 * @param {string|number} answerId - 답변 ID
 * @param {string} content - 수정할 답변 내용
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<void>}
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function updateAnswer(answerId, content, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}`;
    const body = { content };
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 수정 실패:", error);
    throw error;
  }
}

/**
 * 답변 삭제
 * DELETE /api/answers/{answerId}
 * @param {string|number} answerId - 답변 ID
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<void>}
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function deleteAnswer(answerId, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}`;
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 삭제 실패:", error);
    throw error;
  }
}

/**
 * 답변 채택
 * PATCH /api/answers/{answerId}/accept
 * @param {string|number} answerId - 답변 ID
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<void>}
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function acceptAnswer(answerId, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}/accept`;
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 채택 실패:", error);
    throw error;
  }
}

/**
 * 답변 채택 취소
 * PATCH /api/answers/{answerId}/unaccept
 * @param {string|number} answerId - 답변 ID
 * @param {string} token - 인증 토큰 (선택적, 없으면 환경변수에서 가져옴)
 * @returns {Promise<void>}
 * 
 * [개발용 임시 처리]
 * 로그인 연동 전 단계이므로, 환경변수에서 임시 토큰을 읽어 사용합니다.
 * 추후 로그인/인증 연동 시 이 부분은 제거 또는 변경 예정입니다.
 */
export async function unacceptAnswer(answerId, token) {
  try {
    // 개발용 임시 처리: 토큰이 없으면 환경변수에서 가져옴
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const authToken = token || process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}/unaccept`;
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 채택 취소 실패:", error);
    throw error;
  }
}

