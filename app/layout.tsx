import "./globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SessionProvider } from "@/components/session-provider";
import DevSwCleanup from "@/components/dev-sw-cleanup";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Bimbingan Belajar Brilliant",
    template: "%s | Brilliant LES",
  },
  description: "Platform belajar dan tryout untuk siswa dari Bimbingan Belajar Brilliant.",
  icons: {
    icon: "/logo.jpg",
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={fontSans.variable} suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <DevSwCleanup />
            <SiteHeader />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
