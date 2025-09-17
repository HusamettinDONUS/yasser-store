import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Inter, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { locales } from "@/i18n/request";
import "../globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Yasser Store - Premium Clothing",
  description:
    "Discover premium quality clothing at Yasser Store. Shop the latest fashion trends.",
};

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  let messages: Record<string, any> = {};
  let session = null;

  try {
    [messages, session] = await Promise.all([
      getMessages({ locale }).catch(() => ({})),
      getServerSession(authOptions).catch(() => null),
    ]);
  } catch (error) {
    console.warn("Failed to load session or messages:", error);
    messages = {};
    session = null;
  }

  return (
    <html lang={locale} dir="ltr">
      <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
        <ClientLayoutWrapper
          session={session}
          messages={messages}
          locale={locale}
        >
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
