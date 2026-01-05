"use client";

import { useEffect, useState } from "react";

/**
 * 전역 토스트 호스트
 * - `emitToast()`로 호출
 */
export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const detail = e?.detail || {};
      const message = detail.message;
      if (!message) return;

      const toast = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message,
        variant: detail.variant || "info",
        durationMs: Number(detail.durationMs || 3500),
      };

      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.durationMs);
    };

    window.addEventListener("app:toast", onToast);
    return () => window.removeEventListener("app:toast", onToast);
  }, []);

  if (toasts.length === 0) return null;

  const variantClass = (v) => {
    switch (v) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-gray-900";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${variantClass(
            t.variant
          )} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm text-sm`}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}



