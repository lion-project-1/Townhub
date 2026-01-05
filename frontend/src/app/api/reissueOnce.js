"use client";

import { reissueApi } from "@/app/api/authApi";
import { setAccessToken } from "@/app/api/tokenStorage";

let reissuePromise = null;

/**
 * 앱 전체에서 reissue를 단 한 번만 수행하도록 직렬화합니다(RT rotation 레이스 방지).
 * @returns {Promise<{ok:true, accessToken:string} | {ok:false, code: string|null}>}
 */
export async function reissueOnce() {
  if (!reissuePromise) {
    reissuePromise = (async () => {
      const result = await reissueApi();
      if (!result?.ok || !result?.accessToken) {
        return { ok: false, code: result?.code || null };
      }
      setAccessToken(result.accessToken);
      return { ok: true, accessToken: result.accessToken };
    })().finally(() => {
      reissuePromise = null;
    });
  }
  return reissuePromise;
}



