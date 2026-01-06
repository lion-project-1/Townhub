"use client";

import Link from "next/link";
import { Users, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTown } from "@/app/contexts/TownContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getTownDashboard } from "@/app/api/dashboard";

export default function TownDashboard() {
  const router = useRouter();
  const { selectedTown } = useTown();
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 대시보드 조회
  useEffect(() => {
    if (!selectedTown?.id) return;

    getTownDashboard(selectedTown.id)
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, [selectedTown]);

  // 🔹 동네 선택 안 된 경우
  if (!selectedTown) {
    router.replace("/town-select");
    return null;
  }

  // 🔹 로딩 중
  if (loading || !dashboard) {
    return null;
  }

  const { stats, popularMeetings, upcomingEvents, latestQuestions } = dashboard;

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
            <div className="text-3xl text-gray-900">{stats.activeMeetings}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">예정 이벤트</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl text-gray-900">{stats.upcomingEvents}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Q&A</h3>
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl text-gray-900">{stats.totalQuestions}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">이웃</h3>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl text-gray-900">{stats.activeUsers}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 🔥 인기 모임 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">🔥 인기 모임</h2>
              <Link
                href="/town/groups"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {popularMeetings.map((group) => (
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

          {/* 📅 다가오는 이벤트 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">📅 다가오는 이벤트</h2>
              <Link
                href="/town/events"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/town/events/${event.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <h3 className="text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.startAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span>
                      {event.members}/{event.capacity}명
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ❓ 최신 질문 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">❓ 최신 질문</h2>
              <Link
                href="/town/qna"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {latestQuestions.map((q) => (
                <Link
                  key={q.id}
                  href={`/town/qna/${q.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 flex-1">{q.title}</h3>
                    <span className="text-sm text-gray-500 ml-4">
                      {new Date(q.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{q.author}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
