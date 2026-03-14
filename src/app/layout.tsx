import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TensorWave Stock Dashboard",
  description:
    "Stock intelligence dashboard tracking 15 major stocks with real-time data from Alpha Vantage",
  openGraph: {
    title: "TensorWave Stock Dashboard",
    description:
      "Stock intelligence dashboard tracking 15 major stocks with real-time data from Alpha Vantage",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <div className="dot-grid pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
