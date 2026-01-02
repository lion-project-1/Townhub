"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, UserMinus, ArrowLeft } from "lucide-react";

import {
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  getMeetingMembers,
  removeMeetingMember,
} from "@/app/api/meeting";

export default function GroupManagePage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id;

  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  /* ======================
     가입 신청 목록
     ====================== */
  useEffect(() => {
    if (activeTab !== "requests") return;

    getJoinRequests(meetingId, token)
      .then((res) => {
        if (res.success) setRequests(res.data);
        else handleError(res.code, res.message);
      })
      .catch((e) => {
        handleError(e?.response?.data?.code, e?.response?.data?.message);
      });
  }, [activeTab, meetingId]);

  /* ======================
     멤버 목록
     ====================== */
  useEffect(() => {
    if (activeTab !== "members") return;

    getMeetingMembers(meetingId, token)
      .then((res) => {
        if (res.success) setMembers(res.data);
        else handleError(res.code, res.message);
      })
      .catch((e) => {
        handleError(e?.response?.data?.code, e?.response?.data?.message);
      });
  }, [activeTab, meetingId]);

  /* ======================
     승인 / 거절 / 강퇴
     ====================== */
  const handleApprove = async (requestId) => {
    try {
      const res = await approveJoinRequest(meetingId, requestId, token);
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      } else {
        handleError(res.code, res.message);
      }
    } catch (e) {
      handleError(e?.response?.data?.code, e?.response?.data?.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await rejectJoinRequest(meetingId, requestId, token);
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      } else {
        handleError(res.code, res.message);
      }
    } catch (e) {
      handleError(e?.response?.data?.code, e?.response?.data?.message);
    }
  };

  const handleRemove = async (memberId) => {
    if (!confirm("정말로 이 멤버를 내보내시겠습니까?")) return;

    try {
      const res = await removeMeetingMember(meetingId, memberId, token);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        handleError(res.code, res.message);
      }
    } catch (e) {
      handleError(e?.response?.data?.code, e?.response?.data?.message);
    }
  };

  /* ======================
     에러 코드 처리
     ====================== */
  const handleError = (code, message) => {
    switch (code) {
      case "MEETING-002":
        alert("해당 모임이 존재하지 않습니다.");
        router.push("/town/groups");
        break;
      case "MEETING-004":
        alert("방장만 접근할 수 있습니다.");
        router.back();
        break;
      case "MEETING-006":
        alert("이미 모임의 정원이 초과되었습니다.");
        break;
      case "MEETING-007":
        alert("이미 모임의 멤버입니다.");
        break;
      case "MEETING-008":
        alert("모임 가입 신청을 찾을 수 없습니다.");
        break;
      default:
        alert(message || "요청 처리 중 오류가 발생했습니다.");
    }
  };

  /* ======================
     UI (변경 없음)
     ====================== */
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/town/groups/${meetingId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            모임으로 돌아가기
          </Link>
          <h1 className="text-gray-900">모임 관리</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 px-6 py-4 ${
                activeTab === "requests"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              가입 신청 ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 px-6 py-4 ${
                activeTab === "members"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              멤버 관리 ({members.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === "requests" && (
              <div className="space-y-4">
                {requests.length > 0 ? (
                  requests.map((r) => (
                    <div
                      key={r.requestId}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{r.userName}</h3>
                          <p className="text-sm text-gray-600">{r.message}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {r.requestedAt}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(r.requestId)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" /> 승인
                        </button>
                        <button
                          onClick={() => handleReject(r.requestId)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" /> 거절
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    새로운 가입 신청이 없습니다.
                  </div>
                )}
              </div>
            )}

            {activeTab === "members" && (
              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                        {m.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{m.name}</span>
                          {m.role === "HOST" && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              모임장
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          가입일: {m.joinedAt}
                        </span>
                      </div>
                    </div>
                    {m.role !== "HOST" && (
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="px-3 py-1.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1"
                      >
                        <UserMinus className="w-4 h-4" /> 내보내기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
