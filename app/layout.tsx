import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrbitStudy — AI Aerospace Study Tool",
  description:
    "AI-powered study tool for aerospace engineering students with ADHD. Step-by-step problem solving, Socratic tutoring, practice problems, and more.",
  keywords: ["aerospace engineering", "ADHD", "study tool", "AI tutor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#27231E] text-[#FFF5F5]`}
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
              <main className="flex-1 overflow-y-auto lg:pt-0 pt-14 star-bg">
                {children}
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
