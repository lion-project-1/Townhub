"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Users,
  Calendar,
  MessageCircle,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { useTown } from "./contexts/TownContext";

export default function MainPage() {
  const { user, isLoading } = useAuth();
  const { selectedTown } = useTown();
  const router = useRouter();

  useEffect(() => {
    // 요구사항: 루트(/)에서 비로그인이면 /login으로 이동
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const handleGetStarted = () => {
    if (user) {
      if (selectedTown) {
        router.push("/town");
      } else {
        router.push("/town-select");
      }
    } else {
      router.push("/login");
    }
  };

  // 리다이렉트 중 UI 플래시 방지
  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl mb-6">우리 동네를 연결하는</h1>
            <h1 className="text-5xl mb-6">따뜻한 커뮤니티</h1>
            <p className="text-xl mb-8 text-blue-100">
              이웃과 함께 모임을 만들고, 이벤트에 참여하고, 궁금한 것을
              물어보세요
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2"
            >
              시작하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center mb-12 text-gray-900">
          우리동네에서 할 수 있는 일
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="mb-3 text-gray-900">관심사 모임</h3>
            <p className="text-gray-600">
              운동, 독서, 취미 등 같은 관심사를 가진 이웃들과 함께 모임을 만들고
              활동해보세요
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="mb-3 text-gray-900">동네 이벤트</h3>
            <p className="text-gray-600">
              우리 동네에서 열리는 다양한 이벤트와 행사에 참여하고 새로운 경험을
              만들어보세요
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="mb-3 text-gray-900">이웃 Q&A</h3>
            <p className="text-gray-600">
              동네에 대한 궁금한 점을 질문하고, 이웃들의 경험과 지식을
              나눠보세요
            </p>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-gray-900">
            활발한 동네 커뮤니티
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "강남구", members: 1234, groups: 45 },
              { name: "마포구", members: 987, groups: 38 },
              { name: "성동구", members: 756, groups: 29 },
            ].map((town) => (
              <div
                key={town.name}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900">{town.name}</h3>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>회원 {town.members.toLocaleString()}명</span>
                  <span>모임 {town.groups}개</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4">지금 바로 시작해보세요</h2>
          <p className="mb-8 text-blue-100">
            우리 동네 이웃들과 함께 더 따뜻한 커뮤니티를 만들어가요
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2"
          >
            {user ? "내 동네 가기" : "회원가입하기"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
