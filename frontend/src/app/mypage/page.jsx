"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Users, Calendar, MessageCircle, Settings } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getMyPageUser,
  getMyMeetings,
  getMyEvents,
  getMyQuestions,
} from "@/app/api/mypage";

export default function MyPage() {
  const { user } = useAuth();

  const [myUser, setMyUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState(null);
  const [items, setItems] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);

  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  const [cursors, setCursors] = useState({
    MEETING: null,
    EVENT: null,
    QNA: null,
  });

  const [hasNextMap, setHasNextMap] = useState({
    MEETING: true,
    EVENT: true,
    QNA: true,
  });

  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  /* =========================
     날짜 포맷
  ========================= */
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  /* =========================
     마이페이지 요약
  ========================= */
  useEffect(() => {
    if (!user) return;

    getMyPageUser(token)
      .then(setMyUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, token]);

  /* =========================
     섹션 변경
  ========================= */
  useEffect(() => {
    if (!activeSection) return;

    setItems([]);
    setIsInitialLoaded(false);
    setCursors((prev) => ({ ...prev, [activeSection]: null }));
    setHasNextMap((prev) => ({ ...prev, [activeSection]: true }));

    fetchFirstPage(activeSection);
  }, [activeSection]);

  /* =========================
     IntersectionObserver
  ========================= */
  useEffect(() => {
    if (!activeSection) return;
    if (!isInitialLoaded) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextMap[activeSection] &&
          !isFetchingRef.current
        ) {
          fetchNextPage(activeSection);
        }
      },
      { threshold: 0 }
    );

    const target = loadMoreRef.current;
    if (target) observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [activeSection, hasNextMap, isInitialLoaded]);

  /* =========================
     API 선택
  ========================= */
  const getFetcher = (section) => {
    if (section === "MEETING") return getMyMeetings;
    if (section === "EVENT") return getMyEvents;
    if (section === "QNA") return getMyQuestions;
    return null;
  };

  /* =========================
     첫 페이지
  ========================= */
  const fetchFirstPage = async (section) => {
    const fetcher = getFetcher(section);
    if (!fetcher) return;

    try {
      isFetchingRef.current = true;
      setSectionLoading(true);

      const res = await fetcher({ token, cursor: null });

      setItems(res.data.items || []);
      setCursors((prev) => ({
        ...prev,
        [section]: res.data.nextCursor,
      }));
      setHasNextMap((prev) => ({
        ...prev,
        [section]: res.data.hasNext,
      }));
    } finally {
      setSectionLoading(false);
      isFetchingRef.current = false;
      setIsInitialLoaded(true);
    }
  };

  /* =========================
     다음 페이지
  ========================= */
  const fetchNextPage = async (section) => {
    const fetcher = getFetcher(section);
    if (!fetcher) return;
    if (!hasNextMap[section]) return;
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setSectionLoading(true);

      const res = await fetcher({
        token,
        cursor: cursors[section],
      });

      setItems((prev) => [...prev, ...(res.data.items || [])]);
      setCursors((prev) => ({
        ...prev,
        [section]: res.data.nextCursor,
      }));
      setHasNextMap((prev) => ({
        ...prev,
        [section]: res.data.hasNext,
      }));
    } finally {
      setSectionLoading(false);
      isFetchingRef.current = false;
    }
  };

  /* =========================
     로그인 필요
  ========================= */
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

  if (loading || !myUser) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* User + Location Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-6">
              <div className="mx-auto sm:mx-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
                {myUser.nickname?.[0] ?? "?"}
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {myUser.nickname}
                  </h1>
                  <p className="text-gray-600">{myUser.email}</p>
                  {myUser.createdAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      가입일 · {formatDate(myUser.createdAt)}
                    </p>
                  )}
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button className="px-5 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1.5">
                    <Settings className="w-4 h-4" />
                    설정
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-200" />

            <div className="flex flex-1 flex-col items-center justify-center text-center gap-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div className="text-gray-900 font-medium">
                {myUser.location || "위치 정보 없음"}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                인증하기
              </button>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            title="참여 모임"
            value={myUser.groups}
            desc="개의 모임에 참여 중"
            active={activeSection === "MEETING"}
            onClick={() => setActiveSection("MEETING")}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-green-600" />}
            title="이벤트 참여"
            value={myUser.events}
            desc="개의 이벤트에 참여"
            active={activeSection === "EVENT"}
            onClick={() => setActiveSection("EVENT")}
          />
          <StatCard
            icon={<MessageCircle className="w-5 h-5 text-purple-600" />}
            title="질문·답변"
            value={myUser.qna}
            desc="개의 활동"
            active={activeSection === "QNA"}
            onClick={() => setActiveSection("QNA")}
          />
        </div>

        {/* Dynamic Area */}
        {!activeSection && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 text-center text-gray-500">
            <p className="text-sm mb-">아직 선택된 활동이 없어요</p>
            <p className="text-sm">
              위의 <span className="font-medium text-gray-700">카드</span>를
              눌러 참여한 모임 · 이벤트 · 질문을 확인해 보세요
            </p>
          </div>
        )}

        {/* Dynamic Area */}
        {activeSection && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="max-h-[420px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.meetingId ?? item.questionId}
                  className="p-4 border border-gray-200 rounded-lg mb-2"
                >
                  <div className="flex items-center pl-3">
                    {/* 텍스트 */}
                    <div className="flex items-center gap-6 text-sm text-gray-700">
                      {/* 제목은 그대로 */}
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>

                      {/* MEETING */}
                      {activeSection === "MEETING" && (
                        <>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">
                            인원 {item.participantCount} / {item.capacity}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                            {formatDate(item.joinedAt)}
                          </span>
                        </>
                      )}

                      {/* QNA */}
                      {activeSection === "QNA" && (
                        <>
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs">
                            {item.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                            {formatDate(item.createdAt)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 버튼 */}
                    <div className="ml-auto flex items-center gap-2">
                      <Link
                        href={
                          activeSection === "MEETING"
                            ? `/town/groups/${item.meetingId}`
                            : `/town/qna/${item.questionId}`
                        }
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        바로가기
                      </Link>

                      <button
                        type="button"
                        className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
                      >
                        {activeSection === "MEETING" && "탈퇴"}
                        {activeSection === "EVENT" && "취소"}
                        {activeSection === "QNA" && "삭제"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div ref={loadMoreRef} className="h-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   StatCard
========================= */
function StatCard({ icon, title, value, desc, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-xl border p-6 transition ${
        active
          ? "border-blue-500 ring-1 ring-blue-200"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-gray-900 font-medium">{title}</h3>
      </div>

      <div className="text-3xl text-gray-900">{value ?? 0}</div>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  );
}
