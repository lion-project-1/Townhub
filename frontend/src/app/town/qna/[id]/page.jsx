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
import {
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  unacceptAnswer,
} from "@/app/api/answers";
import {
  getQuestionData,
  incrementQuestionViews,
  deleteQuestion,
} from "@/app/api/questions";

/* =========================
   constants
========================= */
const CATEGORIES = [
  { label: "맛집", value: "RESTAURANT" },
  { label: "의료", value: "HOSPITAL" },
  { label: "생활", value: "LIVING" },
  { label: "교통", value: "TRAFFIC" },
  { label: "교육", value: "EDUCATION" },
  { label: "주거", value: "HOUSING" },
  { label: "기타", value: "ETC" },
];

/* =========================
   utils
========================= */
function formatDateTime(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const formatAnswers = (answersData) =>
  answersData.map((answer) => {
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

/* =========================
   page
========================= */
export default function QnaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);

  const [answerText, setAnswerText] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editText, setEditText] = useState("");
  const [acceptingAnswerId, setAcceptingAnswerId] = useState(null);

  const isDevMode = process.env.NEXT_PUBLIC_DEV === "true";

  /* =========================
     fetch (ONE useEffect)
  ========================= */
  useEffect(() => {
    if (!params.id) return;

    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setIsLoadingAnswers(true);

        const q = await getQuestionData(params.id);

        incrementQuestionViews(params.id).catch(console.error);

        const a = await getAnswers(params.id);

        if (!mounted) return;

        setQuestion(q);
        setAnswers(formatAnswers(a));
      } catch (e) {
        console.error(e);
        if (mounted) {
          setQuestion(null);
          setAnswers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setIsLoadingAnswers(false);
        }
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  /* =========================
     early returns (SAFE)
  ========================= */
  if (loading) return <div className="p-8">로딩중...</div>;
  if (!question) return <div className="p-8">존재하지 않는 질문입니다.</div>;

  /* =========================
     derived values
  ========================= */
  const isAuthor = user?.id === question.authorId;
  const categoryLabel =
    CATEGORIES.find((c) => c.value === question.category)?.label ??
    question.category;

  /* =========================
     handlers
  ========================= */
  const refreshAnswers = async () => {
    const data = await getAnswers(params.id);
    setAnswers(formatAnswers(data));
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || isSubmittingAnswer) return;

    try {
      setIsSubmittingAnswer(true);
      await createAnswer(params.id, answerText.trim());
      setAnswerText("");
      await refreshAnswers();
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteQuestion(params.id);
    router.push("/town/qna");
  };

  const handleSubmitEdit = async (answerId) => {
    await updateAnswer(answerId, editText.trim());
    setEditingAnswerId(null);
    setEditText("");
    await refreshAnswers();
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
                console.log("[Render Answer]", {
                  id: answer.id,
                  isAccepted: answer.isAccepted,
                  type: typeof answer.isAccepted,
                });
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
                          {answer.author?.[0] || "?"}
                        </div>
                        <span>{answer.author || "익명"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {answer.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 본인 답변이거나 개발 모드일 때 수정/삭제 버튼 표시 */}
                        {(() => {
                          // writerId와 현재 사용자 ID 비교 (타입 변환 고려)
                          const isMyAnswer =
                            user?.id &&
                            answer.writerId &&
                            (String(user.id) === String(answer.writerId) ||
                              Number(user.id) === Number(answer.writerId));
                          const showButtons = isDevMode || isMyAnswer;

                          // 디버깅 로그
                          console.log("[Button Visibility]", {
                            answerId: answer.id,
                            writerId: answer.writerId,
                            userId: user?.id,
                            isMyAnswer,
                            isDevMode,
                            showButtons,
                          });

                          return showButtons ? (
                            <>
                              <button
                                onClick={() =>
                                  handleEditAnswer(answer.id, answer.content)
                                }
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
                                {acceptingAnswerId === answer.id
                                  ? "취소 중..."
                                  : "채택 취소"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAcceptAnswer(answer.id)}
                                disabled={acceptingAnswerId === answer.id}
                                className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {acceptingAnswerId === answer.id
                                  ? "채택 중..."
                                  : "채택"}
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
