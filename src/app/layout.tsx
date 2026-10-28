import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";

import "./globals.css";
import { LangProvider } from "@/lib/i18n/client";
import { getLang, getT } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/url";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  const title = `${site.name} — ${t.meta.tagline}`;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${site.name}` },
    description: t.meta.description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: t.meta.description,
      siteName: site.name,
      locale: t.ogLocale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: t.meta.description },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${bodoni.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
