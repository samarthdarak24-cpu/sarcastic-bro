import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const heading = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "ODOP Connect | Smart Agri Marketplace",
  description: "The premium marketplace for farmers and buyers. Direct sourcing, AI quality grading, and supply chain intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${sans.variable} ${heading.variable} font-sans antialiased text-neut-900 bg-app-bg`}>
        {children}
      </body>
    </html>
  );
}
