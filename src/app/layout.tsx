import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Agent Hub",
  description: "จัดการและติดตาม AI Agents ของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
