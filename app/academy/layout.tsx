import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy — Study Insights",
  description:
    "Expert IELTS and TOEFL study guides, exam strategy, and band-score insights to help you prepare smarter.",
  alternates: { canonical: "/academy" },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
