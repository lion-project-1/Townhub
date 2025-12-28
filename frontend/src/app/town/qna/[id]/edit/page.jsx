"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { updateQuestion, deleteQuestion } from "@/app/api/questions";

const CATEGORIES = [
  { label: "맛집", value: "RESTAURANT" },
  { label: "의료", value: "HOSPITAL" },
  { label: "생활", value: "LIVING" },
  { label: "교통", value: "TRAFFIC" },
  { label: "교육", value: "EDUCATION" },
  { label: "주거", value: "HOUSING" },
  { label: "기타", value: "ETC" },
];

export default function QnaEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  //const { user, token } = useAuth();
  const token = "tmpToken";

  const isMyQuestion =
    params.id === "1" || params.id === "100" || params.id === "999";
  const isAuthor = isMyQuestion && user?.id;
  // const isAuthor = true;

  useEffect(() => {
    if (!isAuthor) {
      router.push(`/town/qna/${params.id}`);
    }
  }, [isAuthor, router, params.id]);

  const [formData, setFormData] = useState({
    title: "이 근처 맛있는 한식당 추천해주세요",
    category: "RESTAURANT",
    content:
      "가족 모임을 위해 괜찮은 한식당을 찾고 있습니다. 10명 정도 수용 가능하고, 주차도 편한 곳이면 좋겠어요. 추천 부탁드립니다!",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   router.push(`/town/qna/${params.id}`);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateQuestion(
        params.id,
        {
          questionCategory: formData.category, // 🔥 enum 그대로 전달
          title: formData.title,
          content: formData.content,
        },
        token
      );

      alert("질문이 수정되었습니다.");
      router.push(`/town/qna/${params.id}`);
    } catch (error) {
      alert(error.message || "질문 수정에 실패했습니다.");
    }
  };

  // const handleDelete = () => {
  //   if (confirm("정말로 이 질문을 삭제하시겠습니까?")) {
  //     router.push("/town/qna");
  //   }
  // };

  // ✅ 질문 삭제
  const handleDelete = async () => {
    console.log("삭제 버튼 클릭됨");
    if (!confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    try {
      await deleteQuestion(params.id, token);
      alert("질문이 삭제되었습니다.");
      router.push("/town/qna");
    } catch (error) {
      alert(error.message || "질문 삭제에 실패했습니다.");
    }
  };

  if (!isAuthor) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900">질문 수정</h1>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">제목 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="질문을 간단히 요약해주세요"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">카테고리 *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">선택하세요</option>
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">내용 *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="궁금한 내용을 자세히 작성해주세요"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
