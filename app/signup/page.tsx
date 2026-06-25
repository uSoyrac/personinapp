import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up free",
  description: "Create a free PracticeForge account and start generating personalised IELTS and TOEFL practice in seconds.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <div className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "3rem" }}>
      <AuthForm mode="signup" />
    </div>
  );
}
