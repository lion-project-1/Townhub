"use client";

import { useRouter } from "next/navigation";
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

  const handleGetStarted = () => {
    // 로그인 + 동네 선택 여부
    if (selectedTown) {
      router.push("/town");
    } else {
      router.push("/town-select");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl mb-6">
              우리 동네를 연결하는 <br />
              따뜻한 커뮤니티
            </h1>
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
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="관심사 모임"
            bgColor="bg-blue-100"
          >
            운동, 독서, 취미 등 같은 관심사를 가진 이웃들과 함께 모임을 만들고
            활동해보세요
          </FeatureCard>

          <FeatureCard
            icon={<Calendar className="w-6 h-6 text-green-600" />}
            title="동네 이벤트"
            bgColor="bg-green-100"
          >
            우리 동네에서 열리는 다양한 이벤트와 행사에 참여하고 새로운 경험을
            만들어보세요
          </FeatureCard>

          <FeatureCard
            icon={<MessageCircle className="w-6 h-6 text-purple-600" />}
            title="이웃 Q&A"
            bgColor="bg-purple-100"
          >
            동네에 대한 궁금한 점을 질문하고, 이웃들의 경험과 지식을 나눠보세요
          </FeatureCard>
        </div>
      </section>

      {/* CTA
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
            시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section> */}
    </div>
  );
}

/* 재사용 컴포넌트 */
function FeatureCard({ icon, title, bgColor, children }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}
