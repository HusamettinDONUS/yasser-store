"use client";

import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  messages: Record<string, unknown>;
  locale: string;
}

export default function ClientLayoutWrapper({
  children,
  messages,
  locale,
}: ClientLayoutWrapperProps) {
  // Ensure messages is an object and not undefined
  const safeMessages = messages || {};

  return (
    <ErrorBoundary>
      <NextIntlClientProvider
        messages={safeMessages}
        locale={locale}
        timeZone="Europe/Istanbul"
        onError={(error) => {
          // Handle i18n errors gracefully
          if (process.env.NODE_ENV === "development") {
            console.warn("NextIntl error:", error);
          }
        }}
      >
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
