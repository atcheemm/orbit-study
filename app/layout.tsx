import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aerospace Study — AI Aerospace Study Tool",
  description:
    "AI-powered study tool for aerospace engineering students. Step-by-step problem solving, Socratic tutoring, practice problems, and more.",
  keywords: ["aerospace engineering", "study tool", "AI tutor"],
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
        style={{ background: '#F0F4F8', color: '#37474F' }}
      >
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex shrink-0">
              <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile header */}
              <Header />

              {/* Page content */}
              <main className="flex-1 overflow-y-auto lg:pt-0 pt-14" style={{ background: '#F0F4F8' }}>
                {children}
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
