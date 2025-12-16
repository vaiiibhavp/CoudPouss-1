import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/lib/redux/ReduxProvider";



const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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
        className={`${lato.variable} antialiased`}
      >
        <ReduxProvider>
          <Providers>
              {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
