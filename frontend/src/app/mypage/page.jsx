"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Settings,
  Lock,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTown } from "@/app/contexts/TownContext";
import {
  getMyPageUser,
  getMyMeetings,
  getMyEvents,
  getMyQuestions,
} from "@/app/api/mypage";

import { updateMyProfile, withdrawUser } from "@/app/api/user";

export default function MyPage() {
  const { user } = useAuth();
  const { selectedTown } = useTown();

  const [myUser, setMyUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     설정 상태
  ========================= */
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  /* =========================
     지역 변경(체크) 상태
     - selectedTown(현재 앱에서 선택된 지역) != myUser.location(사용자 저장 지역)일 때만 보여줌
     - 체크하면 state에만 저장해두고, 저장 눌렀을 때만 전송
  ========================= */
  const [changeLocation, setChangeLocation] = useState(false);

  /* =========================
     활동 섹션
  ========================= */
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

  /* =========================
     현재 앱에서 선택된 지역 문자열
  ========================= */
  const currentTownText = selectedTown
    ? `${selectedTown.province} ${selectedTown.city}`
    : null;

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

    getMyPageUser()
      .then(setMyUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  /* =========================
     설정 열고 닫을 때: 체크 초기화(원하면 유지해도 되는데 UX상 초기화가 깔끔)
  ========================= */
  useEffect(() => {
    if (!isSettingOpen) {
      setChangeLocation(false);
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    }
  }, [isSettingOpen]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const res = await fetcher({ cursor: null });

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
     저장(전송 데이터 구성)
     - 새 비밀번호/확인 불일치 시 경고
     - 지역은:
       - 체크했고, currentTownText가 존재하고, myUser.location과 다를 때만 currentTownText 전송
       - 아니면 기존 myUser.location 전송
  ========================= */
  const handleSave = async () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const canAskChangeLocation =
      !!currentTownText && currentTownText !== myUser.location;

    const payload = {
      currentPassword,
      newPassword: newPassword || null,
      location:
        canAskChangeLocation && changeLocation
          ? currentTownText
          : myUser.location,
    };

    try {
      await updateMyProfile(payload);
      setMyUser((prev) => ({
        ...prev,
        location: payload.location,
      }));

      alert("회원 정보가 수정되었습니다.");
      setIsSettingOpen(false);
    } catch (e) {
      alert(e.message);
    }
  };

  /* =========================
     탈퇴(임시)
  ========================= */
  const handleWithdraw = async () => {
    if (!currentPassword) {
      alert("탈퇴를 위해 현재 비밀번호를 입력해주세요.");
      return;
    }

    const ok = confirm("정말 탈퇴하시겠습니까?");
    if (!ok) return;

    try {
      await withdrawUser(currentPassword);
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } catch (e) {
      alert(e.message);
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
        {/* ================= USER + LOCATION CARD ================= */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-3">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* LEFT */}
            <div className="flex flex-1 justify-center">
              {!isSettingOpen ? (
                <div className="flex items-center gap-5 text-left">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {myUser.nickname?.[0] ?? "?"}
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {myUser.nickname}
                    </h1>
                    <p className="text-gray-600">{myUser.email}</p>
                    <p className="text-sm text-gray-500">
                      가입일 · {formatDate(myUser.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-xs">
                  <div className="flex items-center gap-2 mb-3 text-gray-700">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">비밀번호 변경</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="현재 비밀번호"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="새 비밀번호 확인"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block w-px h-32 bg-gray-200" />

            {/* RIGHT */}
            <div className="flex flex-1 flex-col items-center text-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />

              <div className="text-gray-900 font-medium">
                {myUser.location || "위치 정보 없음"}
              </div>

              {/* ✅ 설정 모드에서, "현재(선택) 지역"이 있고 사용자 지역과 다를 때만 물어봄 */}
              {isSettingOpen &&
                !!currentTownText &&
                currentTownText !== myUser.location && (
                  <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={changeLocation}
                      onChange={(e) => setChangeLocation(e.target.checked)}
                    />
                    현재 지역({currentTownText})으로 변경하시겠습니까?
                  </label>
                )}

              {/* 비설정 모드에서 기존 버튼 유지(원하면 그대로) */}
              {!isSettingOpen && (
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  인증하기
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= BUTTON AREA ================= */}
        <div className="flex justify-end gap-2 mb-8">
          {!isSettingOpen ? (
            <button
              onClick={() => setIsSettingOpen(true)}
              className="px-5 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              설정
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
              >
                저장
              </button>
              <button
                onClick={() => setIsSettingOpen(false)}
                className="px-4 py-1 border rounded text-sm"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="px-4 py-1 border text-red-600 rounded text-sm"
              >
                탈퇴
              </button>
            </>
          )}
        </div>

        {/* ================= Activity Stats ================= */}
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

        {/* ================= Dynamic Area ================= */}
        {!activeSection && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 text-center text-gray-500">
            <p className="text-sm">아직 선택된 활동이 없어요</p>
            <p className="text-sm">
              위의 <span className="font-medium text-gray-700">카드</span>를
              눌러 참여한 모임 · 이벤트 · 질문을 확인해 보세요
            </p>
          </div>
        )}

        {activeSection && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="max-h-[420px] overflow-y-auto">
              {/* 로딩 표시(원하면) */}
              {sectionLoading && items.length === 0 && (
                <div className="py-6 text-center text-sm text-gray-500">
                  불러오는 중...
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.meetingId ?? item.questionId}
                  className="p-4 border border-gray-200 rounded-lg mb-2"
                >
                  <div className="flex items-center pl-3">
                    <div className="flex items-center gap-6 text-sm text-gray-700">
                      <span className="font-medium text-gray-900">
                        {item.title}
                      </span>

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
