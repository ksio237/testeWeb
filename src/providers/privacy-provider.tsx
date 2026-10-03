"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "finplan:privacy";

type PrivacyContextValue = {
  isPrivate: boolean;
  toggle: () => void;
  setPrivate: (value: boolean) => void;
};

const PrivacyContext = createContext<PrivacyContextValue | null>(null);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setIsPrivate(true);
    } catch {
      // ignore storage failures
    }
  }, []);

  const setPrivate = useCallback((value: boolean) => {
    setIsPrivate(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setPrivate(!isPrivate);
  }, [isPrivate, setPrivate]);

  const value = useMemo<PrivacyContextValue>(
    () => ({ isPrivate, toggle, setPrivate }),
    [isPrivate, toggle, setPrivate],
  );

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy(): PrivacyContextValue {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error("usePrivacy must be used within PrivacyProvider");
  return ctx;
}
