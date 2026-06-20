import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SignupModal from "@/components/SignupModal";
import ToastContainer from "@/components/Toast";
import { AppProvider } from "@/lib/AppContext";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
    template: "%s | PracticeForge"
  },
  description:
    "Turn any article or text into personalised IELTS Academic and TOEFL iBT exam-style practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
  keywords: [
    "IELTS practice",
    "TOEFL practice",
    "exam preparation",
    "AI study tool",
    "reading comprehension",
    "academic vocabulary",
    "AI language tutor",
    "General English",
    "AI Search Engine Optimization"
  ],
  authors: [{ name: "PracticeForge" }],
  creator: "PracticeForge Team",
  publisher: "PracticeForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
    description: "Personalised exam practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
    url: SITE_URL,
    siteName: "PracticeForge",
    locale: "en_US",
    type: "website",
    // og:image is provided automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "PracticeForge — AI-Powered IELTS & TOEFL Practice",
    description: "Personalised exam practice in seconds. Unlock dynamic Reading, Vocabulary, and AI Speaking tests.",
    // twitter:image falls back to the generated og:image
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
        <AppProvider>
          <Nav />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <SignupModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
