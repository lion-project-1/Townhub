"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getMeetingDetail, updateMeeting } from "@/app/api/meeting";

const CATEGORIES = [
  { label: "운동", value: "SPORTS" },
  { label: "문화", value: "CULTURE" },
  { label: "취미", value: "HOBBY" },
  { label: "스터디", value: "STUDY" },
  { label: "반려동물", value: "PET" },
  { label: "기타", value: "ETC" },
];

export default function GroupEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    meetingPlace: "",
    schedule: "",
    capacity: "",
  });

  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  /**
   * 기존 모임 데이터 로드 + 방장 체크
   */
  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const result = await getMeetingDetail(params.id, token);
        const meeting = result.data;

        const host = meeting.members.find((m) => m.role === "HOST");
        if (!user || host?.userId !== user.id) {
          router.replace(`/town/groups/${params.id}`);
          return;
        }

        setIsLeader(true);

        setFormData({
          title: meeting.title,
          category: meeting.category,
          description: meeting.description ?? "",
          meetingPlace: meeting.meetingPlace,
          schedule: meeting.schedule,
          capacity: meeting.capacity,
        });
      } catch (e) {
        console.error(e);
        router.replace(`/town/groups/${params.id}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMeeting();
    }
  }, [params.id, user, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * 수정 제출
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMeeting(
        params.id,
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          meetingPlace: formData.meetingPlace,
          schedule: formData.schedule,
          capacity: Number(formData.capacity),
        },
        token
      );

      router.push(`/town/groups/${params.id}`);
    } catch (e) {
      alert("모임 수정에 실패했습니다.");
      console.error(e);
    }
  };

  if (loading || !isLeader) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 text-gray-900">모임 수정</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">모임 이름 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">모임 소개</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">장소 *</label>
              <input
                type="text"
                name="meetingPlace"
                value={formData.meetingPlace}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">최대 인원 *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="2"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
