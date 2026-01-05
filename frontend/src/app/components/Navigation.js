"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  User,
  MapPin,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTown } from "@/app/contexts/TownContext";

export default function Navigation() {
  const { user, logout } = useAuth();
  const { selectedTown, clearTown } = useTown();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearTown();
    logout();
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="text-xl text-blue-600">우리동네</span>
            </Link>

            <div className="flex items-center gap-4">
              {(() => {
                // 비로그인 시: selectedTown.city 표시
                // 로그인 시: selectedTown.city 우선, 없으면 user.city 표시
                let displayCity = null;
                if (selectedTown?.city) {
                  displayCity = selectedTown.city;
                } else if (user?.city) {
                  displayCity = user.city;
                }
                
                return displayCity ? (
                  <Link
                    href="/town-select"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{displayCity}</span>
                  </Link>
                ) : null;
              })()}

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/mypage"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation for logged in users with town selected or user city */}
      {(selectedTown || (user && user.city)) && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              <Link
                href="/town"
                className={`px-4 py-3 border-b-2 ${
                  isActive("/town") && pathname === "/town"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>동네 홈</span>
                </div>
              </Link>
              <Link
                href="/town/groups"
                className={`px-4 py-3 border-b-2 ${
                  isActive("/town/groups")
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>모임</span>
                </div>
              </Link>
              <Link
                href="/town/events"
                className={`px-4 py-3 border-b-2 ${
                  isActive("/town/events")
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>이벤트</span>
                </div>
              </Link>
              <Link
                href="/town/qna"
                className={`px-4 py-3 border-b-2 ${
                  isActive("/town/qna")
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Q&A</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
