"use client";

import { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getMeetingDetail,
  requestJoinMeeting,
  changeMeetingStatus,
} from "@/app/api/meeting";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const result = await getMeetingDetail(params.id);
        setGroup(result.data);
      } catch (e) {
        console.error(e);
        alert("에러 발생! 콘솔 확인");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [params.id]);

  if (loading || authLoading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (!group) return null;

  /* =========================
     권한 / 상태 계산
  ========================= */
  const host = group.members.find((m) => m.role === "HOST");

  const isLoggedIn = !!user;
  const isLeader = isLoggedIn && user.id === host?.userId;
  const isJoined =
    isLoggedIn && group.members.some((m) => m.userId === user.id);

  const isFull = group.members.length >= group.capacity;
  const isRecruitingClosed = group.status === "ACTIVE";
  const canJoin = isLoggedIn && !isJoined && !isFull && !isRecruitingClosed;

  /* =========================
     상태 변경
  ========================= */
  const handleChangeStatus = async () => {
    const nextStatus = group.status === "RECRUITING" ? "ACTIVE" : "RECRUITING";

    const confirmMessage =
      nextStatus === "ACTIVE"
        ? "모집을 마감하고 활동 상태로 전환할까요?"
        : "다시 모집 상태로 변경할까요?";

    if (!confirm(confirmMessage)) return;

    try {
      await changeMeetingStatus(group.meetingId, nextStatus);
      setGroup((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    } catch (e) {
      console.error(e);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleJoinSubmit = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      await requestJoinMeeting(params.id, joinMessage);
      alert("가입 신청이 완료되었습니다.");
      setShowJoinModal(false);
      setJoinMessage("");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("가입 신청 중 오류가 발생했습니다.");
      setShowJoinModal(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6">
          <Users className="w-24 h-24 text-blue-400" />
        </div>

        {/* Main */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-gray-900 mb-2">{group.title}</h1>

              {/* 카테고리 + 상태 */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {group.category}
                </span>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    group.status === "RECRUITING"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {group.status === "RECRUITING" ? "모집중" : "활동중"}
                </span>
              </div>
            </div>

            {/* 버튼 영역 */}
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

                  <button
                    onClick={handleChangeStatus}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {group.status === "RECRUITING" ? "모집 마감" : "모집 재개"}
                  </button>

                  <Link
                    href={`/town/groups/${params.id}/manage`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    관리
                  </Link>
                </>
              ) : !isLoggedIn ? (
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  로그인 후 가입 가능
                </button>
              ) : (
                <button
                  disabled={!canJoin}
                  onClick={canJoin ? () => setShowJoinModal(true) : undefined}
                  className={`px-4 py-2 rounded-lg ${
                    canJoin
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  가입하기
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-gray-900">모임 소개</h2>
            <p className="text-gray-600 mb-6">{group.description}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={<Users />} label="인원">
                {group.members.length}/{group.capacity}명
              </InfoItem>
              <InfoItem icon={<Calendar />} label="일정">
                {group.schedule}
              </InfoItem>
              <InfoItem icon={<MapPin />} label="장소">
                {group.meetingPlace}
              </InfoItem>
              <InfoItem icon={<Users />} label="모임장">
                {host?.nickname}
              </InfoItem>
            </div>
          </div>
        </div>

        {/* =========================
            Members (모임장 우선)
        ========================= */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="mb-4 text-gray-900">멤버 ({group.members.length})</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...group.members]
              .sort((a, b) => {
                if (a.role === "HOST") return -1;
                if (b.role === "HOST") return 1;
                return 0;
              })
              .map((member) => (
                <div
                  key={member.userId}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white mb-2">
                    {member.nickname[0]}
                  </div>
                  <div className="text-sm text-gray-900">{member.nickname}</div>
                  {member.role === "HOST" && (
                    <span className="text-xs text-blue-600 mt-1">모임장</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 가입 메시지 모달 */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            <h2 className="text-lg text-gray-900 mb-4">가입 메시지</h2>

            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-lg p-3"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleJoinSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                가입 요청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   InfoItem
========================= */
function InfoItem({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="w-5 h-5">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
