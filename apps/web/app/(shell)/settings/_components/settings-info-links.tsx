"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { openRoute, SETTINGS_INFO_ROUTES } from "@/lib/routes/routes";
import { SettingsRow, SettingsSection } from "./settings-section";

function isExternalRoute(
  route: (typeof SETTINGS_INFO_ROUTES)[number],
): route is (typeof SETTINGS_INFO_ROUTES)[number] & { external: true } {
  return "external" in route && !!route.external;
}

export function SettingsInfoLinks() {
  return (
    <SettingsSection title="정보">
      {SETTINGS_INFO_ROUTES.map((route) =>
        isExternalRoute(route) ? (
          <SettingsRow key={route.url} label={route.label} onClick={() => openRoute(route.url)}>
            <ChevronRight className="size-4 text-stone" strokeWidth={1.75} />
          </SettingsRow>
        ) : (
          <Link
            key={route.url}
            href={route.url}
            className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-hairline px-4 py-3 text-left last:border-b-0"
          >
            <span className="text-sm text-charcoal">{route.label}</span>
            <ChevronRight className="size-4 text-stone" strokeWidth={1.75} />
          </Link>
        ),
      )}
    </SettingsSection>
  );
}
