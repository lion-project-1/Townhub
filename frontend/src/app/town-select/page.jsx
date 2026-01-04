"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, CheckCircle } from "lucide-react";
import { useTown } from "@/app/contexts/TownContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { searchTowns } from "@/app/api/location";
import Link from "next/link";

export default function TownSelectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [towns, setTowns] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { selectTown } = useTown();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setTowns([]);
        return;
      }
      try {
        setIsSearching(true);
        const result = await searchTowns(searchQuery);
        // ApiResponse({ data: [...] })
        setTowns(Array.isArray(result?.data) ? result.data : []);
      } catch (e) {
        console.error(e);
        setTowns([]);
      } finally {
        setIsSearching(false);
      }
    };
    run();
  }, [searchQuery]);

  const handleSelectTown = (town) => {
    selectTown({ ...town, verified: true });
    router.push("/town");
  };

  if (isAuthLoading) {
    return <div className="p-8">인증 정보 로딩 중...</div>;
  }

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-4 text-gray-900">동네 선택</h1>
          <p className="text-gray-600">
            활동하실 동네를 선택해주세요. 나중에 마이페이지에서 변경할 수
            있습니다.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="동네 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            {towns.map((town) => (
              <button
                key={town.id}
                onClick={() => handleSelectTown(town)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <div className="text-gray-900">{town.name}</div>
                    <div className="text-sm text-gray-500">{town.region}</div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>

          {isSearching && (
            <div className="text-center py-8 text-gray-500">검색 중...</div>
          )}

          {!isSearching && towns.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchQuery.trim().length < 2
                ? "두 글자 이상 입력해주세요."
                : "검색 결과가 없습니다."}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 동네 인증을 완료하면 더 많은 기능을 이용할 수 있습니다. 선택 후
            마이페이지에서 인증을 진행해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
