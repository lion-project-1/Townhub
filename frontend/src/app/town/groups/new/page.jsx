'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

const CATEGORIES = ['운동', '문화', '취미', '스터디', '반려동물', '기타'];

export default function GroupNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    schedule: '',
    maxMembers: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/town/groups/1');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 text-gray-900">새 모임 만들기</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">모임 이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 주말 등산 모임"
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
              <label className="block mb-2 text-gray-700">모임 소개 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="모임에 대해 소개해주세요"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">장소 *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 북한산 일대"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">일정 *</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 매주 토요일 오전 9시"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">최대 인원 *</label>
              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min="2"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2-100"
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
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
