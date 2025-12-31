"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMeetingList } from "@/app/api/meeting";
import { useTown } from "@/app/contexts/TownContext";

const CATEGORIES = [
  { label: "전체", value: null },
  { label: "운동", value: "SPORTS" },
  { label: "문화", value: "CULTURE" },
  { label: "취미", value: "HOBBY" },
  { label: "스터디", value: "STUDY" },
  { label: "반려동물", value: "PET" },
  { label: "기타", value: "ETC" },
];

const STATUSES = [
  { label: "전체", value: null },
  { label: "모집중", value: "RECRUITING" },
  { label: "활동중", value: "ACTIVE" },
];

export default function GroupListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedTown } = useTown();

  console.log("selectedTown:", selectedTown);

  /* =========================
     URL 기반 상태
  ========================= */
  const page = Number(searchParams.get("page") || 0);
  const selectedCategory = searchParams.get("category");
  const selectedStatus = searchParams.get("status");
  const searchKeyword = searchParams.get("keyword");

  /* =========================
     UI 상태
  ========================= */
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputKeyword, setInputKeyword] = useState(searchKeyword || "");

  /* =========================
     URL 업데이트
  ========================= */
  const updateQuery = (params) => {
    const raw = {
      page,
      category: selectedCategory,
      status: selectedStatus,
      keyword: searchKeyword,
      province: selectedTown?.province || null,
      city: selectedTown?.city || null,
      ...params,
    };

    const query = new URLSearchParams();

    Object.entries(raw).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        query.set(key, value);
      }
    });

    router.push(`/town/groups?${query.toString()}`);
  };

  /* =========================
     목록 조회 (⭐ 핵심 수정)
  ========================= */
  useEffect(() => {
    // ✅ selectedTown 준비 전에는 호출하지 않음
    if (!selectedTown) return;

    const loadGroups = async () => {
      try {
        setLoading(true);

        console.log("API params:", {
          province: selectedTown.province,
          city: selectedTown.city,
        });

        const result = await getMeetingList({
          page,
          category: selectedCategory,
          status: selectedStatus,
          keyword: searchKeyword,
          province: selectedTown.province, // ✅ null 제거
          city: selectedTown.city, // ✅ null 제거
        });

        setGroups(result.data.content);
        setTotalPages(result.data.page.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [page, selectedCategory, selectedStatus, searchKeyword, selectedTown]);

  /* =========================
     검색 실행
  ========================= */
  const handleSearch = () => {
    updateQuery({
      page: 0,
      keyword: inputKeyword.trim() || null,
    });
  };

  const queryString = searchParams.toString();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-gray-900">모임</h1>
            <p className="text-gray-600">
              관심사가 같은 이웃들과 함께 모임을 만들어보세요
            </p>
          </div>

          <Link
            href="/town/groups/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            모임 만들기
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {/* 검색 */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="모임 검색..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              검색
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* 카테고리 */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.label}
                    onClick={() =>
                      updateQuery({ page: 0, category: category.value })
                    }
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 상태 */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-700 mb-2">상태</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status.label}
                    onClick={() =>
                      updateQuery({ page: 0, status: status.value })
                    }
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedStatus === status.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 로딩 */}
        {loading && <div className="mb-6">로딩 중...</div>}

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.meetingId}
              href={`/town/groups/${group.meetingId}?${queryString}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-400" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-900 flex-1">{group.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      group.status === "RECRUITING"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {group.status === "RECRUITING" ? "모집중" : "활동중"}
                  </span>
                </div>

                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mb-3">
                  {group.category}
                </span>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {group.memberCount}/{group.capacity}명
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty */}
        {!loading && groups.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
            <Link
              href="/town/groups/new"
              className="text-blue-600 hover:underline"
            >
              새로운 모임을 만들어보세요
            </Link>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => updateQuery({ page: index })}
              className={`px-3 py-1 rounded ${
                page === index
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
