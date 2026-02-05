import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/context";
import { Header } from "@/components/layout/Header";

const GeistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monad Portfolio App",
  description: "View your crypto portfolio on Monad blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable} style={{
      // @ts-ignore
      '--font-geist-sans': GeistSans.style.fontFamily,
      '--font-geist-mono': GeistMono.style.fontFamily,
    }}>
      <body className="font-sans min-h-screen flex flex-col bg-dot-pattern">
        <ContextProvider>
          <Header />
          <main className="flex-1 pb-6">{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
