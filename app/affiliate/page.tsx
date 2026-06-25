"use client";

import { useState } from "react";
import { Banknote, Cookie, Rocket, PartyPopper } from "lucide-react";

export default function AffiliatePage() {
  const [formData, setFormData] = useState({ name: "", email: "", url: "", audienceSize: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this to the backend
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="section" style={{ paddingTop: "4rem" }}>
      <div className="container-sm" style={{ maxWidth: "800px" }}>
        
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ marginBottom: "1rem", display: "inline-flex", background: "#D2FF3A", color: "#000", border: "3px solid #000", fontWeight: 900, padding: "0.5rem 1rem", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "4px 4px 0px #000", borderRadius: "8px", fontSize: "0.875rem" }}>Partner Program</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "1.5rem", fontWeight: 900, lineHeight: 1.1 }}>
            Earn <span style={{ color: "#C4B5FD" }}>30%</span> <span style={{ color: "#FDE047" }}>Recurring</span><br/>Commission.
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#4B5563", lineHeight: 1.6, fontWeight: 500, maxWidth: "700px", margin: "0 auto" }}>
            Join the PracticeForge Partner Program. Recommend the world&apos;s most advanced AI IELTS &amp; TOEFL lab to your students and followers, and earn revenue for every active subscription.
          </p>
        </div>

        {/* Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", background: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}><Banknote size={56} color="#000" strokeWidth={2.5} style={{ background: "#A855F7", padding: "10px", borderRadius: "50%", boxShadow: "4px 4px 0px #000", border: "3px solid #000" }} /></div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#000", fontWeight: 900 }}>30% Recurring</h3>
            <p style={{ fontSize: "1rem", color: "#111827", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>Earn 30% of the subscription fee every single month your referral stays active.</p>
          </div>
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", background: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}><Cookie size={56} color="#000" strokeWidth={2.5} style={{ background: "#FDE047", padding: "10px", borderRadius: "50%", boxShadow: "4px 4px 0px #000", border: "3px solid #000" }} /></div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#000", fontWeight: 900 }}>60-Day Cookie</h3>
            <p style={{ fontSize: "1rem", color: "#111827", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>If they click your link and subscribe within 60 days, you get the credit.</p>
          </div>
          <div className="card" style={{ padding: "3rem 2rem", textAlign: "center", background: "#FFF" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}><Rocket size={56} color="#000" strokeWidth={2.5} style={{ background: "#FCA5A5", padding: "10px", borderRadius: "50%", boxShadow: "4px 4px 0px #000", border: "3px solid #000" }} /></div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#000", fontWeight: 900 }}>High Conversion</h3>
            <p style={{ fontSize: "1rem", color: "#111827", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>Our free tools and targeted onboarding convert visitors into paid users effectively.</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="card-elevated" style={{ padding: "3rem 2rem", marginBottom: "4rem", border: "1px solid var(--border)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Apply Now</h2>
            <p style={{ color: "var(--foreground-muted)" }}>Fill out the form below to get your unique tracking link.</p>
          </div>

          {submitted ? (
            <div className="animate-scaleIn" style={{ padding: "3rem 2rem", textAlign: "center", background: "rgba(16, 185, 129, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><PartyPopper size={48} color="var(--mint-dark)" strokeWidth={1.5} /></div>
              <h3 style={{ fontSize: "1.5rem", color: "var(--mint-dark)", marginBottom: "1rem" }}>Application Received!</h3>
              <p style={{ fontSize: "1.0625rem", color: "var(--foreground)", maxWidth: "400px", margin: "0 auto" }}>
                Thanks for your interest, {formData.name}. Our team will review your channel and email you your unique affiliate link within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input-base" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input-base" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
                </div>
              </div>
              
              <div>
                <label className="label">YouTube / Instagram / TikTok URL</label>
                <input type="url" className="input-base" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://youtube.com/@yourchannel" />
              </div>

              <div>
                <label className="label">Estimated Audience Size</label>
                <select className="input-base" required value={formData.audienceSize} onChange={e => setFormData({...formData, audienceSize: e.target.value})}>
                  <option value="" disabled>Select your audience size</option>
                  <option value="under_10k">Under 10,000</option>
                  <option value="10k_50k">10,000 - 50,000</option>
                  <option value="50k_100k">50,000 - 100,000</option>
                  <option value="over_100k">100,000+</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "1.25rem", fontSize: "1.125rem", justifyContent: "center", marginTop: "1rem" }}>
                Submit Application
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem" }}>How do I get paid?</h4>
              <p style={{ margin: 0, color: "var(--foreground-muted)", lineHeight: 1.6 }}>We process payouts via PayPal or direct bank transfer on the 15th of every month for the previous month&apos;s earnings. Minimum payout is $50.</p>
            </div>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem" }}>What is a recurring commission?</h4>
              <p style={{ margin: 0, color: "var(--foreground-muted)", lineHeight: 1.6 }}>If a student uses your link to buy the $15/mo Pro plan, you get $4.50 every single month for as long as they remain subscribed.</p>
            </div>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem" }}>Do you provide promotional materials?</h4>
              <p style={{ margin: 0, color: "var(--foreground-muted)", lineHeight: 1.6 }}>Yes! Once approved, you&apos;ll get access to a dashboard with brand assets, logo files, and suggested email/social media copy to make promoting easy.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
