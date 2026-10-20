import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/data/site-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PortfolioDock } from "@/components/navigation/PortfolioDock";
import "./globals.css";

const sfPro = localFont({
  src: [
    { path: "../../public/fonts/sf-pro.ttf", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/sf-pro-italic.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

const bodoniModa = localFont({
  src: [
    { path: "../../public/fonts/bodoni-moda.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/bodoni-moda-italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  // Explicit local preview origin; real canonicals/indexing require siteConfig.url.
  metadataBase: new URL(siteConfig.url ?? "http://localhost:3000"),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  description: siteConfig.description,
  ...(siteConfig.url ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
    ...(siteConfig.url ? { url: siteConfig.url } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: siteConfig.url
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sfPro.variable} ${bodoniModa.variable}`}>
      <body id="top" className="relative min-h-screen pb-24 sm:pb-28">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
        <PortfolioDock />
      </body>
    </html>
  );
}
