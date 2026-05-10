import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignupModal from "@/components/SignupModal";

export const metadata: Metadata = {
  title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
  description:
    "Turn any article or YouTube video into personalised IELTS Academic and TOEFL iBT exam-style practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
  keywords: [
    "IELTS practice",
    "TOEFL practice",
    "exam preparation",
    "AI study tool",
    "reading comprehension",
    "academic vocabulary",
    "AI language tutor",
    "General English"
  ],
  authors: [{ name: "PracticeForge" }],
  robots: "index, follow",
  openGraph: {
    title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
    description: "Personalised exam practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
    url: "https://practiceforge.com",
    siteName: "PracticeForge",
    images: [
      {
        url: "https://practiceforge.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PracticeForge Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
    description: "Personalised exam practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
    images: ["https://practiceforge.com/og-image.jpg"],
  },
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
        <SignupModal />
      </body>
    </html>
  );
}
