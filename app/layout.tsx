import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import Navbar from "./components/landingpage/navbar";
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
  title: "Teilen Teen",
  description: "A platform for ai driven self improvement and personal growth.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html
  lang="en"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
  <body className="min-h-full flex flex-col">
    <ReduxProvider>
      <TooltipProvider>
      <Navbar />
      {children}
      </TooltipProvider>
    </ReduxProvider>

  </body>
</html>
  );
}
