import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PrivacyProvider } from "@/providers/privacy-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinPlan — Meu Norte",
  description: "Planejador financeiro pessoal — organize receitas, despesas e metas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <PrivacyProvider>{children}</PrivacyProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
