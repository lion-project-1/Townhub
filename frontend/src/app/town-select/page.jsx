"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, CheckCircle } from "lucide-react";
import { useTown } from "@/app/contexts/TownContext";
import { searchTowns } from "@/app/api/location";

export default function TownSelectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // ⭐ 추가

  const { selectTown } = useTown();
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_LOCAL_ACCESS_TOKEN;

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setTowns([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true); // ⭐ 검색 시도 표시
    setLoading(true);

    try {
      const result = await searchTowns(searchQuery, token);
      setTowns(Array.isArray(result.data) ? result.data : []);
    } catch (e) {
      console.error(e);
      setTowns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTown = (town) => {
    selectTown({
      id: town.id,
      province: town.province,
      city: town.city,
    });
    router.replace("/town/groups");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-4 text-gray-900">동네 선택</h1>
          <p className="text-gray-600">동네 이름을 검색 후 선택해주세요.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* 검색 입력 + 버튼 */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="예) 강남구, 서초구"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              검색
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="space-y-2">
            {Array.isArray(towns) &&
              towns.length > 0 &&
              towns.map((town) => (
                <button
                  key={town.id}
                  onClick={() => handleSelectTown(town)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <div className="text-gray-900">{town.city}</div>
                      <div className="text-sm text-gray-500">
                        {town.province}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-gray-300" />
                </button>
              ))}

            {/* ⭐ 검색 후에만 결과 없음 표시 */}
            {!loading && hasSearched && towns.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* 상태 메시지 */}
          {loading && (
            <div className="text-center py-6 text-gray-500">검색 중...</div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 동네 인증을 완료하면 더 많은 기능을 이용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
