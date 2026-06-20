// TEMPLATE — have a lawyer review before launch.
import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PracticeForge collects, uses, and protects your personal data, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 2026">
      <LegalSection heading="1. Data We Collect">
        Account data you provide (such as your email and display name), content you create or save (words,
        questions, progress), and basic usage data needed to operate the Service. Payment details are
        handled by Stripe; we do not store full card numbers.
      </LegalSection>

      <LegalSection heading="2. How We Use Your Data">
        To provide and improve the Service, authenticate you, process subscriptions, personalise practice,
        and communicate important account or billing information.
      </LegalSection>

      <LegalSection heading="3. Third-Party Processors">
        We rely on trusted providers to run the Service: Supabase (authentication and database), Stripe
        (payments), and AI providers used to generate practice content. Each processes data only as needed
        to deliver their part of the Service.
      </LegalSection>

      <LegalSection heading="4. Cookies">
        We use essential cookies to keep you signed in and to operate core features. We do not use them to
        sell your data.
      </LegalSection>

      <LegalSection heading="5. Data Retention">
        We keep your data while your account is active. You may request deletion of your account and
        associated data at any time.
      </LegalSection>

      <LegalSection heading="6. Your Rights">
        Depending on your location (for example under GDPR or CCPA), you may have rights to access,
        correct, export, or delete your personal data. Contact us to exercise these rights.
      </LegalSection>

      <LegalSection heading="7. Security">
        We use industry-standard measures to protect your data, including encryption in transit and
        access controls. No method of transmission is fully secure, so we cannot guarantee absolute
        security.
      </LegalSection>

      <LegalSection heading="8. Children">
        The Service is not directed at children under 13 (or the minimum age in your jurisdiction). We do
        not knowingly collect their data.
      </LegalSection>

      <LegalSection heading="9. Changes">
        We may update this policy and will revise the date above when we do.
      </LegalSection>

      <LegalSection heading="10. Contact">
        Privacy questions or requests? Contact us at privacy@practiceforge.com.
      </LegalSection>
    </LegalPage>
  );
}
