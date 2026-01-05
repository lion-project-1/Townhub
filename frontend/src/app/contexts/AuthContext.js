"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loginApi, logoutApi, meApi, signupApi } from "@/app/api/authApi";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/app/api/tokenStorage";
import { reissueOnce } from "@/app/api/reissueOnce";
import { emitToast } from "@/app/utils/uiEvents";
import { useTown } from "@/app/contexts/TownContext";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectTown, clearTown } = useTown();

  const [user, setUser] = useState(null);
  const [accessTokenState, setAccessTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      // 로그인/회원가입 페이지에서는 자동 reissue를 시도하지 않음
      if (pathname === "/login" || pathname === "/signup") return;

      // 1) 메모리에 AT가 있으면 /me로 user 복원 시도
      const existingToken = getAccessToken();
      if (existingToken) {
        const meBody = await meApi(existingToken);
        const me = meBody?.data;
        if (me?.userId) {
          setAccessTokenState(existingToken);
          setUser({
            id: Number(me.userId),
            email: me.email,
            nickname: me.nickname,
            name: me.nickname, // 레거시 UI 호환
            province: me.province,
            city: me.city,
          });

          if (me.locationId && me.province && me.city) {
            selectTown({
              id: me.locationId,
              province: me.province,
              city: me.city,
            });
          }
          return;
        }
      }

      // 2) AT가 없거나 /me 실패 → RT 쿠키로 reissue → /me
      const reissueResult = await reissueOnce();
      if (!reissueResult?.ok || !reissueResult?.accessToken) {
        // 미로그인: 조용히 종료 (페이지가 /login 유도)
        if (reissueResult?.code === "TOKEN_003") return;

        emitToast("세션이 만료되었습니다. 다시 로그인해주세요.", "error");
        router.replace("/login");
        return;
      }

      setAccessToken(reissueResult.accessToken);
      setAccessTokenState(reissueResult.accessToken);

      const meBody = await meApi(reissueResult.accessToken);
      const me = meBody?.data;
      if (!me?.userId) return;

      setUser({
        id: Number(me.userId),
        email: me.email,
        nickname: me.nickname,
        name: me.nickname,
        province: me.province,
        city: me.city,
      });

      if (me.locationId && me.province && me.city) {
        selectTown({
          id: me.locationId,
          province: me.province,
          city: me.city,
        });
      }
    };

    const syncToken = () => setAccessTokenState(getAccessToken());
    window.addEventListener("auth:token", syncToken);

    const onSessionExpired = () => {
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      localStorage.removeItem("selectedTown");
      emitToast("세션이 만료되었습니다. 다시 로그인해주세요.", "error");
      router.replace("/login");
    };
    window.addEventListener("auth:session-expired", onSessionExpired);

    bootstrap()
      .catch(() => null)
      .finally(() => setIsLoading(false));

    return () => {
      window.removeEventListener("auth:token", syncToken);
      window.removeEventListener("auth:session-expired", onSessionExpired);
    };
    // pathname deps는 넣지 않음: 라우트 이동마다 bootstrap/reissue 재실행 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const login = async (email, password) => {
    const apiResponse = await loginApi(email, password);
    const data = apiResponse?.data;
    const token = data?.accessToken;

    setAccessToken(token);
    setAccessTokenState(token);

    // 로그인 성공 후 /me API로 사용자 정보 가져오기
    const meBody = await meApi(token);
    const me = meBody?.data;

    if (me?.userId) {
      setUser({
        id: Number(me.userId),
        email: me.email,
        nickname: me.nickname,
        name: me.nickname,
        province: me.province,
        city: me.city,
      });

      if (me.locationId && me.province && me.city) {
        selectTown({
          id: me.locationId,
          province: me.province,
          city: me.city,
        });
      }
    } else {
      // /me 실패 시 로그인 응답 데이터 사용 (fallback)
      setUser({
        id: Number(data?.userId),
        email: data?.email,
        nickname: data?.nickname,
        name: data?.nickname,
        province: data?.province,
        city: data?.city,
      });

      if (data?.locationId && data?.province && data?.city) {
        selectTown({
          id: data.locationId,
          province: data.province,
          city: data.city,
        });
      }
    }
  };

  const signup = async (payload) => {
    return await signupApi(payload);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setAccessTokenState(null);
    clearAccessToken();
    clearTown();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        isAuthenticated: Boolean(user && accessTokenState),
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
