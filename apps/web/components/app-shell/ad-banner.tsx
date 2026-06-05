"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useAdEligibility } from "@/components/app-shell/ad-eligibility-context";
import { getAdSenseConfig } from "@/lib/ads/adsense-config";
import { SHELL_FIXED_CHROME_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const AD_WIDTH_PX = 728;
const AD_HEIGHT_PX = 90;

export function AdBanner() {
  const { showAdBanner } = useAdEligibility();
  const config = getAdSenseConfig();
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!config || !showAdBanner) {
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
  }, [config, showAdBanner]);

  if (!config || !showAdBanner) {
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
        className={cn(
          SHELL_FIXED_CHROME_CLASS,
          "bottom-[var(--shell-tab-height)] flex h-[var(--ad-strip-height)] min-h-[var(--ad-strip-height)] shrink-0 items-center justify-center overflow-hidden border-t border-hairline bg-ad-banner",
        )}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: AD_WIDTH_PX, height: AD_HEIGHT_PX }}
          data-ad-client={config.client}
          data-ad-slot={config.slot}
          {...(config.adTest ? { "data-adtest": "on" } : {})}
        />
      </aside>
    </>
  );
}
