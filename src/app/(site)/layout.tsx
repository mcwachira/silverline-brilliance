import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "../globals.css";
import { AppProviders } from "@/src/app/providers";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import WhatsAppButton from "@/src/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline-brilliance.com'),
  title: {
    default: 'Silverline Technologies | Professional AudioVisual Services',
    template: '%s | Silverline Technologies'
  },
  description: 'Silverline Technologies offers professional audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting for corporate events and productions across Kenya.',
  keywords: [
    'audiovisual services',
    'live streaming',
    'event coverage',
    'corporate events',
    'photography services',
    'sound systems',
    'stage lighting',
    'video production',
    'hybrid events',
    'event production Kenya',
    'professional AV services',
    'Silverline Technologies'
  ],
  authors: [{ name: 'Silverline Technologies' }],
  creator: 'Silverline Technologies',
  publisher: 'Silverline Technologies',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Silverline Technologies',
    title: 'Silverline Technologies | Professional AudioVisual Services',
    description: 'Professional audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting for corporate events.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Silverline Technologies - Professional AudioVisual Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silverline Technologies | Professional AudioVisual Services',
    description: 'Professional audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting.',
    images: ['/og-image.jpg'],
    creator: '@silverlinetech',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
                </div>
              }>
                {children}
              </Suspense>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
