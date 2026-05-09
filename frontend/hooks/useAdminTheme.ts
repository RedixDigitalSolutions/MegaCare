import { useState, useEffect } from "react";

const STORAGE_KEY = "megacare_admin_theme";
const EVENT_NAME = "megacare-admin-theme-change";

export function useAdminTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      setIsDark((e as CustomEvent<{ isDark: boolean }>).detail.isDark);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const toggle = () => {
    const next = !isDark;
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent<{ isDark: boolean }>(EVENT_NAME, { detail: { isDark: next } })
    );
  };

  return { isDark, toggle };
}
