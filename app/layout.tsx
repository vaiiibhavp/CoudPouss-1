import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/lib/redux/ReduxProvider";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoudPouss - Your Trusted Partner For All Home Needs",
  description: "Empowering seniors with easy access to trusted help, care, and companionship whenever needed.",
  keywords: ["home services", "senior care", "home maintenance", "CoudPouss"],
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
        <Providers>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
