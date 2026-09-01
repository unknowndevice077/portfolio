import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fritz Dela Cruz — Applied AI & Full-Stack Engineer",
  description:
    "Final-year Computer Engineering student building production AI and full-stack systems — real-time crime detection, trading automation, and AI-powered tools, shipped end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
