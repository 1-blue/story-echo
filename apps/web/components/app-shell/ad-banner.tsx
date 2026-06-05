"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useAdEligibility } from "@/components/app-shell/ad-eligibility-context";
import { getAdSenseConfig } from "@/lib/ads/adsense-config";
import { SHELL_FIXED_CHROME_CLASS } from "@/lib/app-layout";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AD_MAX_WIDTH_PX = 1024;
export const AD_HEIGHT_PX = 50;

export function AdBanner() {
  const { shouldRequestAd } = useAdEligibility();
  const config = getAdSenseConfig();
  const pushedRef = useRef(false);

  useEffect(() => {
    pushedRef.current = false;
  }, [shouldRequestAd, config?.slot]);

  useEffect(() => {
    if (!config || !shouldRequestAd) {
      pushedRef.current = false;
      return;
    }

    if (pushedRef.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // AdSense push can fail during hot reload or blocked requests.
    }
  }, [config, shouldRequestAd]);

  if (!config || !shouldRequestAd) {
    return null;
  }

  return (
    <>
      <Script
        id="adsbygoogle-init"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.client}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <aside
        aria-label="광고"
        className={`${SHELL_FIXED_CHROME_CLASS} ad-banner-slot bottom-[var(--shell-tab-height)] flex h-[var(--ad-strip-height)] max-h-[var(--ad-strip-height)] min-h-[var(--ad-strip-height)] shrink-0 items-center justify-center overflow-hidden border-t border-hairline bg-ad-banner px-2`}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            maxWidth: AD_MAX_WIDTH_PX,
            height: AD_HEIGHT_PX,
          }}
          data-ad-client={config.client}
          data-ad-slot={config.slot}
          {...(config.adTest ? { "data-adtest": "on" } : {})}
        />
      </aside>
    </>
  );
}
