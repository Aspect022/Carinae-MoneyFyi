import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MoneyFyi - AI-Powered Financial Intelligence",
  description:
    "AI-powered financial intelligence dashboard for Indian SMEs. Analyze bank statements, invoices, and UPI transactions to detect fraud, compliance risks, and cashflow issues.",
  generator: "v0.app",
  keywords: [
    "fintech",
    "AI",
    "financial intelligence",
    "SME",
    "India",
    "fraud detection",
    "cashflow",
  ],
  authors: [{ name: "MoneyFyi" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoneyFyi",
  },
  icons: {
    icon: [
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logo-192.png",
  },
  openGraph: {
    title: "MoneyFyi - AI-Powered Financial Intelligence",
    description:
      "AI-powered financial intelligence dashboard for Indian SMEs. Analyze bank statements, invoices, and UPI transactions to detect fraud, compliance risks, and cashflow issues.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MoneyFyi Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyFyi - AI-Powered Financial Intelligence",
    description: "AI-powered financial intelligence dashboard for Indian SMEs.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F8F6E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans antialiased pb-safe">
        <ThemeProvider defaultTheme="light" storageKey="moneyfyi-theme">
          {children}
          <MobileBottomNav />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
