import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SiteFooter from "@/_components/site-footer";
import SiteHeader from "@/_components/site-header";
import { WalletProvider } from "@/context/WalletContext";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        <WalletProvider>
          <UserProvider>
            <SiteHeader />
            <Toaster richColors position="top-right" />
            {children}
            <SiteFooter />
          </UserProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
