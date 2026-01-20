"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>ZYNTRIX - Real-Time Cyber Safety Platform</title>
        <meta name="description" content="Advanced AI-powered phishing and social engineering detection system. Protect yourself from cyber threats in real-time." />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {mounted && showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        {mounted && !showSplash && children}
      </body>
    </html>
  );
}
