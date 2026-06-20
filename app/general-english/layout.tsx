import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General English Lab",
  description:
    "Turn any text into interactive cloze exercises, sentence shadowing, and grammar breakdowns to practise everyday English.",
  alternates: { canonical: "/general-english" },
};

export default function GeneralEnglishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
