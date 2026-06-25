import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PracticeForge account to continue your IELTS and TOEFL practice.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "3rem" }}>
      <AuthForm mode="login" />
    </div>
  );
}
