import { NextResponse } from "next/server";

/**
 * NOTE:
 * AT는 메모리(in-memory)만 사용하므로, 새로고침 시 클라이언트(AuthContext bootstrap)가 reissue를 수행합니다.
 * 쿠키 유무만으로 서버 미들웨어에서 /login 리다이렉트하면(특히 localhost/127.0.0.1 혼용 시) 오탐이 날 수 있어
 * 여기서는 강제 리다이렉트를 하지 않습니다.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};



