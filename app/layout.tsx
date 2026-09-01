import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "900"],
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JAE — Applied AI & Full-Stack Engineer",
  description:
    "Final-year Computer Engineering student building production AI and full-stack systems — real-time crime detection, trading automation, and AI-powered tools, shipped end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable}`}>
      <body>{children}</body>
    </html>
  );
}
