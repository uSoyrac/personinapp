// TEMPLATE — have a lawyer review before launch.
import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How PracticeForge uses cookies, the categories we use, and how you can manage your preferences.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="June 2026">
      <LegalSection heading="What cookies are">
        Cookies are small text files stored on your device that help a website function and remember your
        preferences. We use them sparingly and never to sell your data.
      </LegalSection>

      <LegalSection heading="Categories we use">
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          <li><strong>Essential</strong> — required to sign you in and keep the site working. Always on.</li>
          <li><strong>Analytics</strong> — anonymous usage data that helps us improve the product. Optional.</li>
          <li><strong>Marketing</strong> — used to personalise offers. Optional and off by default.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Managing your preferences">
        You choose which optional cookies to allow from the banner shown on your first visit. You can change
        your choice at any time using the <strong>Cookie settings</strong> link in the footer.
      </LegalSection>

      <LegalSection heading="Third-party cookies">
        Some providers we rely on (such as Supabase for authentication and Stripe for payments) may set their
        own essential cookies to deliver their part of the Service securely.
      </LegalSection>

      <LegalSection heading="Changes">
        We may update this policy and will revise the date above when we do.
      </LegalSection>

      <LegalSection heading="Contact">
        Questions about cookies? Email privacy@practiceforge.com.
      </LegalSection>
    </LegalPage>
  );
}
