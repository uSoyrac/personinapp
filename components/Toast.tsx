"use client";

import { useState, useEffect, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Global event system
const TOAST_EVENT = "practiceforge-toast";

export function showToast(message: string, type: ToastType = "info") {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      const id = Math.random().toString(36).slice(2);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, [removeToast]);

  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: "rgba(16, 185, 129, 0.95)", border: "#10B981", icon: "✓" },
    error:   { bg: "rgba(239, 68, 68, 0.95)",  border: "#EF4444", icon: "✕" },
    info:    { bg: "rgba(124, 58, 237, 0.95)",  border: "#7C3AED", icon: "ℹ" },
    warning: { bg: "rgba(245, 158, 11, 0.95)",  border: "#F59E0B", icon: "⚠" },
  };

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
      zIndex: 9999, pointerEvents: "none",
    }}>
      {toasts.map(toast => {
        const c = colors[toast.type];
        return (
          <div
            key={toast.id}
            className="animate-fadeIn"
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: "12px",
              padding: "0.875rem 1.25rem",
              color: "#fff",
              fontSize: "0.9375rem",
              fontWeight: 500,
              maxWidth: "340px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{
              width: "1.5rem", height: "1.5rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.875rem", fontWeight: 700, flexShrink: 0,
            }}>
              {c.icon}
            </span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
