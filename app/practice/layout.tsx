import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Practice",
  description:
    "Paste any article or text and instantly generate IELTS Academic and TOEFL iBT style reading, vocabulary and speaking practice tailored to your level.",
  alternates: { canonical: "/practice" },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
