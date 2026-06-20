import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description:
    "Compare the Starter (Free), Pro Study and Elite Mastery plans. Unlimited AI practice, dictionary, and an AI speaking examiner. Cancel anytime.",
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
