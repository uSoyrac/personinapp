import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Earn recurring commission promoting PracticeForge to your students and followers. Join the partner program and get brand assets and tracking.",
  alternates: { canonical: "/affiliate" },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
