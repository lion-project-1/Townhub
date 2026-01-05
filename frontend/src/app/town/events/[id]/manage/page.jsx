"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, UserMinus, ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getEventDetail,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  getEventManageMembers,
  removeEventManageMember,
} from "@/app/api/events";

/* ======================
   날짜 포맷 함수
   ====================== */
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.id;

  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  /* ======================
     이벤트 상세 조회 및 권한 확인
     ====================== */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const result = await getEventDetail(eventId);
        const eventData = result.data;

        // 호스트 권한 확인
        if (eventData.hostUserId !== user?.id) {
          alert("이벤트 주최자만 접근할 수 있습니다.");
          router.back();
          return;
        }

        setEvent(eventData);
      } catch (e) {
        console.error("이벤트 조회 실패:", e);
        handleError(e?.response?.data?.code, e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadEvent();
    }
  }, [eventId, token, user?.id, router]);

  /* ======================
     참여 신청 목록 조회
     ====================== */
  useEffect(() => {
    if (activeTab !== "requests" || !event) return;

    const loadRequests = async () => {
      try {
        const result = await getJoinRequests(eventId);
        if (result.success) {
          setRequests(result.data || []);
        } else {
          handleError(result.code, result.message);
        }
      } catch (e) {
        console.error("참여 신청 목록 조회 실패:", e);
        handleError(e?.response?.data?.code, e?.response?.data?.message);
      }
    };

    loadRequests();
  }, [activeTab, eventId, token, event]);

  /* ======================
     멤버 목록 조회 (페이지 로드 시 한 번만)
     ====================== */
  useEffect(() => {
    if (!event) return;

    const loadMembers = async () => {
      try {
        const result = await getEventManageMembers(eventId);
        if (result.success && result.data) {
          setMembers(result.data || []);
        } else {
          // API 응답이 success가 아니거나 data가 없는 경우
          setMembers([]);
        }
      } catch (e) {
        console.error("멤버 목록 조회 실패:", e);
        // 401/403 에러 처리
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          alert("로그인이 필요하거나 권한이 없습니다.");
          router.push("/login");
          return;
        }
        handleError(e?.response?.data?.code, e?.response?.data?.message);
        setMembers([]);
      }
    };

    loadMembers();
  }, [eventId, token, event, router]);

  /* ======================
     승인 / 거절
     ====================== */
  const handleApprove = async (requestId) => {
    // 종료된 이벤트는 수락 불가
    if (event?.isEnded) {
      alert("종료된 이벤트는 참여 신청을 수락할 수 없습니다.");
      return;
    }

    try {
      const result = await approveJoinRequest(eventId, requestId);
      if (result.success) {
        // 신청 목록에서 제거
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        // 이벤트 정보 재조회하여 멤버 목록 업데이트
        refreshEvent();
      } else {
        handleError(result.code, result.message);
      }
    } catch (e) {
      console.error("참여 신청 수락 실패:", e);
      handleError(e?.response?.data?.code, e?.response?.data?.message);
    }
  };

  const handleReject = async (requestId) => {
    // 종료된 이벤트는 거절 불가
    if (event?.isEnded) {
      alert("종료된 이벤트는 참여 신청을 거절할 수 없습니다.");
      return;
    }

    try {
      const result = await rejectJoinRequest(eventId, requestId);
      if (result.success) {
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      } else {
        handleError(result.code, result.message);
      }
    } catch (e) {
      console.error("참여 신청 거절 실패:", e);
      handleError(e?.response?.data?.code, e?.response?.data?.message);
    }
  };

  /* ======================
     참여자 관리
     ====================== */
  const handleMemberLeave = (userId) => {
    // MEMBER 본인 탈퇴 (UI만, API 호출 없음)
    if (confirm("정말로 이 이벤트에서 탈퇴하시겠습니까?")) {
      alert("탈퇴 기능은 추후 구현 예정입니다.");
      // TODO: API 연동 시 구현
    }
  };

  const handleMemberRemove = async (eventMemberId) => {
    // HOST가 MEMBER 강퇴
    if (!confirm("정말 이 참여자를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const result = await removeEventManageMember(eventId, eventMemberId);
      
      if (result.success) {
        alert("멤버를 삭제했습니다.");
        // 목록에서 제거 (eventMemberId 또는 userId로 비교)
        setMembers((prev) => prev.filter((m) => (m.eventMemberId || m.userId) !== eventMemberId));
      } else {
        alert(result.message || "멤버 삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error("멤버 삭제 실패:", e);
      
      // 401/403 에러 처리
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        alert("로그인이 필요하거나 권한이 없습니다.");
        router.push("/login");
        return;
      }
      
      const errorMessage = e?.response?.data?.message || "멤버 삭제에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const refreshEvent = async () => {
    try {
      const result = await getEventDetail(eventId);
      setEvent(result.data);
      // 멤버 목록도 API로 다시 조회
      const membersResult = await getEventManageMembers(eventId);
      if (membersResult.success && membersResult.data) {
        setMembers(membersResult.data || []);
      }
    } catch (e) {
      console.error("이벤트 재조회 실패:", e);
    }
  };

  /* ======================
     에러 코드 처리
     ====================== */
  const handleError = (code, message) => {
    switch (code) {
      case "EVENT-002":
        alert("해당 이벤트가 존재하지 않습니다.");
        router.push("/town/events");
        break;
      case "EVENT-004":
        alert("이벤트 주최자만 접근할 수 있습니다.");
        router.back();
        break;
      default:
        alert(message || "요청 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isEnded = event.isEnded;

  /* ======================
     UI
     ====================== */
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/town/events/${eventId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            이벤트로 돌아가기
          </Link>
          <h1 className="text-gray-900">이벤트 관리</h1>
        </div>

        {/* 종료된 이벤트 안내 */}
        {isEnded && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">종료된 이벤트입니다.</p>
          </div>
        )}

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
              참여 신청 ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 px-6 py-4 ${
                activeTab === "members"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              참여자 관리 ({members.length})
            </button>
          </div>

          <div className="p-6">
            {/* 참여 신청 탭 */}
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
                          <p className="text-sm text-gray-600">{r.message || "(메시지 없음)"}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(r.requestedAt)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(r.requestId)}
                          disabled={isEnded}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                            isEnded
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <Check className="w-4 h-4" /> 승인
                        </button>
                        <button
                          onClick={() => handleReject(r.requestId)}
                          disabled={isEnded}
                          className={`flex-1 px-4 py-2 border rounded-lg flex items-center justify-center gap-2 ${
                            isEnded
                              ? "border-gray-200 text-gray-500 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <X className="w-4 h-4" /> 거절
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    새로운 참여 신청이 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 참여자 관리 탭 */}
            {activeTab === "members" && (
              <div className="space-y-3">
                {members.length > 0 ? (
                  members.map((m) => {
                    const isHost = m.role === "HOST";
                    const isCurrentUser = m.userId === user?.id;

                    return (
                      <div
                        key={m.userId}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                            {m.nickname?.[0] || "?"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">
                                {m.nickname || "알 수 없음"}
                              </span>
                              {isHost && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                  주최자
                                </span>
                              )}
                              {!isHost && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                  참여자
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              역할: {isHost ? "HOST" : "MEMBER"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {/* MEMBER 본인 탈퇴 버튼 */}
                          {!isHost && isCurrentUser && (
                            <button
                              onClick={() => handleMemberLeave(m.userId)}
                              className="px-3 py-1.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1"
                            >
                              <UserMinus className="w-4 h-4" /> 탈퇴
                            </button>
                          )}

                          {/* HOST가 MEMBER 강퇴 버튼 */}
                          {!isHost && !isCurrentUser && (
                            <button
                              onClick={() => handleMemberRemove(m.eventMemberId || m.userId)}
                              className="px-3 py-1.5 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-1"
                            >
                              <UserMinus className="w-4 h-4" /> 강퇴
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    참여자가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

