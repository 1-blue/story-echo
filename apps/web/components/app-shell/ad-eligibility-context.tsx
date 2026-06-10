"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getAdSenseConfig } from "@/lib/ads/adsense-config";
import { normalizePath } from "@/lib/native/navigation-fallback";

type AdEligibilityContextValue = {
  pageEligible: boolean;
  setPageEligible: (eligible: boolean) => void;
  shouldRequestAd: boolean;
  showAdStrip: boolean;
};

const AdEligibilityContext = createContext<AdEligibilityContextValue | null>(null);

const AD_BLOCKED_PATHS = new Set(["/settings"]);

export function AdEligibilityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pageEligible, setPageEligible] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const config = getAdSenseConfig();

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPageEligible(false);
  }

  const shouldRequestAd = useMemo(() => {
    if (!config) return false;
    if (AD_BLOCKED_PATHS.has(normalizePath(pathname))) return false;
    return pageEligible;
  }, [config, pageEligible, pathname]);

  const showAdStrip = shouldRequestAd;

  const value = useMemo(
    () => ({
      pageEligible,
      setPageEligible,
      shouldRequestAd,
      showAdStrip,
    }),
    [pageEligible, shouldRequestAd, showAdStrip],
  );

  return <AdEligibilityContext.Provider value={value}>{children}</AdEligibilityContext.Provider>;
}

export function useAdEligibility() {
  const context = useContext(AdEligibilityContext);
  if (!context) {
    throw new Error("useAdEligibility must be used within AdEligibilityProvider");
  }
  return context;
}

export function useAdEligible(eligible: boolean) {
  const { setPageEligible } = useAdEligibility();

  useEffect(() => {
    setPageEligible(eligible);
    return () => setPageEligible(false);
  }, [eligible, setPageEligible]);
}
