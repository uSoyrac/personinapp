import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PracticeForge team for support, billing, partnerships, or privacy requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us" lastUpdated="June 2026">
      <LegalSection heading="Support">
        Need help with your account or practice sessions? Email{" "}
        <a href="mailto:support@practiceforge.com" style={{ color: "var(--primary)" }}>support@practiceforge.com</a>{" "}
        and we will get back to you as soon as we can.
      </LegalSection>

      <LegalSection heading="Billing">
        For subscription, invoice, or refund questions, email{" "}
        <a href="mailto:billing@practiceforge.com" style={{ color: "var(--primary)" }}>billing@practiceforge.com</a>.
      </LegalSection>

      <LegalSection heading="Partnerships">
        Interested in the affiliate or partner program? Visit the{" "}
        <a href="/affiliate" style={{ color: "var(--primary)" }}>Partner Program</a> page or email
        partners@practiceforge.com.
      </LegalSection>

      <LegalSection heading="Privacy Requests">
        To access, export, or delete your data, email{" "}
        <a href="mailto:privacy@practiceforge.com" style={{ color: "var(--primary)" }}>privacy@practiceforge.com</a>.
      </LegalSection>
    </LegalPage>
  );
}
