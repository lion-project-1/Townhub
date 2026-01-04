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
import { getQuestionData, incrementQuestionViews, deleteQuestion } from "@/app/api/questions";





const CATEGORIES = [
    { label: "맛집", value: "RESTAURANT" },
    { label: "의료", value: "HOSPITAL" },
    { label: "생활", value: "LIVING" },
    { label: "교통", value: "TRAFFIC" },
    { label: "교육", value: "EDUCATION" },
    { label: "주거", value: "HOUSING" },
    { label: "기타", value: "ETC" },
];


// 날짜 포맷팅 함수: ISO 8601 형식을 YYYY-MM-DD HH:mm 형식으로 변환
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
  const searchParams = useSearchParams();
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

  const [question, setQuestion] = useState(null);





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
        // console.log("useEffect 실행");
        if (!params.id) return;

        let isMounted = true;

        const fetchData = async () => {
            try {

                const updatedQuestion = await incrementQuestionViews(params.id);
                if (isMounted) setQuestion(updatedQuestion);


                setIsLoadingAnswers(true);
                await refreshAnswers();
            } catch (error) {
                console.error(error);
                if (isMounted) setAnswers([]);
            } finally {
                if (isMounted) setIsLoadingAnswers(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [params.id]);



    /*useEffect(() 하나로 합침

     useEffect(() => {
        // 이미 불러왔거나 params.id가 없으면 그냥 리턴
        if (!params.id || hasFetched) return;

        let isMounted = true; // 마운트 여부 체크

        const fetchQuestion = async () => {
            try {
                const data = await getQuestion(params.id);
                // 컴포넌트가 아직 마운트 되어 있을 때만 상태 변경
                if (isMounted) {
                    setQuestion(data);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchQuestion();

        // cleanup: 컴포넌트 언마운트 시 isMounted를 false로
        return () => {
            isMounted = false;
        };
  }, [params.id, hasFetched]);


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

     */

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




      // 질문


      if (!question) {
          return <div>로딩중...</div>;
      }


      const categoryLabel =
          CATEGORIES.find(c => c.value === question.category)?.label
          ?? question.category;

      const formattedDate = question.createdAt.replace("T", " ");


      const isAuthor = user?.id === question.authorId;


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
              {question.resolved  && (
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
              {categoryLabel}
            </span>
            <span>{question.writer}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formattedDate}
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
