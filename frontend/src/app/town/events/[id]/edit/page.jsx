"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getEventDetail, updateEvent, deleteEvent } from "@/app/api/events";
import { useTown } from "@/app/contexts/TownContext";

// 카테고리 한글 -> 백엔드 enum 매핑
const CATEGORY_MAP = {
  '축제': 'FESTIVAL',
  '봉사': 'VOLUNTEER',
  '문화': 'CULTURE',
  '체육': 'SPORTS',
  '교육': 'EDUCATION',
  '기타': 'ETC',
  '번개': 'FLASH',
};

// 백엔드 enum -> 한글 매핑
const CATEGORY_REVERSE_MAP = {
  'FESTIVAL': '축제',
  'VOLUNTEER': '봉사',
  'CULTURE': '문화',
  'SPORTS': '체육',
  'EDUCATION': '교육',
  'ETC': '기타',
  'FLASH': '번개',
};

const CATEGORIES = ["축제", "봉사", "문화", "체육", "교육", "기타", "번개"];

export default function EventEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedTown } = useTown();
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [timeWarning, setTimeWarning] = useState("");

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 번개 카테고리 선택 시 날짜를 오늘로 자동 설정
  useEffect(() => {
    if (formData.category === "번개" && formData.date !== getTodayDateString()) {
      setFormData((prev) => ({
        ...prev,
        date: getTodayDateString(),
      }));
    }
  }, [formData.category]);

  // 시간 경고 체크
  useEffect(() => {
    if (formData.category === "번개" && formData.date && formData.time) {
      const today = new Date();
      const [hours, minutes] = formData.time.split(":").map(Number);
      const selectedTime = new Date(today);
      selectedTime.setHours(hours, minutes, 0, 0);

      if (selectedTime < today) {
        setTimeWarning("선택한 시간이 현재 시간보다 과거입니다.");
      } else {
        setTimeWarning("");
      }
    } else {
      setTimeWarning("");
    }
  }, [formData.category, formData.date, formData.time]);

  // 기존 이벤트 데이터 로드 + 주최자 체크
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const result = await getEventDetail(params.id, token);
        const eventData = result.data;

        // 주최자 권한 확인
        if (!user || eventData.hostUserId !== user.id) {
          router.replace(`/town/events/${params.id}`);
          return;
        }

        setIsOrganizer(true);

        // 이벤트 데이터를 폼 형식으로 변환
        const startAt = eventData.startAt ? new Date(eventData.startAt) : new Date();
        const date = startAt.toISOString().split("T")[0];
        const time = startAt.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setFormData({
          title: eventData.title || "",
          category: CATEGORY_REVERSE_MAP[eventData.category] || "",
          date: date,
          time: time,
          location: eventData.eventPlace || "",
          maxParticipants: String(eventData.capacity || ""),
          description: eventData.description || "",
        });
      } catch (e) {
        console.error("이벤트 조회 실패:", e);
        router.replace(`/town/events/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEvent();
    }
  }, [params.id, user, token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 번개 카테고리에서 날짜 변경 시 검증
    if (name === "date" && formData.category === "번개") {
      const today = getTodayDateString();
      if (value !== today) {
        setErrors((prev) => ({
          ...prev,
          date: "번개 이벤트는 당일에만 수정할 수 있어요.",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 동네 선택 확인
    if (!selectedTown || !selectedTown.id) {
      alert("동네를 먼저 선택해주세요.");
      router.push("/town-select");
      return;
    }

    // 번개 카테고리 검증
    if (formData.category === "번개") {
      const today = getTodayDateString();
      if (formData.date !== today) {
        setErrors((prev) => ({
          ...prev,
          date: "번개 이벤트는 당일에만 수정할 수 있어요.",
        }));
        return;
      }
    }

    // 에러가 있으면 제출 차단
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // date + time을 startAt (한국 시간 기준 ISO string)으로 변환
      const [hours, minutes] = formData.time.split(":").map(Number);
      const [year, month, day] = formData.date.split("-").map(Number);

      const yearStr = String(year).padStart(4, "0");
      const monthStr = String(month).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const hoursStr = String(hours).padStart(2, "0");
      const minutesStr = String(minutes).padStart(2, "0");
      const startAt = `${yearStr}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:00`;

      // 카테고리 한글 -> enum 변환
      const categoryEnum = CATEGORY_MAP[formData.category];
      if (!categoryEnum) {
        alert("올바른 카테고리를 선택해주세요.");
        return;
      }

      // API 요청 데이터 구성
      const payload = {
        title: formData.title,
        description: formData.description || "",
        category: categoryEnum,
        locationId: selectedTown.id,
        eventPlace: formData.location,
        startAt: startAt,
        capacity: Number(formData.maxParticipants),
      };

      await updateEvent(params.id, payload, token);

      alert("이벤트가 수정되었습니다.");
      router.push(`/town/events/${params.id}`);
    } catch (e) {
      console.error("이벤트 수정 실패:", e);
      const errorMessage =
        e?.response?.data?.message || "이벤트 수정에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 이벤트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteEvent(params.id, token);
      alert("이벤트가 삭제되었습니다.");
      router.push("/town/events");
    } catch (e) {
      console.error("이벤트 삭제 실패:", e);
      const errorMessage =
        e?.response?.data?.message || "이벤트 삭제에 실패했습니다.";
      alert(errorMessage);
    }
  };

  if (loading || !isOrganizer) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900">이벤트 수정</h1>
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
                  min={formData.category === "번개" ? getTodayDateString() : undefined}
                  max={formData.category === "번개" ? getTodayDateString() : undefined}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.date
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                />
                {formData.category === "번개" && (
                  <p className="text-sm text-blue-600 mt-1">
                    번개 이벤트는 당일에만 수정할 수 있어요.
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
              <label className="block mb-2 text-gray-700">
                최대 참여 인원 *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="2"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2-100"
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
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {submitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
