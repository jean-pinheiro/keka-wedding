import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";
import { ainslay } from "@/src/lib/fonts";

export const metadata: Metadata = {
  title: "Jéssica e Arthur",
  description: "Celebre conosco nosso dia especial",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${ainslay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
