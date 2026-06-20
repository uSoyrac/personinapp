"use client";

import { useState } from "react";
import Link from "next/link";

export default function AcademyPage() {
  const [activePost, setActivePost] = useState<{slug: string, title: string, category: string} | null>(null);

  const posts = [
    { slug: "how-to-score-band-8-ielts-writing", title: "How to Score Band 8 in IELTS Writing Task 2", category: "IELTS Tips" },
    { slug: "toefl-speaking-templates", title: "The Ultimate TOEFL Speaking Templates (2026)", category: "TOEFL Strategies" },
    { slug: "mastering-academic-vocabulary", title: "Mastering Academic Vocabulary for Beginners", category: "General English" },
    { slug: "ielts-reading-time-management", title: "Time Management Strategies for IELTS Reading", category: "IELTS Tips" },
    { slug: "toefl-listening-note-taking", title: "Note-Taking Techniques for TOEFL Listening", category: "TOEFL Strategies" },
    { slug: "idioms-for-speaking-success", title: "Common Idioms for Speaking Success", category: "General English" }
  ];

  return (
    <div className="section" style={{ paddingTop: "4rem", position: "relative" }}>
      <div className="container">
        <h1 style={{ marginBottom: "1rem" }}>PracticeForge <span className="gradient-text">Insights</span></h1>
        <p style={{ fontSize: "1.25rem", color: "var(--foreground-muted)", marginBottom: "3rem" }}>Expert strategies and AI-driven tips to ace your exams.</p>
        
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {posts.map(post => (
            <div 
              key={post.slug} 
              className="card hover-card" 
              onClick={() => setActivePost(post)}
              style={{ cursor: "pointer" }}
            >
              <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{post.title}</h3>
              <p style={{ color: "var(--primary)", fontWeight: 600, margin: 0 }}>Read Article →</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Reading Modal Overlay */}
      {activePost && (
        <div className="animate-fadeInFast" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem"
        }}>
          <div className="card-elevated animate-scaleIn" style={{
            background: "var(--surface)", width: "100%", maxWidth: "800px", maxHeight: "90vh",
            overflowY: "auto", position: "relative", padding: "3rem 2rem"
          }}>
            <button 
              onClick={() => setActivePost(null)}
              style={{
                position: "absolute", top: "1rem", right: "1rem", background: "var(--surface-2)",
                border: "1px solid var(--border)", width: "40px", height: "40px", borderRadius: "50%",
                fontSize: "1.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--foreground)"
              }}
            >
              ✕
            </button>
            
            <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>{activePost.category}</div>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>{activePost.title}</h1>
            
            <div style={{ lineHeight: 1.8, fontSize: "1.125rem", color: "var(--foreground-muted)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <p>
                Welcome to this comprehensive guide on <strong>{activePost.title}</strong>. 
                This article explores the fundamental strategies needed to excel in your upcoming examination.
              </p>
              <div style={{ padding: "1.5rem", background: "var(--surface-2)", borderLeft: "4px solid var(--primary)", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ margin: "0 0 0.5rem", color: "var(--foreground)" }}>Key Takeaway</h4>
                <p style={{ margin: 0 }}>Consistent practice combined with AI-driven feedback reduces study time by 40% while improving overall band scores.</p>
              </div>
              <p>
                One of the most common pitfalls students face is lack of structured feedback. 
                When preparing for high-stakes tests, simply doing mock exams isn&apos;t enough; you must understand <em>why</em> you made mistakes.
              </p>
              <p>
                We highly recommend using our Practice Lab to generate personalized questions and get immediate insights on your weak areas.
              </p>
              
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Link href="/practice" className="btn-primary" style={{ display: "inline-block" }}>
                  Apply this in the Practice Lab
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
