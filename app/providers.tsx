"use client";

import { NextUIProvider } from "@nextui-org/react";
import ConvexClientProvider from "./ConvexClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </NextUIProvider>
  );
}
