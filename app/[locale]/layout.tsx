import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Inter, Montserrat, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
// Auth imports removed - using simple session-based auth
import { locales } from "@/i18n/request";
import "../globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
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

  let messages: Record<string, unknown> = {};

  try {
    messages = await getMessages({ locale }).catch(() => ({}));
  } catch (error) {
    console.warn("Failed to load messages:", error);
    messages = {};
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${montserrat.variable} ${
          cairo.variable
        } antialiased ${locale === "ar" ? "font-cairo" : "font-inter"}`}
      >
        <ClientLayoutWrapper messages={messages} locale={locale}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
