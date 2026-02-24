import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { AudioProvider } from "@/components/AudioController";
import "./globals.css";

const arcadeFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-arcade",
  display: "swap"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "DubQuant | UW Stock Learning Simulator",
  description:
    "DubQuant is a UW-only gamified stock learning simulator with daily DubCoins, streaks, and leaderboards."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${arcadeFont.variable} ${monoFont.variable} font-mono bg-obsidian text-text crt-screen`}>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
