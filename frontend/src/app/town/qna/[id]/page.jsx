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
import {
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  unacceptAnswer,
} from "@/app/api/answers";

// 날짜 포맷팅 함수
function formatDateTime(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("날짜 포맷팅 실패:", error);
    return dateString;
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

  const isDevMode = process.env.NEXT_PUBLIC_DEV === "true";

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

  const formatAnswers = (answersData) => {
    return answersData.map((answer) => {
      const isAccepted =
        answer.accepted === true ||
        answer.accepted === "true" ||
        answer.isAccepted === true ||
        answer.isAccepted === "true";

      return {
        id: answer.id,
        content: answer.content,
        isAccepted,
        author: answer.writerNickname || answer.writer || "익명",
        writerId: answer.writerId,
        createdAt: formatDateTime(answer.createdAt),
        likes: 0,
      };
    });
  };

  const refreshAnswers = async () => {
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
    const answersData = await getAnswers(params.id, token);
    setAnswers(formatAnswers(answersData));
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setIsLoadingAnswers(true);
        await refreshAnswers();
      } catch (error) {
        console.error("답변 목록 조회 실패:", error);
        setAnswers([]);
      } finally {
        setIsLoadingAnswers(false);
      }
    };

    if (params.id) fetchAnswers();
  }, [params.id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmittingAnswer) return;

    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      setIsSubmittingAnswer(true);
      await createAnswer(params.id, answerText.trim(), token);
      alert("답변이 등록되었습니다!");
      setAnswerText("");
      await refreshAnswers();
    } catch (error) {
      console.error("답변 등록 실패:", error);
      alert("답변 등록에 실패했습니다.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    try {
      const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;
      await deleteQuestion(params.id, token);
      alert("질문이 삭제되었습니다.");
      router.push("/town/qna");
    } catch (error) {
      alert("질문 삭제에 실패했습니다.");
    }
  };

  const handleEditAnswer = (answerId, currentContent) => {
    setEditingAnswerId(answerId);
    setEditText(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditText("");
  };

  const handleSubmitEdit = async (answerId) => {
    if (!editText.trim()) return;

    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      await updateAnswer(answerId, editText.trim(), token);
      alert("답변이 수정되었습니다.");
      handleCancelEdit();
      await refreshAnswers();
    } catch (error) {
      alert("답변 수정에 실패했습니다.");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!confirm("정말로 이 답변을 삭제하시겠습니까?")) return;

    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      await deleteAnswer(answerId, token);
      alert("답변이 삭제되었습니다.");
      await refreshAnswers();
    } catch (error) {
      alert("답변 삭제에 실패했습니다.");
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      setAcceptingAnswerId(answerId);
      await acceptAnswer(answerId, token);
      await refreshAnswers();
    } catch (error) {
      alert("답변 채택에 실패했습니다.");
    } finally {
      setAcceptingAnswerId(null);
    }
  };

  const handleUnacceptAnswer = async (answerId) => {
    const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

    try {
      setAcceptingAnswerId(answerId);
      await unacceptAnswer(answerId, token);
      await refreshAnswers();
    } catch (error) {
      alert("답변 채택 취소에 실패했습니다.");
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
              <div className="flex gap-2">
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

          <p className="text-gray-700 whitespace-pre-wrap">
            {question.content}
          </p>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="mb-6 text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            답변 {answers.length}개
          </h2>

          {isLoadingAnswers ? (
            <div className="text-center py-8 text-gray-500">
              답변을 불러오는 중...
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`p-6 rounded-lg border ${
                    answer.isAccepted
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {answer.isAccepted && (
                    <div className="flex items-center gap-2 mb-3 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">채택된 답변</span>
                    </div>
                  )}

                  {editingAnswerId === answer.id ? (
                    <div className="mb-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitEdit(answer.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-4">{answer.content}</p>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center">
                        {answer.author[0]}
                      </div>
                      <span>{answer.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {answer.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {(isDevMode ||
                        String(user?.id) === String(answer.writerId)) && (
                        <>
                          <button
                            onClick={() =>
                              handleEditAnswer(answer.id, answer.content)
                            }
                            className="px-2 py-1 text-xs text-blue-600 border border-blue-300 rounded"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteAnswer(answer.id)}
                            className="px-2 py-1 text-xs text-red-600 border border-red-300 rounded"
                          >
                            삭제
                          </button>
                        </>
                      )}

                      {isAuthor && (
                        <>
                          {answer.isAccepted ? (
                            <button
                              onClick={() => handleUnacceptAnswer(answer.id)}
                              className="px-2 py-1 text-xs border border-green-300 text-green-700 rounded"
                            >
                              채택 취소
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAcceptAnswer(answer.id)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                            >
                              채택
                            </button>
                          )}
                        </>
                      )}

                      <button className="flex items-center gap-1 px-2 py-1 border rounded">
                        <ThumbsUp className="w-4 h-4" />
                        {answer.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        {user && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="mb-4">답변 작성</h2>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingAnswer}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg"
              >
                {isSubmittingAnswer ? "등록 중..." : "답변 등록"}
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="mb-4">답변을 작성하려면 로그인이 필요합니다.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
