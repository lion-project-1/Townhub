"use client";

export function emitToast(message, variant = "info", durationMs) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("app:toast", { detail: { message, variant, durationMs } })
  );
}

export function emitSessionExpired() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth:session-expired"));
}



