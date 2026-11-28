import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Barlow_Semi_Condensed, DM_Serif_Display, Overpass } from "next/font/google";
import "./globals.css";

// next/font downloads each font at build time and serves it from our own site
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: "800",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "VaultRun",
  description: "Cash runs for a small ATM business",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="interstate"
      className={`${atkinson.variable} ${barlow.variable} ${overpass.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
