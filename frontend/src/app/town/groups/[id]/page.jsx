"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  MapPin,
  Edit,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function GroupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(false);

  const isMyGroup =
    params.id === "1" || params.id === "100" || params.id === "999";

  const group = {
    id: params.id,
    name: "주말 등산 모임",
    category: "운동",
    description:
      "매주 주말 근처 산을 함께 오르는 모임입니다. 초보자도 환영하며, 건강한 취미 생활을 함께 만들어가요!",
    members: 12,
    maxMembers: 15,
    status: "모집중",
    location: "북한산 일대",
    schedule: "매주 토요일 오전 9시",
    createdAt: "2025-01-01",
    leaderId: isMyGroup ? user?.id || "1" : "2",
    leaderName: isMyGroup ? user?.name || "나" : "김영희",
  };

  const isLeader = user?.id === group.leaderId;

  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6">
          <Users className="w-24 h-24 text-blue-400" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-gray-900">{group.name}</h1>
                <span
                  className={`px-3 py-1 rounded ${
                    group.status === "모집중"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {group.status}
                </span>
              </div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded">
                {group.category}
              </span>
            </div>

            <div className="flex gap-2">
              {isLeader ? (
                <>
                  <Link
                    href={`/town/groups/${params.id}/edit`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    수정
                  </Link>
                  <Link
                    href={`/town/groups/${params.id}/manage`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    관리
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleJoinToggle}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isJoined
                      ? "border border-gray-300 hover:bg-gray-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      탈퇴하기
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      가입하기
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-gray-900">모임 소개</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {group.description}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5" />
                <div>
                  <div className="text-sm text-gray-500">인원</div>
                  <div>
                    {group.members}/{group.maxMembers}명
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <div className="text-sm text-gray-500">일정</div>
                  <div>{group.schedule}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <div>
                  <div className="text-sm text-gray-500">장소</div>
                  <div>{group.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5" />
                <div>
                  <div className="text-sm text-gray-500">모임장</div>
                  <div>{group.leaderName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="mb-4 text-gray-900">멤버 ({group.members})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: group.members }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white mb-2">
                  {index === 0 ? "김" : "멤"}
                </div>
                <div className="text-sm text-gray-900">
                  {index === 0 ? group.leaderName : `멤버 ${index}`}
                </div>
                {index === 0 && (
                  <span className="text-xs text-blue-600 mt-1">모임장</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-gray-900">모임 게시판</h2>
          <div className="space-y-3">
            {[
              {
                title: "이번 주 토요일 등산 일정 공지",
                author: "김철수",
                date: "2025-01-20",
              },
              {
                title: "등산 장비 공동 구매 제안",
                author: "이영희",
                date: "2025-01-18",
              },
              {
                title: "신규 멤버 환영합니다!",
                author: "김철수",
                date: "2025-01-15",
              },
            ].map((post, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <h3 className="text-gray-900 mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
