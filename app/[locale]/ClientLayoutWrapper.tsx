"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/contexts/AuthContext";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  session: any;
  messages: any;
  locale: string;
}

export default function ClientLayoutWrapper({
  children,
  session,
  messages,
  locale,
}: ClientLayoutWrapperProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
