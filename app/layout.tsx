import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemHud from "./components/SystemHud";
import IframeScrollGuard from "./components/IframeScrollGuard";

// Mono doubles as the display face now (see globals.css's .font-display) —
// no separate rounded-sans display font, so the full weight range it needs
// for headings lives here instead of a second Google Fonts family.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const title = "Jae — Applied AI & Full-Stack Engineer";
const description =
  "Final-year Computer Engineering student building production AI and full-stack systems — real-time crime detection, trading automation, and AI-powered tools, shipped end-to-end.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-five-rho-21.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/images/avatar-placeholder.jpg", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/images/avatar-placeholder.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body>
        {children}
        <SystemHud />
        <IframeScrollGuard />
      </body>
    </html>
  );
}
