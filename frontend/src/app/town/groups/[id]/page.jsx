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
import { getMeetingDetail, requestJoinMeeting } from "@/app/api/meeting";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  // ✅ 가입 메시지 관련 상태
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const result = await getMeetingDetail(params.id, token);
        setGroup(result.data);
      } catch (e) {
        console.error(e);
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (!group) return null;

  const host = group.members.find((m) => m.role === "HOST");
  const isLeader = user?.id === host?.userId;
  const isJoined = group.members.some((m) => m.userId === user?.id);

  const isFull = group.members.length >= group.capacity;
  const isRecruitingClosed = group.status === "ACTIVE";
  const canJoin = !isJoined && !isFull && !isRecruitingClosed;

  const handleJoinSubmit = async () => {
    try {
      await requestJoinMeeting(params.id, token /*, joinMessage */);

      alert("가입 신청이 완료되었습니다.");
      setShowJoinModal(false);
      setJoinMessage("");
      router.refresh();
    } catch (e) {
      console.error(e);

      const code = e?.response?.data?.code;

      switch (code) {
        case "MEETING-005":
          alert("이미 모임에 신청하셨습니다.");
          setShowJoinModal(false);
          break;

        case "MEETING-007":
          alert("이미 모임에 참여 중입니다.");
          setShowJoinModal(false);
          break;

        case "MEETING-006":
          alert("모임 정원이 가득 찼습니다.");
          setShowJoinModal(false);
          break;

        default:
          alert("가입 신청 중 오류가 발생했습니다.");
      }
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
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-gray-900">{group.title}</h1>
                <span
                  className={`px-3 py-1 rounded ${
                    group.status === "RECRUITING"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {group.status === "RECRUITING" ? "모집중" : "활동중"}
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
                  disabled={!canJoin}
                  onClick={canJoin ? () => setShowJoinModal(true) : undefined}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isJoined
                      ? "border border-gray-300 hover:bg-gray-50"
                      : canJoin
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      탈퇴하기
                    </>
                  ) : canJoin ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      가입하기
                    </>
                  ) : (
                    "모집이 마감되었습니다"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-gray-900">모임 소개</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {group.description}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
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

        {/* Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="mb-4 text-gray-900">멤버 ({group.members.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {group.members.map((member) => (
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

      {/* ✅ 가입 메시지 모달 */}
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
              placeholder="모임장에게 전달할 가입 메시지를 작성해주세요."
              className="w-full h-32 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleJoinSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
