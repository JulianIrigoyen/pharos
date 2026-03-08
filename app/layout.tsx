import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pharos English Lab | Cambridge Exam Diagnostics",
  description:
    "Professional diagnostic reports for Cambridge B2 First and C1 Advanced exam preparation. AI-powered analysis with 30+ years of expert Cambridge methodology.",
  keywords: [
    "Cambridge exam preparation",
    "B2 First",
    "C1 Advanced",
    "English diagnostic",
    "Cambridge writing",
    "Use of English",
    "exam practice",
  ],
  openGraph: {
    title: "Pharos English Lab",
    description:
      "Navigate your Cambridge exam preparation with AI-powered diagnostic reports.",
    type: "website",
    locale: "en_GB",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Pharos English Lab",
  description:
    "Online diagnostic platform for Cambridge English exam preparation. Professional analysis for B2 First and C1 Advanced.",
  offers: [
    {
      "@type": "Offer",
      name: "Writing Diagnostic",
      price: "15.00",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Use of English Diagnostic",
      price: "8.00",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Listening Diagnostic",
      price: "8.00",
      priceCurrency: "USD",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
