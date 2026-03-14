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
    "A stock dashboard that tracks 15 major stocks using Alpha Vantage data",
  openGraph: {
    title: "TensorWave Stock Dashboard",
    description:
      "A stock dashboard that tracks 15 major stocks using Alpha Vantage data",
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
      <head>
        <meta name="theme-color" content="#f5ebe0" />
      </head>
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
