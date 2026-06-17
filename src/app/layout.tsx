import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Kaushan_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const kaushanScript = Kaushan_Script({
  variable: "--font-calligraphy",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goldiam Jewellers — Document Management",
  description:
    "Generate valuation certificates, guarantee certificates, gift vouchers, and credit notes for Goldiam Jewellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${lato.variable} ${kaushanScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
