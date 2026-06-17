import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    default: "J-Track — Track every job application with clarity",
    template: "%s | J-Track",
  },
  description:
    "J-Track is the calm, human workspace for job seekers and recruiters. Track applications, manage candidates, and stay organized.",
  keywords: [
    "job tracking",
    "application tracker",
    "job search",
    "recruitment",
    "candidate management",
    "career",
    "job hunt",
  ],
  authors: [{ name: "J-Track" }],
  creator: "J-Track",
  publisher: "J-Track",
  metadataBase: new URL("https://j-track.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "J-Track",
    title: "J-Track — Track every job application with clarity",
    description:
      "J-Track is the calm, human workspace for job seekers and recruiters.",
  },
  twitter: {
    card: "summary_large_image",
    title: "J-Track — Track every job application with clarity",
    description:
      "J-Track is the calm, human workspace for job seekers and recruiters.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}