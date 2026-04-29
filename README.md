# PracticeForge ⚡

> **AI-powered IELTS Academic & TOEFL iBT personalised practice generator**

Turn any article, transcript, or lesson note into a complete exam-style study session in seconds. PracticeForge is an independent study tool and is **not affiliated with IELTS, TOEFL, ETS, British Council, IDP, or Cambridge Assessment English**.

---

## Features

- 🎯 **Exam selector**: IELTS Academic or TOEFL iBT
- 🔍 **Skill focus**: Reading, Writing, Speaking, Vocabulary, or Full Practice
- 📝 **Generates**: Text summary, reading comprehension questions with answer key, academic vocabulary list with collocations, writing prompt, speaking prompt with follow-ups, and a 7-day micro study plan
- ✍️ **Writing feedback**: Paste your essay response and receive an estimated practice band range, 4-dimension feedback, improved rewrite, and 3 concrete next exercises
- 🤖 **Demo mode**: Works fully without any API key using realistic mock content
- 📱 **Responsive**: Works on mobile, tablet, and desktop

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom design tokens (dark mode)
- **AI**: OpenAI API (`gpt-4o-mini` for generation, `gpt-4o` for writing feedback)
- **Fonts**: Inter + DM Serif Display (Google Fonts)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key (optional — app works without it in demo mode):

```env
OPENAI_API_KEY=sk-...your-key-here...
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Optional | OpenAI API key. If not set, app uses realistic mock data. |
| `NEXT_PUBLIC_APP_URL` | Optional | App base URL (e.g. `http://localhost:3000`). For future use. |

> **Note**: Never commit `.env.local` to version control.

---

## Project Structure

```
practiceforge/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system + tokens
│   ├── api/
│   │   ├── generate/route.ts       # Practice generation endpoint
│   │   └── writing-feedback/route.ts  # Writing feedback endpoint
│   ├── practice/
│   │   ├── page.tsx                # Practice Generator page
│   │   └── writing-feedback/page.tsx  # Writing Feedback page
│   └── pricing/
│       └── page.tsx                # Pricing placeholder
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── ResultTabs.tsx
│   ├── WritingFeedbackCard.tsx
│   └── results/
│       ├── SummaryCard.tsx
│       ├── ReadingCard.tsx
│       ├── VocabularyCard.tsx
│       ├── WritingCard.tsx
│       └── StudyPlanCard.tsx
├── lib/
│   └── ai/
│       ├── generatePractice.ts     # AI provider abstraction
│       ├── prompts.ts              # Prompt builders
│       └── mockData.ts             # Realistic mock output
└── types/
    └── index.ts                    # All TypeScript types
```

---

## API Routes

### `POST /api/generate`

Generates a full practice session from the provided text.

**Body:**
```json
{
  "examType": "IELTS_ACADEMIC" | "TOEFL_IBT",
  "skillFocus": "Full" | "Reading" | "Writing" | "Speaking" | "Vocabulary",
  "inputText": "string (min 50 chars)",
  "level": "B1" | "B2" | "C1",
  "targetScore": "string (optional)",
  "examDate": "string (optional)",
  "weakArea": "string (optional)"
}
```

**Response:** `PracticeGenerationResult` (see `types/index.ts`)

---

### `POST /api/writing-feedback`

Analyses a student writing response.

**Body:**
```json
{
  "userAnswer": "string (min 50 words)",
  "writingPrompt": "string",
  "examType": "IELTS_ACADEMIC" | "TOEFL_IBT",
  "level": "B1" | "B2" | "C1"
}
```

**Response:** `WritingFeedbackResult` (see `types/index.ts`)

---

## MVP Scope

### ✅ Built
- Landing page with hero, demo preview, how-it-works, what-it-creates, personas, CTA, disclaimer
- Practice Generator: exam + skill + level selectors, text input, optional fields, generate button, loading state, tabbed results
- Results tabs: Summary, Reading (interactive Q&A), Vocabulary (expandable cards), Writing + Speaking prompts, Study Plan timeline
- Writing Feedback: prompt display, user textarea, analysis, 4-dimension feedback, improved version, next exercises
- Pricing page: 4 tiers (Free, Plus, Pro, Teacher) — UI only, no payment logic
- AI abstraction with OpenAI + mock fallback
- All TypeScript types and strict JSON schemas

### 🔜 Next Steps
1. **User auth**: Supabase auth for session persistence
2. **Database**: Save practice sessions and feedback with Supabase
3. **Streaming**: Stream AI responses for faster perceived performance
4. **AI providers**: Add Anthropic Claude or Gemini option
5. **Speaking feedback**: Audio recording + transcription (Whisper API)
6. **Progress tracking**: Dashboard with score history and vocabulary retention
7. **Payments**: Stripe integration for Plus/Pro/Teacher tiers
8. **Teacher dashboard**: Assign sessions to students, view progress
9. **Vocabulary spaced repetition**: Anki-style recall system
10. **Mobile app**: React Native or PWA with offline support

---

## Disclaimer

PracticeForge is an independent AI-powered study tool. It is **not affiliated with, endorsed by, or associated with** IELTS (IDP Education, British Council, or Cambridge Assessment English), TOEFL (Educational Testing Service / ETS), or any other official examination organisation. All practice content is AI-generated for self-study purposes only. Estimated practice scores are not official scores and must not be used for visa, university, or professional applications.
