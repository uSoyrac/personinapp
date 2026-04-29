import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
  description:
    "Turn any article or transcript into personalised IELTS Academic and TOEFL iBT exam-style practice in seconds. Reading questions, vocabulary, writing prompts, and a 7-day study plan.",
  keywords: [
    "IELTS practice",
    "TOEFL practice",
    "exam preparation",
    "AI study tool",
    "reading comprehension",
    "academic vocabulary",
  ],
  authors: [{ name: "PracticeForge" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
