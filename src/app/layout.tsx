import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const lato = Lato({ weight: ['400', '700', '900'], subsets: ["latin"], variable: '--font-lato' });

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
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        <div className="flex min-h-screen font-sans antialiased">
          <Sidebar className="hidden md:flex fixed inset-y-0 w-[240px]" />
          <main className="flex-1 md:pl-[240px]">
            {/* Mobile Header placeholder - handled in Sidebar or Page */}
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
