import { apiFetch } from "@/app/api/utils/api";

/**
 * 답변 목록 조회
 * GET /api/questions/{questionId}/answers
 * @param {string|number} questionId - 질문 ID
 * @returns {Promise<Array>} AnswerResponse 배열
 */
export async function getAnswers(questionId) {
  try {
    const apiResponse = await apiFetch(`/api/questions/${questionId}/answers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
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
 * @returns {Promise<void>}
 */
export async function createAnswer(questionId, content) {
  try {
    await apiFetch(`/api/questions/${questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
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
 * @returns {Promise<void>}
 */
export async function updateAnswer(answerId, content) {
  try {
    await apiFetch(`/api/answers/${answerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    console.error("답변 수정 실패:", error);
    throw error;
  }
}

/**
 * 답변 삭제
 * DELETE /api/answers/{answerId}
 * @param {string|number} answerId - 답변 ID
 * @returns {Promise<void>}
 */
export async function deleteAnswer(answerId) {
  try {
    await apiFetch(`/api/answers/${answerId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("답변 삭제 실패:", error);
    throw error;
  }
}

/**
 * 답변 채택
 * PATCH /api/answers/{answerId}/accept
 * @param {string|number} answerId - 답변 ID
 * @returns {Promise<void>}
 */
export async function acceptAnswer(answerId) {
  try {
    await apiFetch(`/api/answers/${answerId}/accept`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("답변 채택 실패:", error);
    throw error;
  }
}

/**
 * 답변 채택 취소
 * PATCH /api/answers/{answerId}/unaccept
 * @param {string|number} answerId - 답변 ID
 * @returns {Promise<void>}
 */
export async function unacceptAnswer(answerId) {
  try {
    await apiFetch(`/api/answers/${answerId}/unaccept`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("답변 채택 취소 실패:", error);
    throw error;
  }
}

