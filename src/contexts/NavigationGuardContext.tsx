"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";

type NavigateHandler = (href: string) => void;

type NavigationGuardContextValue = {
  requestNavigate: (href: string) => boolean;
  setGuard: (handler: NavigateHandler | null) => void;
};

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const guardRef = useRef<NavigateHandler | null>(null);

  const setGuard = useCallback((handler: NavigateHandler | null) => {
    guardRef.current = handler;
  }, []);

  const requestNavigate = useCallback((href: string) => {
    if (!guardRef.current) return false;

    guardRef.current(href);
    return true;
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ requestNavigate, setGuard }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  const context = useContext(NavigationGuardContext);

  if (!context) {
    throw new Error("useNavigationGuard must be used within a NavigationGuardProvider");
  }

  return context;
}
