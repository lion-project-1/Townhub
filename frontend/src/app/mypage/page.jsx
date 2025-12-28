"use client";

import Link from "next/link";
import {
  User,
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTown } from "@/app/contexts/TownContext";

export default function MyPage() {
  const { user } = useAuth();
  const { selectedTown } = useTown();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
              {user.name[0]}
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              {selectedTown && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedTown.name}</span>
                  {selectedTown.verified && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      인증 완료
                    </span>
                  )}
                </div>
              )}
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              설정
            </button>
          </div>
        </div>

        {/* Town Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="mb-4 text-gray-900">동네 정보</h2>
          {selectedTown ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">{selectedTown.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedTown.verified ? "인증 완료" : "인증 대기"}
                  </div>
                </div>
              </div>
              <Link
                href="/town-select"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                동네 변경
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">선택된 동네가 없습니다.</p>
              <Link
                href="/town-select"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
              >
                동네 선택하기
              </Link>
            </div>
          )}
        </div>

        {/* Activity Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">참여 모임</h3>
            </div>
            <div className="text-3xl text-gray-900">3</div>
            <p className="text-sm text-gray-500 mt-1">개의 모임에 참여 중</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">이벤트 참여</h3>
            </div>
            <div className="text-3xl text-gray-900">7</div>
            <p className="text-sm text-gray-500 mt-1">개의 이벤트에 참여</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">질문·답변</h3>
            </div>
            <div className="text-3xl text-gray-900">12</div>
            <p className="text-sm text-gray-500 mt-1">개의 활동</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-gray-900">최근 활동</h2>
          <div className="space-y-3">
            {[
              { type: "모임", title: "주말 등산 모임", date: "2025-01-15" },
              { type: "이벤트", title: "동네 장터", date: "2025-01-10" },
              {
                type: "Q&A",
                title: "맛집 추천 부탁드립니다",
                date: "2025-01-08",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div>
                  <span className="text-sm text-blue-600 mr-2">
                    {activity.type}
                  </span>
                  <span className="text-gray-900">{activity.title}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
