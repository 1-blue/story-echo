"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeviceIdBootstrap } from "./providers/device-id-bootstrap";
import { NativeWebViewBootstrap } from "./providers/native-webview-bootstrap";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DeviceIdBootstrap />
      <NativeWebViewBootstrap />
      {children}
    </QueryClientProvider>
  );
}
