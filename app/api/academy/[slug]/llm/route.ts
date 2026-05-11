import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Format title from slug (in a real app, you'd fetch from DB)
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Generate plain Markdown representation for LLMs
  // This matches the rich funnel content in the UI perfectly.
  const markdown = `# ${title}
Author: PracticeForge Team
Date: 2026-05-15
Category: Exam Strategies
Read Time: 7 min

This is a comprehensive guide to mastering your English exams. Artificial Intelligence has revolutionized the way we prepare for IELTS and TOEFL. By utilizing advanced analytics and natural language processing, you can target specific weak points in your academic vocabulary and essay structures.

## Table of Contents
1. Why AI Tutors Work
2. AI vs Traditional Tutoring
3. Tips for Success

## 1. Why AI Tutors Work
Practice consistently with our AI tutor to identify your weak spots and improve your band score efficiently. Unlike traditional methods, real-time feedback allows you to instantly correct mistakes. To master the fundamentals, you might want to review our [General English Lab](https://practiceforge.com/general-english) before tackling the heavy exams.

> **Stuck at Band 6.0?**
> Join 15,000+ students who unlocked their dream score. Try the AI Simulator now at https://practiceforge.com/practice

## 2. AI vs Traditional Tutoring
According to research from leading linguistic authorities like [Cambridge Assessment](https://www.cambridgeenglish.org/), instant error correction accelerates language acquisition by up to 40%.

| Feature | Traditional Tutor | PracticeForge AI |
| :--- | :--- | :--- |
| **Availability** | 1-2 hours/week | 24/7 Unlimited |
| **Feedback Speed** | Next day | Instant (Seconds) |
| **Cost** | $40-$80 / hour | From $15 / month |
| **Analytics** | Subjective notes | Data-driven progress tracking |

## 3. Tips for Success
- **Consistency:** Practice every single day, even if it's just 15 minutes.
- **Targeted Review:** Don't just do tests; review your mistakes thoroughly.
- **Vocab Context:** Learn words in collocations rather than isolated lists.

---
**Ready to apply these strategies?** 
Stop guessing your score. Get instant feedback on your essays, speaking, and reading comprehension.
- Start Free Practice: https://practiceforge.com/practice
- View Elite Plans: https://practiceforge.com/pricing

Source: https://practiceforge.com/academy/${slug}
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
