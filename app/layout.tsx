import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { HeroHighlightSection } from "@/components/hero";
import { Analytics } from "@vercel/analytics/react";
import { AuroraBackground } from "@/components/aurora-background";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export const metadata: Metadata = {
  title: {
    default: "Watch Beyond - Streaming Availability Across Countries",
    template: "%s | Watch Beyond",
  },
  description:
    "Find where to stream movies and TV shows across different countries and services, with integrated VPN recommendations for global access.",
  keywords: [
    "streaming",
    "movies",
    "TV shows",
    "VPN",
    "global streaming",
    "Netflix",
    "Disney+",
    "HBO Max",
    "Amazon Prime",
  ],
  authors: [{ name: "Watch Beyond Team" }],
  creator: "Watch Beyond",
  publisher: "Watch Beyond",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://watchbeyond.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  openGraph: {
    title: "Watch Beyond - Global Streaming Availability Finder",
    description:
      "Discover where to stream your favorite content worldwide with VPN integration for unrestricted access.",
    url: "https://watchbeyond.com",
    siteName: "Watch Beyond",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Watch Beyond - Find streaming content globally",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Beyond - Global Streaming Finder",
    description:
      "Find where to stream movies and TV shows across different countries with VPN integration.",
    images: ["/twitter-image.jpg"],
    creator: "@watchbeyond",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "entertainment",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuroraBackground>
            <HeroHighlightSection />
            <main className="container mx-auto px-6 flex-grow ">
              {children}
            </main>
          </AuroraBackground>
          <SiteFooter className="px-6 bg-slate-900 " />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
