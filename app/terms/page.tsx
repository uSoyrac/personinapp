// TEMPLATE — have a lawyer review before launch.
import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of PracticeForge, including accounts, subscriptions, billing and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="June 2026">
      <LegalSection heading="1. Acceptance of Terms">
        By accessing or using PracticeForge (the &quot;Service&quot;), you agree to be bound by these Terms.
        If you do not agree, please do not use the Service.
      </LegalSection>

      <LegalSection heading="2. Description of the Service">
        PracticeForge is an independent, AI-assisted study tool that generates exam-style practice for
        IELTS, TOEFL and General English. It is not affiliated with, endorsed by, or associated with IDP
        Education, the British Council, Cambridge Assessment English, or Educational Testing Service (ETS).
        Scores and feedback are estimates for self-study only and are not official results.
      </LegalSection>

      <LegalSection heading="3. Accounts">
        You are responsible for the activity under your account and for keeping your credentials secure.
        You must provide accurate information and be old enough to form a binding contract in your
        jurisdiction.
      </LegalSection>

      <LegalSection heading="4. Subscriptions and Billing">
        Paid plans are billed on a recurring basis through our payment processor, Stripe. By subscribing
        you authorise recurring charges until you cancel. Prices may change with notice. You can manage or
        cancel your subscription at any time from the billing portal.
      </LegalSection>

      <LegalSection heading="5. Cancellations and Refunds">
        You may cancel at any time and retain access until the end of the current billing period. Refunds,
        where offered, are described on our pricing page and handled case by case.
      </LegalSection>

      <LegalSection heading="6. Acceptable Use">
        You agree not to misuse the Service, including attempting to disrupt it, reverse engineer it,
        scrape it at scale, or use it for unlawful purposes.
      </LegalSection>

      <LegalSection heading="7. Intellectual Property">
        The Service, its branding and original content are owned by PracticeForge. Content you create or
        save remains yours; you grant us a limited licence to store and process it to operate the Service.
      </LegalSection>

      <LegalSection heading="8. Disclaimers and Limitation of Liability">
        The Service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
        permitted by law, PracticeForge is not liable for indirect or consequential damages, or for exam
        outcomes based on AI-generated practice.
      </LegalSection>

      <LegalSection heading="9. Changes to These Terms">
        We may update these Terms from time to time. Continued use after changes take effect constitutes
        acceptance of the revised Terms.
      </LegalSection>

      <LegalSection heading="10. Contact">
        Questions about these Terms? Contact us at support@practiceforge.com.
      </LegalSection>
    </LegalPage>
  );
}
