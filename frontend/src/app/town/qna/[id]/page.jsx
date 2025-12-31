"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  ThumbsUp,
  Edit,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { deleteQuestion } from "@/app/api/questions";
import { getAnswers, createAnswer, updateAnswer, deleteAnswer, acceptAnswer, unacceptAnswer } from "@/app/api/answers";

// 날짜 포맷팅 함수: ISO 8601 형식을 YYYY-MM-DD HH:mm 형식으로 변환
function formatDateTime(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('날짜 포맷팅 실패:', error);
    return dateString; // 변환 실패 시 원본 반환
  }
}

export default function QnaDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editText, setEditText] = useState("");
  const [acceptingAnswerId, setAcceptingAnswerId] = useState(null);
  
  // 개발 모드 체크 (환경변수로 제어)
  const isDevMode = process.env.NEXT_PUBLIC_DEV === 'true';

  const isMyQuestion =
    params.id === "1" || params.id === "100" || params.id === "999";

  const question = {
    id: params.id,
    title: "이 근처 맛있는 한식당 추천해주세요",
    content:
      "가족 모임을 위해 괜찮은 한식당을 찾고 있습니다. 10명 정도 수용 가능하고, 주차도 편한 곳이면 좋겠어요. 추천 부탁드립니다!",
    author: isMyQuestion ? user?.name || "나" : "김민수",
    authorId: isMyQuestion ? user?.id || "1" : "2",
    category: "맛집",
    views: 124,
    isResolved: true,
    createdAt: "2025-01-22 10:00",
  };

  const isAuthor = user?.id === question.authorId;

  // 답변 목록 포맷팅 헬퍼 함수
  const formatAnswers = (answersData) => {
    return answersData.map((answer) => {
      // 백엔드에서는 'accepted' 필드로 오므로 이를 확인
      const isAccepted = answer.accepted === true || answer.accepted === 'true' || answer.isAccepted === true || answer.isAccepted === 'true';
      return {
        id: answer.id,
        content: answer.content,
        isAccepted: isAccepted,
        author: answer.writerNickname || answer.writer || '익명', // writerNickname 우선, 없으면 writer, 둘 다 없으면 익명
        writerId: answer.writerId, // 본인 확인용
        createdAt: formatDateTime(answer.createdAt), // 날짜 포맷팅
        likes: 0, // 백엔드에 likes 필드가 없으므로 0으로 설정
      };
    });
  };

  // 답변 목록 새로고침 헬퍼 함수
  const refreshAnswers = async () => {
    try {
      // 개발용 임시 처리: 환경변수에서 토큰 가져오기
      // 추후 로그인/인증 연동 시 제거 또는 변경 예정
      const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
      const answersData = await getAnswers(params.id, token);
      const formattedAnswers = formatAnswers(answersData);
      setAnswers(formattedAnswers);
    } catch (error) {
      console.error("답변 목록 조회 실패:", error);
      throw error;
    }
  };

  // 답변 목록 조회
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setIsLoadingAnswers(true);
        // 개발용 임시 처리: 환경변수에서 토큰 가져오기
        // 추후 로그인/인증 연동 시 제거 또는 변경 예정
        const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
        const answersData = await getAnswers(params.id, token);
        // 백엔드 응답 형식(AnswerResponse)을 UI 형식으로 변환
        const formattedAnswers = formatAnswers(answersData);
        setAnswers(formattedAnswers);
      } catch (error) {
        console.error("답변 목록 조회 실패:", error);
        // 에러 발생 시 빈 배열로 설정하여 화면이 깨지지 않도록 함
        setAnswers([]);
      } finally {
        setIsLoadingAnswers(false);
      }
    };

    if (params.id) {
      fetchAnswers();
    }
  }, [params.id]);

  // 답변 등록
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmittingAnswer) return;

    // 개발용 임시 처리: 환경변수에서 토큰 가져오기
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      setIsSubmittingAnswer(true);
      await createAnswer(params.id, answerText.trim(), token);
      alert("답변이 등록되었습니다!");
      setAnswerText("");

      // 답변 목록 새로고침
      await refreshAnswers();
    } catch (error) {
      console.error("답변 등록 실패:", error);
      alert(error.message || "답변 등록에 실패했습니다.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // const handleDelete = () => {
  //   if (confirm("정말로 이 질문을 삭제하시겠습니까?")) {
  //     router.push("/town/qna");
  //   }
  // };

  const handleDelete = async () => {
    const token = "tmptoken";
    if (!confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    try {
      await deleteQuestion(params.id, token);
      alert("질문이 삭제되었습니다.");
      router.push("/town/qna");
    } catch (error) {
      alert(error.message || "질문 삭제에 실패했습니다.");
    }
  };

  // 답변 수정 핸들러
  const handleEditAnswer = (answerId, currentContent) => {
    setEditingAnswerId(answerId);
    setEditText(currentContent);
  };

  // 답변 수정 취소
  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditText("");
  };

  // 답변 수정 제출
  const handleSubmitEdit = async (answerId) => {
    if (!editText.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 개발용 임시 처리: 환경변수에서 토큰 가져오기
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      await updateAnswer(answerId, editText.trim(), token);
      alert("답변이 수정되었습니다.");
      setEditingAnswerId(null);
      setEditText("");

      // 답변 목록 새로고침
      await refreshAnswers();
    } catch (error) {
      console.error("답변 수정 실패:", error);
      alert(error.message || "답변 수정에 실패했습니다.");
    }
  };

  // 답변 삭제 핸들러
  const handleDeleteAnswer = async (answerId) => {
    if (!confirm("정말로 이 답변을 삭제하시겠습니까?")) return;

    // 개발용 임시 처리: 환경변수에서 토큰 가져오기
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      await deleteAnswer(answerId, token);
      alert("답변이 삭제되었습니다.");

      // 답변 목록 새로고침
      await refreshAnswers();
    } catch (error) {
      console.error("답변 삭제 실패:", error);
      alert(error.message || "답변 삭제에 실패했습니다.");
    }
  };

  // 답변 채택 핸들러
  const handleAcceptAnswer = async (answerId) => {
    // 개발용 임시 처리: 환경변수에서 토큰 가져오기
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    
    // 다른 답변이 이미 채택되어 있는지 확인
    const hasAcceptedAnswer = answers.some((answer) => answer.isAccepted && answer.id !== answerId);
    
    // 다른 답변이 채택되어 있고, 현재 답변이 채택되지 않은 경우 confirm 표시
    if (hasAcceptedAnswer && !answers.find((a) => a.id === answerId)?.isAccepted) {
      if (!confirm("이미 채택된 답변은 채택이 취소됩니다.")) {
        return;
      }
    }

    try {
      setAcceptingAnswerId(answerId);
      await acceptAnswer(answerId, token);
      
      // 답변 목록 새로고침
      await refreshAnswers();
    } catch (error) {
      console.error("답변 채택 실패:", error);
      alert(error.message || "답변 채택에 실패했습니다.");
    } finally {
      setAcceptingAnswerId(null);
    }
  };

  // 답변 채택 취소 핸들러
  const handleUnacceptAnswer = async (answerId) => {
    // 개발용 임시 처리: 환경변수에서 토큰 가져오기
    // 추후 로그인/인증 연동 시 제거 또는 변경 예정
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      setAcceptingAnswerId(answerId);
      await unacceptAnswer(answerId, token);
      
      // 답변 목록 새로고침
      await refreshAnswers();
    } catch (error) {
      console.error("답변 채택 취소 실패:", error);
      alert(error.message || "답변 채택 취소에 실패했습니다.");
    } finally {
      setAcceptingAnswerId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/town/qna"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>

        {/* Question */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <h1 className="text-gray-900">{question.title}</h1>
              {question.isResolved && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                  해결됨
                </span>
              )}
            </div>
            {isAuthor && (
              <div className="flex gap-2 flex-shrink-0 ml-2">
                <Link
                  href={`/town/qna/${params.id}/edit`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded">
              {question.category}
            </span>
            <span>{question.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {question.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              조회 {question.views}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {question.content}
            </p>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="mb-6 text-gray-900">
            <MessageCircle className="inline w-6 h-6 mr-2" />
            답변 {answers.length}개
          </h2>

          {isLoadingAnswers ? (
            <div className="text-center py-8 text-gray-500">
              답변을 불러오는 중...
            </div>
          ) : answers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 답변이 없습니다.
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => {
                // 디버깅: isAccepted 값 확인
                console.log('[Render Answer]', { id: answer.id, isAccepted: answer.isAccepted, type: typeof answer.isAccepted });
                return (
                <div
                  key={answer.id}
                  className={`p-6 rounded-lg border ${
                    answer.isAccepted
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {answer.isAccepted ? (
                    <div className="flex items-center gap-2 mb-3 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">채택된 답변</span>
                    </div>
                  ) : null}

                {editingAnswerId === answer.id ? (
                  <div className="mb-4">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      placeholder="답변 내용을 수정하세요..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitEdit(answer.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {answer.content}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                      {answer.author?.[0] || '?'}
                    </div>
                    <span>{answer.author || '익명'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {answer.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 본인 답변이거나 개발 모드일 때 수정/삭제 버튼 표시 */}
                    {(() => {
                      // writerId와 현재 사용자 ID 비교 (타입 변환 고려)
                      const isMyAnswer = user?.id && answer.writerId && 
                        (String(user.id) === String(answer.writerId) || Number(user.id) === Number(answer.writerId));
                      const showButtons = isDevMode || isMyAnswer;
                      
                      // 디버깅 로그
                      console.log('[Button Visibility]', {
                        answerId: answer.id,
                        writerId: answer.writerId,
                        userId: user?.id,
                        isMyAnswer,
                        isDevMode,
                        showButtons
                      });
                      
                      return showButtons ? (
                        <>
                          <button
                            onClick={() => handleEditAnswer(answer.id, answer.content)}
                            className="px-2 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50 flex items-center gap-1"
                            title="수정"
                          >
                            <Edit className="w-3 h-3" />
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteAnswer(answer.id)}
                            className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 flex items-center gap-1"
                            title="삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </>
                      ) : null;
                    })()}
                    {/* 질문 작성자에게만 채택 버튼 표시 */}
                    {isAuthor && (
                      <>
                        {answer.isAccepted ? (
                          <button
                            onClick={() => handleUnacceptAnswer(answer.id)}
                            disabled={acceptingAnswerId === answer.id}
                            className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {acceptingAnswerId === answer.id ? "취소 중..." : "채택 취소"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAcceptAnswer(answer.id)}
                            disabled={acceptingAnswerId === answer.id}
                            className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {acceptingAnswerId === answer.id ? "채택 중..." : "채택"}
                          </button>
                        )}
                      </>
                    )}
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{answer.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {user && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="mb-4 text-gray-900">답변 작성</h2>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="이웃에게 도움이 되는 답변을 작성해주세요..."
                required
              />
              <button
                type="submit"
                disabled={isSubmittingAnswer}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingAnswer ? "등록 중..." : "답변 등록"}
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              답변을 작성하려면 로그인이 필요합니다.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
