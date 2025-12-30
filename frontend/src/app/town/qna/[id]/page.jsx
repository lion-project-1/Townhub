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
import { getQuestion } from "@/app/api/questions"


const CATEGORIES = [
    { label: "맛집", value: "RESTAURANT" },
    { label: "의료", value: "HOSPITAL" },
    { label: "생활", value: "LIVING" },
    { label: "교통", value: "TRAFFIC" },
    { label: "교육", value: "EDUCATION" },
    { label: "주거", value: "HOUSING" },
    { label: "기타", value: "ETC" },
];


export default function QnaDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [answerText, setAnswerText] = useState("");


    const [question, setQuestion] = useState(null);


    useEffect(() => {
        async function fetchQuestion() {
            try {
                const data = await getQuestion(params.id);
                setQuestion(data);
            } catch (e) {
                console.error(e);
            }
        }
        fetchQuestion();
    }, [params.id]);



    if (!question) {
        return <div>로딩중...</div>;
    }


    const categoryLabel =
        CATEGORIES.find(c => c.value === question.category)?.label
        ?? question.category;

    const formattedDate = question.createdAt.replace("T", " ");

    const answers = [
    {
      id: 1,
      content:
        '중앙시장 근처에 있는 "전통한식" 강추합니다! 룸도 있고 주차장도 넓어요. 음식도 정말 맛있고 가격도 합리적입니다.',
      author: "이영희",
      authorId: "3",
      likes: 8,
      isAccepted: true,
      createdAt: "2025-01-22 10:30",
    },
    {
      id: 2,
      content:
        '공원 앞 "우리집밥상"도 괜찮아요. 분위기도 좋고 음식도 깔끔합니다.',
      author: "박철수",
      authorId: "4",
      likes: 3,
      isAccepted: false,
      createdAt: "2025-01-22 11:00",
    },
  ];

  const isAuthor = user?.id === question.authorId;

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    alert("답변이 등록되었습니다!");
    setAnswerText("");
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

                <p className="text-gray-700 leading-relaxed mb-4">
                  {answer.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                      {answer.author[0]}
                    </div>
                    <span>{answer.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {answer.createdAt}
                    </span>
                  </div>

                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{answer.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                답변 등록
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
