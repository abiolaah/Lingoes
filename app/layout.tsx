import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lingoes App",
  description: "Language Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
