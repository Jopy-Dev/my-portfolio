import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const bebasNeue = localFont({
  src: "../assets/fonts/BebasNeue-Regular.woff2",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  robots:
    siteConfig.deployEnvironment === "production" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bebasNeue.variable}>
        <Script src={siteConfig.assetPath("/preferences-init.js")} strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
