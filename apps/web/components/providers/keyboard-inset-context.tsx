"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useVisualViewportInset } from "@/lib/hooks/use-visual-viewport-inset";

type KeyboardInsetContextValue = {
  registerOpenSheet: () => () => void;
};

const KeyboardInsetContext = createContext<KeyboardInsetContextValue | null>(null);

export function KeyboardInsetProvider({ children }: { children: ReactNode }) {
  const openCountRef = useRef(0);
  const [hasOpenSheet, setHasOpenSheet] = useState(false);

  const registerOpenSheet = useCallback(() => {
    openCountRef.current += 1;
    setHasOpenSheet(true);

    return () => {
      openCountRef.current = Math.max(0, openCountRef.current - 1);
      if (openCountRef.current === 0) {
        setHasOpenSheet(false);
      }
    };
  }, []);

  useVisualViewportInset(hasOpenSheet);

  const value = useMemo(() => ({ registerOpenSheet }), [registerOpenSheet]);

  return <KeyboardInsetContext.Provider value={value}>{children}</KeyboardInsetContext.Provider>;
}

export function useKeyboardInsetRegistration(open: boolean): void {
  const context = useContext(KeyboardInsetContext);

  useEffect(() => {
    if (!open || !context) return;
    return context.registerOpenSheet();
  }, [context, open]);
}
