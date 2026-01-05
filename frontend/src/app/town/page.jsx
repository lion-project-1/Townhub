"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  MessageCircle,
  TrendingUp,
  Bell,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";
import { useTown } from "@/app/contexts/TownContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TownDashboard() {
  const router = useRouter();
  const { selectedTown } = useTown();
  const { user } = useAuth();

  useEffect(() => {
    if (!selectedTown) {
      router.replace("/town-select");
    }
  }, [selectedTown, router]);

  // ✅ 이동 중에는 아무것도 렌더링하지 않음
  if (!selectedTown) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
          <h1 className="mb-2">{selectedTown.name} 동네</h1>
          <p className="text-blue-100">
            이웃들과 함께하는 따뜻한 커뮤니티에 오신 것을 환영합니다!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">활동 모임</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl text-gray-900">24</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+3 이번 주</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">예정 이벤트</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl text-gray-900">12</div>
            <div className="text-sm text-gray-500 mt-2">이번 달</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Q&A</h3>
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl text-gray-900">156</div>
            <div className="text-sm text-gray-500 mt-2">총 질문 수</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">이웃</h3>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl text-gray-900">1,234</div>
            <div className="text-sm text-gray-500 mt-2">활동 중인 회원</div>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-blue-900 mb-1">공지사항</h3>
              <p className="text-blue-800 text-sm">
                다음 주 토요일 동네 대청소 이벤트가 진행됩니다. 많은 참여
                부탁드립니다!
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hot Groups */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">🔥 인기 모임</h2>
              <Link
                href="/town/groups"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "주말 등산 모임",
                  category: "운동",
                  members: 12,
                  maxMembers: 15,
                },
                {
                  id: 2,
                  name: "독서 토론 클럽",
                  category: "문화",
                  members: 8,
                  maxMembers: 10,
                },
                {
                  id: 3,
                  name: "반려동물 산책",
                  category: "반려동물",
                  members: 15,
                  maxMembers: 20,
                },
              ].map((group) => (
                <Link
                  key={group.id}
                  href={`/town/groups/${group.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900">{group.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {group.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {group.members}/{group.maxMembers}명
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">📅 다가오는 이벤트</h2>
              <Link
                href="/town/events"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "동네 장터",
                  date: "2025-01-25",
                  time: "14:00",
                  participants: 23,
                },
                {
                  id: 2,
                  title: "벚꽃 산책",
                  date: "2025-04-10",
                  time: "10:00",
                  participants: 45,
                },
                {
                  id: 3,
                  title: "환경 정화 활동",
                  date: "2025-02-15",
                  time: "09:00",
                  participants: 18,
                },
              ].map((event) => (
                <Link
                  key={event.id}
                  href={`/town/events/${event.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <h3 className="text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <span>{event.time}</span>
                    <span>{event.participants}명 참여</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Q&A */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">❓ 최신 질문</h2>
              <Link
                href="/town/qna"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  title: "이 근처 맛있는 한식당 추천해주세요",
                  author: "김민수",
                  answers: 5,
                  time: "10분 전",
                },
                {
                  id: 2,
                  title: "반려동물 동반 가능한 카페 있나요?",
                  author: "박지영",
                  answers: 3,
                  time: "1시간 전",
                },
                {
                  id: 3,
                  title: "주차하기 좋은 공영 주차장 위치 알려주세요",
                  author: "이철수",
                  answers: 8,
                  time: "2시간 전",
                },
              ].map((question) => (
                <Link
                  key={question.id}
                  href={`/town/qna/${question.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 flex-1">{question.title}</h3>
                    <span className="text-sm text-gray-500 ml-4">
                      {question.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{question.author}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      답변 {question.answers}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
