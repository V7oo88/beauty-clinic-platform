"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(() => console.log("[PWA] Service worker registered"))
        .catch((e) => console.warn("[PWA] Service worker registration failed:", e));
    }
  }, []);
  return null;
}
