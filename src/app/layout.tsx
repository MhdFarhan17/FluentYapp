import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "sonner";
import PwaRegister from "@/components/PwaRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluentYapp - Master English Interactively",
  description: "A premium, gamified English learning platform designed to help you achieve fluency through interactive lessons, grammar libraries, and real-time pronunciation practice.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "FluentYapp - Master English Interactively",
    description: "A premium, gamified English learning platform. Practice speaking, learn grammar, and climb the leaderboard!",
    url: "https://fluentyapp.vercel.app", // Adjust this if custom domain
    siteName: "FluentYapp",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "FluentYapp Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluentYapp - Master English Interactively",
    description: "Gamified English learning platform. Master your skills today!",
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FluentYapp",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-center" expand={false} />
          <ScrollToTop />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
