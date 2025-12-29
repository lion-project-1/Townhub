'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { createQuestion } from "src/app/api/questions";
import { getCategories } from "src/app/api/categories";

const CATEGORIES = ['맛집', '교통', '생활', '의료', '교육', '기타'];

export default function QnaNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

    const [categories, setCategories] = useState([]); // ← 카테고리 상태 추가

    // 페이지 로딩 시 카테고리 가져오기
    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchCategories();
    }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          // const token = "로그인토큰있으면여기"; // 실제 로그인 토큰 사용
          const result = await createQuestion(formData, token);
          console.log(result); // 등록된 질문 확인
          router.push(`/town/qna/${result.id}`); // 상세페이지 이동
      } catch (error) {
          console.error(error);
          alert("질문 등록 중 오류가 발생했습니다.");
      }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 text-gray-900">질문하기</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
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
                  <option key={category} value={category}>
                    {category}
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
              <p className="text-sm text-gray-500 mt-2">
                💡 이웃들이 쉽게 이해하고 답변할 수 있도록 구체적으로 작성해주세요.
              </p>
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
              질문하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
