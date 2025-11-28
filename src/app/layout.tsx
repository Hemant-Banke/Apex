import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apex",
  description: "Track your wealth locally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <TopNav />
          <div className="flex">
            <div className="hidden md:block w-64 shrink-0">
              <Sidebar className="fixed top-16 bottom-0 w-64" />
            </div>
            <main className="flex-1 container py-6 md:px-8 max-w-7xl mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
