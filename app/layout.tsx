import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroStudy — Master Aerospace Engineering",
  description:
    "AI-powered study platform for aerospace engineering students. Step-by-step problem solving, Socratic tutoring, formula reference, practice problems, and gamified learning.",
  keywords: ["aerospace engineering", "study tool", "AI tutor", "LaTeX", "orbital mechanics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#0A0A0A', color: '#FFFFFF' }}
      >
        <TooltipProvider>
          <Navbar />
          <main style={{ paddingTop: '60px', minHeight: '100vh', background: '#0A0A0A' }}>
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
