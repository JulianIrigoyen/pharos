import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Playfair_Display, Raleway } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { UtmCapture } from "@/components/analytics/UtmCapture";
import "./globals.css";

const tanPearl = localFont({
  src: "../public/fonts/tan-pearl.otf",
  variable: "--font-logo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pharos English Lab | Cambridge Exam Diagnostics",
  description:
    "Professional diagnostic reports for Cambridge B2 First and C1 Advanced exam preparation.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${tanPearl.variable} ${playfair.variable} ${raleway.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <MetaPixel />
        <UtmCapture />
      </body>
    </html>
  );
}