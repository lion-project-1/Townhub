"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { UserPlus } from "lucide-react";
import { LOCATIONS, PROVINCES } from "@/app/constants/locations";
import { emitToast } from "@/app/utils/uiEvents";
import { checkEmailApi, checkNicknameApi } from "@/app/api/authApi";

export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup } = useAuth();
  const router = useRouter();
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null); // null | boolean
  const [nicknameAvailable, setNicknameAvailable] = useState(null); // null | boolean
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const handleCheckEmail = async () => {
    if (!email) return;
    if (isCheckingEmail) return;
    setIsCheckingEmail(true);
    setError("");
    try {
      const body = await checkEmailApi(email);
      const ok = Boolean(body?.data?.available);
      setEmailAvailable(ok);
      emitToast(ok ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.", ok ? "success" : "error");
    } catch (e) {
      setEmailAvailable(null);
      setError(e?.message || "이메일 중복검증에 실패했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) return;
    if (isCheckingNickname) return;
    setIsCheckingNickname(true);
    setError("");
    try {
      const body = await checkNicknameApi(nickname);
      const ok = Boolean(body?.data?.available);
      setNicknameAvailable(ok);
      emitToast(ok ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.", ok ? "success" : "error");
    } catch (e) {
      setNicknameAvailable(null);
      setError(e?.message || "닉네임 중복검증에 실패했습니다.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!province || !city) {
      setError("지역(시/도, 시/군/구)을 선택해주세요.");
      return;
    }
    if (emailAvailable !== true) {
      setError("이메일 중복검증을 완료해주세요.");
      return;
    }
    if (nicknameAvailable !== true) {
      setError("닉네임 중복검증을 완료해주세요.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signup({ nickname, email, password, province, city });
      emitToast("회원가입이 완료되었습니다. 로그인해주세요.", "success");
      router.push("/login");
    } catch (err) {
      setError(err?.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-center mb-8 text-gray-900">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-gray-700">닉네임</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameAvailable(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={isSubmitting || isCheckingNickname || !nickname}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isCheckingNickname ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {nicknameAvailable === true && (
                <p className="mt-1 text-sm text-green-600">사용 가능한 닉네임입니다.</p>
              )}
              {nicknameAvailable === false && (
                <p className="mt-1 text-sm text-red-600">이미 사용 중인 닉네임입니다.</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-700">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={isSubmitting || isCheckingEmail || !email}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isCheckingEmail ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {emailAvailable === true && (
                <p className="mt-1 text-sm text-green-600">사용 가능한 이메일입니다.</p>
              )}
              {emailAvailable === false && (
                <p className="mt-1 text-sm text-red-600">이미 사용 중인 이메일입니다.</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-700">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* 지역 선택 (비밀번호 확인 밑, 좌/우 배치) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">지역(시/도)</label>
                <select
                  value={province}
                  onChange={(e) => {
                    const next = e.target.value;
                    setProvince(next);
                    setCity("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">선택하세요</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">지역(시/군/구)</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                  disabled={isSubmitting || !province}
                >
                  <option value="">
                    {province ? "선택하세요" : "시/도를 먼저 선택하세요"}
                  </option>
                  {(LOCATIONS[province] || []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "처리 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
