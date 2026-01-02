'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

const CATEGORIES = ['축제', '봉사', '문화', '체육', '교육', '기타', '번개'];

export default function EventNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [timeWarning, setTimeWarning] = useState('');

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 번개 카테고리 선택 시 날짜를 오늘로 자동 설정
  useEffect(() => {
    if (formData.category === '번개' && formData.date !== getTodayDateString()) {
      setFormData((prev) => ({
        ...prev,
        date: getTodayDateString(),
      }));
    }
  }, [formData.category]);

  // 시간 경고 체크
  useEffect(() => {
    if (formData.category === '번개' && formData.date && formData.time) {
      const today = new Date();
      const [hours, minutes] = formData.time.split(':').map(Number);
      const selectedTime = new Date(today);
      selectedTime.setHours(hours, minutes, 0, 0);

      if (selectedTime < today) {
        setTimeWarning('선택한 시간이 현재 시간보다 과거입니다.');
      } else {
        setTimeWarning('');
      }
    } else {
      setTimeWarning('');
    }
  }, [formData.category, formData.date, formData.time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 번개 카테고리에서 날짜 변경 시 검증
    if (name === 'date' && formData.category === '번개') {
      const today = getTodayDateString();
      if (value !== today) {
        setErrors((prev) => ({
          ...prev,
          date: '번개 이벤트는 당일에만 생성할 수 있어요.',
        }));
        return;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.date;
          return newErrors;
        });
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 번개 카테고리 검증
    if (formData.category === '번개') {
      const today = getTodayDateString();
      if (formData.date !== today) {
        setErrors((prev) => ({
          ...prev,
          date: '번개 이벤트는 당일에만 생성할 수 있어요.',
        }));
        return;
      }
    }

    // 에러가 있으면 제출 차단
    if (Object.keys(errors).length > 0) {
      return;
    }

    router.push('/town/events/1');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 text-gray-900">이벤트 만들기</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">이벤트 제목 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 동네 장터"
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">날짜 *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={formData.category === '번개' ? getTodayDateString() : undefined}
                  max={formData.category === '번개' ? getTodayDateString() : undefined}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.date
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {formData.category === '번개' && (
                  <p className="text-sm text-blue-600 mt-1">
                    번개 이벤트는 당일에만 생성할 수 있어요.
                  </p>
                )}
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-gray-700">시간 *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {timeWarning && (
                  <p className="text-sm text-orange-600 mt-1">{timeWarning}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">장소 *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 중앙공원"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">최대 참여 인원 *</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1-1000"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">상세 설명 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이벤트에 대해 자세히 설명해주세요"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 이벤트 내용, 준비물, 주의사항 등을 상세히 적어주세요.
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
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
