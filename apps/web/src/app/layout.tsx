import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RealtimeProvider } from "@/providers/RealtimeProvider";

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
  title: "FarmGuard | Smart Agri Marketplace",
  description: "The premium marketplace for farmers and buyers. Direct sourcing, AI quality grading, and supply chain intelligence.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${sans.variable} ${heading.variable} font-sans antialiased text-neut-900 bg-app-bg`}>
        <RealtimeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', fontWeight: 600, fontSize: '13px' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            }}
          />
        </RealtimeProvider>
      </body>
    </html>
  );
}
