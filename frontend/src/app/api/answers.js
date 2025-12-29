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
 * @returns {Promise<Array>} AnswerResponse 배열
 */
export async function getAnswers(questionId) {
  try {
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/questions/${questionId}/answers`;
    console.log('[Answer API]', {
      method: 'GET',
      url,
      questionId
    });
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
 * @param {string} token - 인증 토큰
 * @returns {Promise<void>}
 */
export async function createAnswer(questionId, content, token) {
  try {
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/questions/${questionId}/answers`;
    const body = { content };
    console.log('[Answer API]', {
      method: 'POST',
      url,
      questionId,
      body
    });
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
 * @param {string} token - 인증 토큰
 * @returns {Promise<void>}
 */
export async function updateAnswer(answerId, content, token) {
  try {
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}`;
    const body = { content };
    console.log('[Answer API]', {
      method: 'PATCH',
      url,
      answerId,
      body
    });
    
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
 * @param {string} token - 인증 토큰
 * @returns {Promise<void>}
 */
export async function deleteAnswer(answerId, token) {
  try {
    // Next.js API Route를 통한 프록시 사용
    const url = `${BASE_URL}/answers/${answerId}`;
    console.log('[Answer API]', {
      method: 'DELETE',
      url,
      answerId
    });
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await handleApiResponse(res);
  } catch (error) {
    console.error("답변 삭제 실패:", error);
    throw error;
  }
}

