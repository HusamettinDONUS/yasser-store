"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Session } from "next-auth";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  session: Session | null;
  messages: Record<string, any>;
  locale: string;
}

export default function ClientLayoutWrapper({
  children,
  session,
  messages,
  locale,
}: ClientLayoutWrapperProps) {
  // Ensure messages is an object and not undefined
  const safeMessages = messages || {};

  return (
    <ErrorBoundary>
      <SessionProvider
        session={session}
        refetchInterval={0}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
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
      </SessionProvider>
    </ErrorBoundary>
  );
}
