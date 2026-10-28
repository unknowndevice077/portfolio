import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import IframeScrollGuard from "./components/IframeScrollGuard";
import { themeBootScript } from "./lib/accents";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

const title = "Fritz Dela Cruz — Full-Stack, AI & Embedded Engineer";
const description =
  "Computer Engineering student and full-stack intern building SaaS products, real-time AI for CCTV, and ESP32 IoT devices.";

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
    <html lang="en" className={`${serif.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        {children}
        <IframeScrollGuard />
      </body>
    </html>
  );
}
