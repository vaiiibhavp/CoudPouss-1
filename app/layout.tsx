import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";



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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
