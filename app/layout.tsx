import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Premium, geometric font
import "./globals.css";

// Load the font with variable support
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// 1. Enhanced Metadata for SEO Excellence
export const metadata: Metadata = {
  title: {
    default: "SaSa Cleaners | Premium Cleaning Services",
    template: "%s | SaSa Cleaners",
  },
  description: "Experience spotless results with SaSa Cleaners. We curate environments with expert residential and commercial cleaning services designed for clarity and comfort.",
  keywords: ["luxury cleaning", "office sanitation", "deep cleaning", "housekeeping", "eco-friendly cleaning"],
  openGraph: {
    title: "SaSa Cleaners - Elevate Your Space",
    description: "Professional cleaning services for homes and offices.",
    type: "website",
    locale: "en_US",
    // url: 'https://sasacleaners.com', // Add your actual URL
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'SaSa Cleaners Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "SaSa Cleaners - Elevate Your Space",
    description: "Professional cleaning services for homes and offices.",
    images: ['/images/logo.png'],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// 2. Viewport settings for perfect mobile rendering
export const viewport: Viewport = {
  themeColor: "#020617", // Matches slate-950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} font-sans antialiased bg-slate-950 text-slate-50 selection:bg-cyan-500/30`}>
        {children}
      </body>
    </html>
  );
}