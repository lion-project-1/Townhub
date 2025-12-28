"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(false);

  const isMyEvent =
    params.id === "1" || params.id === "100" || params.id === "999";

  const event = {
    id: params.id,
    title: "동네 장터",
    category: "문화",
    date: "2025-01-25",
    time: "14:00",
    location: "중앙공원",
    participants: 23,
    maxParticipants: 50,
    description:
      "동네 주민들이 함께하는 벼룩시장입니다. 집에서 사용하지 않는 물건을 판매하거나 필요한 물건을 저렴하게 구매할 수 있습니다. 이웃들과 소통하며 즐거운 시간을 보내세요!",
    organizer: isMyEvent ? user?.name || "나" : "김영희",
    organizerId: isMyEvent ? user?.id || "1" : "2",
    createdAt: "2025-01-10",
  };

  const isOrganizer = user?.id === event.organizerId;

  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
  };

  const handleDelete = () => {
    if (confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
      router.push("/town/events");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Image */}
        <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6">
          <Calendar className="w-24 h-24 text-green-400" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="mb-3 text-gray-900">{event.title}</h1>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded">
                {event.category}
              </span>
            </div>

            <div className="flex gap-2">
              {isOrganizer ? (
                <>
                  <Link
                    href={`/town/events/${params.id}/edit`}
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
                </>
              ) : (
                <button
                  onClick={handleJoinToggle}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isJoined
                      ? "border border-gray-300 hover:bg-gray-50"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      참여 취소
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      참여하기
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-gray-900">이벤트 정보</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3 text-gray-600">
                <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">날짜</div>
                  <div className="text-gray-900">{event.date}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">시간</div>
                  <div className="text-gray-900">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">장소</div>
                  <div className="text-gray-900">{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">참여 인원</div>
                  <div className="text-gray-900">
                    {event.participants}/{event.maxParticipants}명
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-gray-900">상세 설명</h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                {event.organizer[0]}
              </div>
              <div>
                <div className="text-sm text-gray-500">주최자</div>
                <div className="text-gray-900">{event.organizer}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-gray-900">참여자 ({event.participants})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: Math.min(event.participants, 12) }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white mb-2">
                    {index === 0 ? "김" : "참"}
                  </div>
                  <div className="text-sm text-gray-900">
                    {index === 0 ? event.organizer : `참여자 ${index}`}
                  </div>
                </div>
              )
            )}
          </div>
          {event.participants > 12 && (
            <div className="text-center mt-4 text-gray-500">
              외 {event.participants - 12}명
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
