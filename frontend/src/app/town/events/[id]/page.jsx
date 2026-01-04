"use client";

import { useState, useEffect } from "react";
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
  Settings,
  Zap,
  X,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getEventDetail,
  requestJoinEvent,
  cancelJoinRequest,
  deleteEvent,
} from "@/app/api/events";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  // 이벤트 데이터 포맷팅 함수
  const formatEventData = (eventData) => ({
    id: eventData.eventId,
    title: eventData.title,
    category: eventData.category,
    date: eventData.startAt
      ? new Date(eventData.startAt).toISOString().split("T")[0]
      : "",
    time: eventData.startAt
      ? new Date(eventData.startAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "",
    location: eventData.eventPlace,
    participants: eventData.memberCount || 0,
    maxParticipants: eventData.capacity || 0,
    description: eventData.description,
    organizer: eventData.hostNickname,
    organizerId: eventData.hostUserId,
    hostUserId: eventData.hostUserId,
    createdAt: eventData.createdAt,
    startAt: eventData.startAt,
    members: eventData.members || [],
    status: eventData.status || null,
    ended: eventData.ended || false,
    // 하위 호환성을 위해 유지
    isEnded: eventData.ended || eventData.isEnded || false,
    eventStatus: eventData.status || eventData.eventStatus || null,
    joinRequestStatus: eventData.joinRequestStatus || null,
    joinRequestId: eventData.joinRequestId || null,
  });

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 이벤트 상세 조회
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const result = await getEventDetail(params.id, token);
        const eventData = result.data;

        setEvent(formatEventData(eventData));
      } catch (e) {
        console.error("이벤트 상세 조회 실패:", e);
        router.push("/town/events");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [params.id, token, router, user?.id]);

  if (loading || !event) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 호스트 여부 확인 (hostUserId 우선, 하위 호환을 위해 organizerId도 확인)
  const isHost = user?.id === event.hostUserId || user?.id === event.organizerId;
  
  // 이벤트 상태 확인
  const status = event.status || event.eventStatus;
  const isDisabledEvent =
    status === "CANCELED" ||
    status === "CLOSED" ||
    event.ended ||
    event.isEnded;
  
  // joinRequestStatus 가져오기
  const joinRequestStatus = event.joinRequestStatus;

  // 이벤트 상세 재조회 함수
  const refetchEvent = async () => {
    try {
      const result = await getEventDetail(params.id, token);
      setEvent(formatEventData(result.data));
    } catch (e) {
      console.error("이벤트 재조회 실패:", e);
    }
  };

  const handleJoinSubmit = async () => {
    try {
      await requestJoinEvent(
        params.id,
        { message: joinMessage },
        token
      );
      
      alert("이벤트 참여 신청이 완료되었습니다.");
      setShowJoinModal(false);
      setJoinMessage("");
      // 이벤트 상세 API 재요청
      await refetchEvent();
    } catch (e) {
      console.error("참여 신청 실패:", e);
      const errorCode = e?.response?.data?.code;
      if (errorCode) {
        alert(e.response.data.message || "참여 신청 중 오류가 발생했습니다.");
      } else {
        alert("참여 신청 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCancelJoin = async () => {
    // confirm 확인
    if (!confirm("참여 신청을 취소하시겠습니까?")) {
      return;
    }

    try {
      await cancelJoinRequest(params.id, token);
      alert("이벤트 참여 신청이 취소되었습니다.");
      // 이벤트 상세 API 재요청
      await refetchEvent();
    } catch (e) {
      console.error("참여 취소 실패:", e);
      const errorCode = e?.response?.data?.code;
      if (errorCode) {
        alert(e.response.data.message || "참여 취소 중 오류가 발생했습니다.");
      } else {
        alert("참여 취소 중 오류가 발생했습니다.");
      }
    }
  };

  // 참여 버튼 상태 계산
  const getJoinButtonState = () => {
    // 호스트는 참여 버튼 표시 안 함
    if (isHost) {
      return null;
    }
    
    // 종료/취소/마감 이벤트는 비활성화
    if (isDisabledEvent) {
      return {
        label: "종료된 이벤트",
        disabled: true,
        onClick: null,
      };
    }
    
    // joinRequestStatus에 따른 분기
    if (joinRequestStatus === "APPROVED") {
      return {
        label: "참여 예정",
        disabled: true,
        onClick: null,
      };
    } else if (joinRequestStatus === "PENDING") {
      return {
        label: "신청 취소",
        disabled: false,
        onClick: handleCancelJoin,
      };
    } else if (joinRequestStatus === "REJECTED") {
      return {
        label: "신청 거절됨",
        disabled: true,
        onClick: null,
      };
    } else {
      // null 또는 undefined - 신청 이력 없음
      return {
        label: "참여하기",
        disabled: false,
        onClick: () => setShowJoinModal(true),
      };
    }
  };

  const joinButtonState = getJoinButtonState();

  const handleDelete = async () => {
    if (!confirm("이 이벤트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteEvent(params.id, token);
      alert("이벤트가 삭제되었습니다.");
      router.push("/town/events");
    } catch (e) {
      console.error("이벤트 삭제 실패:", e);
      const errorMessage =
        e?.response?.data?.message || "이벤트 삭제에 실패했습니다.";
      alert(errorMessage);
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
          {/* 종료된 이벤트 안내 */}
          {isDisabledEvent && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                {status === 'CANCELED' 
                  ? '취소된 이벤트입니다.' 
                  : status === 'CLOSED' || event.ended || event.isEnded
                  ? '종료된 이벤트입니다.'
                  : '종료된 이벤트입니다.'}
              </p>
            </div>
          )}

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="mb-3 text-gray-900">{event.title}</h1>
              {event.category === 'FLASH' ? (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  번개
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded">
                  {(() => {
                    const categoryMap = {
                      'FESTIVAL': '축제',
                      'VOLUNTEER': '봉사',
                      'CULTURE': '문화',
                      'SPORTS': '체육',
                      'EDUCATION': '교육',
                      'ETC': '기타',
                    };
                    return categoryMap[event.category] || event.category;
                  })()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {isHost ? (
                <>
                  <Link
                    href={`/town/events/${params.id}/manage`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    관리
                  </Link>
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
              ) : joinButtonState ? (
                <button
                  onClick={joinButtonState.onClick || undefined}
                  disabled={joinButtonState.disabled}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    joinButtonState.disabled
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : joinRequestStatus === "PENDING"
                      ? "border border-gray-300 hover:bg-gray-50"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {joinRequestStatus === "PENDING" ? (
                    <UserMinus className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {joinButtonState.label}
                </button>
              ) : null}
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

              {event.createdAt && (
                <div className="flex items-start gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">작성일</div>
                    <div className="text-gray-900">
                      {formatDate(event.createdAt)}
                    </div>
                  </div>
                </div>
              )}
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
          <h2 className="mb-4 text-gray-900">참여자 ({event.members?.length || event.participants})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.members && event.members.length > 0 ? (
              event.members.slice(0, 12).map((member) => {
                const isHost = member.role === "HOST";
                return (
                  <div
                    key={member.userId}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 ${
                        isHost
                          ? "bg-gradient-to-br from-blue-400 to-blue-600"
                          : "bg-gradient-to-br from-green-400 to-green-600"
                      }`}
                    >
                      {member.nickname?.[0] || "?"}
                    </div>
                    <div className="text-sm text-gray-900">
                      {member.nickname || "알 수 없음"}
                    </div>
                    {isHost && (
                      <span className="text-xs text-blue-600 mt-1">주최자</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                참여자가 없습니다.
              </div>
            )}
          </div>
          {event.members && event.members.length > 12 && (
            <div className="text-center mt-4 text-gray-500">
              외 {event.members.length - 12}명
            </div>
          )}
        </div>
      </div>

      {/* 참여 신청 모달 */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg text-gray-900 mb-4">참여 신청 메시지</h2>

            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="이벤트 주최자에게 전달할 참여 신청 메시지를 작성해주세요."
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                참여 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

