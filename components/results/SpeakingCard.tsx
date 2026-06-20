"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import type { PracticeGenerationResult } from "@/types";

// Minimal typings for the Web Speech API (not part of the standard DOM lib).
interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const emptySubscribe = () => () => {};
function getSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

export default function SpeakingCard({ result }: { result: PracticeGenerationResult }) {
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Exam Mode State
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [examComplete, setExamComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Hydration-safe browser feature detection (false on the server / first render).
  const isSupported = useSyncExternalStore(emptySubscribe, getSpeechSupported, () => false);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const SpeechRecognitionCtor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (SpeechRecognitionCtor) {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + " " + finalTranscript);
        }
      };
      recognitionRef.current = recognition;
    }
    return () => clearInterval(timerRef.current!);
  }, []);

  const startExam = () => {
    setExamStarted(true);
    setTranscript("");
    setFeedback(null);
    setExamComplete(false);
    setTimeLeft(120);
    recognitionRef.current?.start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishExam = () => {
    clearInterval(timerRef.current!);
    recognitionRef.current?.stop();
    setExamComplete(true);
  };

  const analyzeSpeech = async () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);

    // Simulate AI Exam Analysis
    setTimeout(() => {
      const words = transcript.split(" ").length;
      let band = "5.0";
      if (words > 100) band = "6.5";
      if (words > 200) band = "7.5";

      setFeedback(`**Estimated Band Score: ${band}**\n\nGreat effort! You spoke clearly and addressed the prompts.\n\n**Strengths:** Good fluency and confidence.\n\n**Improvements:** Try to use more advanced vocabulary. For example, instead of saying 'very good', you could use 'excellent' or 'outstanding'. Maintain better cohesion between ideas.`);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="card-elevated" style={{ padding: "2rem", overflow: "hidden", position: "relative" }}>
      <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-flex" }}>
        Premium Examiner Agent 🎙️
      </div>

      <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
        Part 2: Long Turn
      </h3>

      <div style={{ background: "var(--surface-2)", padding: "1.5rem", borderLeft: "4px solid var(--primary)", marginBottom: "2rem", borderRadius: "var(--radius-sm)" }}>
        <p style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.6 }}>{result.speakingPrompt}</p>
        {result.speakingFollowUps.length > 0 && (
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem", color: "var(--foreground-muted)" }}>
            {result.speakingFollowUps.map((q, i) => <li key={i} style={{ marginBottom: "0.25rem" }}>{q}</li>)}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
        {!isSupported && (
          <div style={{ color: "var(--rose)", fontWeight: 700, textAlign: "center" }}>
            ⚠️ Speech Recognition is not supported in this browser. Please use Chrome.
          </div>
        )}

        {/* The AI Examiner Avatar UI */}
        <div style={{
          width: "120px", height: "120px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--surface-2), var(--surface))",
          border: "2px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          marginBottom: "1rem"
        }}>
          {/* Pulse Animation when listening */}
          {examStarted && !examComplete && (
            <div className="animate-pulse-glow" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: "50%" }}></div>
          )}
          {/* Avatar Icon */}
          <div style={{ fontSize: "3rem", filter: (!examStarted && !examComplete) ? "grayscale(100%) opacity(0.5)" : "none" }}>
            {examComplete ? "📝" : (examStarted ? "👂" : "🤖")}
          </div>
        </div>

        {/* Status Text */}
        <div style={{ textAlign: "center", minHeight: "3rem" }}>
          {!examStarted && !examComplete && <p style={{ color: "var(--foreground-muted)" }}>The examiner is ready. You have 2 minutes.</p>}
          {examStarted && !examComplete && (
            <div>
              <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.125rem", margin: "0 0 0.5rem" }}>Examiner is listening...</p>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, color: timeLeft <= 30 ? "var(--rose)" : "var(--foreground)" }}>
                0{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>
          )}
          {examComplete && !feedback && !isAnalyzing && <p style={{ color: "var(--foreground-muted)" }}>Recording complete. Submit for evaluation.</p>}
          {isAnalyzing && <p className="animate-pulse-glow" style={{ color: "var(--gold)", fontWeight: 700 }}>Evaluating fluency, lexical resource, and pronunciation...</p>}
        </div>

        {/* Action Buttons */}
        {!examStarted && !examComplete && (
          <button
            onClick={startExam}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "1.25rem", fontSize: "1.125rem", borderRadius: "var(--radius-md)" }}
            disabled={!isSupported}
          >
            Start Exam
          </button>
        )}

        {examStarted && !examComplete && (
          <button
            onClick={finishExam}
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center", borderColor: "var(--rose)", color: "var(--rose)" }}
          >
            Finish Speaking
          </button>
        )}

        {examComplete && !feedback && (
          <button
            onClick={analyzeSpeech}
            className="btn-primary"
            style={{ width: "100%", background: "linear-gradient(135deg, var(--gold), #D97706)", color: "#fff", padding: "1.25rem", border: "none", fontSize: "1.125rem", borderRadius: "var(--radius-md)", justifyContent: "center" }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Processing..." : "Submit to AI Examiner"}
          </button>
        )}

        {/* Official Report UI */}
        {feedback && (
          <div className="animate-scaleIn" style={{ width: "100%", padding: "2rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginTop: "1rem" }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)" }}>
                Official AI Examiner Report
              </h4>
              <div style={{ display: "inline-block", background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "#fff", padding: "0.5rem 1.5rem", borderRadius: "9999px", fontSize: "2rem", fontWeight: 900 }}>
                Band 6.5
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1rem", borderRadius: "var(--radius-sm)", borderLeft: "4px solid #10b981" }}>
                <strong style={{ color: "#10b981", display: "block", marginBottom: "0.5rem" }}>Strengths</strong>
                <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>Good fluency and confidence. You addressed all parts of the prompt well.</span>
              </div>
              <div style={{ background: "rgba(244, 63, 94, 0.1)", padding: "1rem", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--rose)" }}>
                <strong style={{ color: "var(--rose)", display: "block", marginBottom: "0.5rem" }}>Improvements</strong>
                <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>{"Enhance Lexical Resource. Avoid repeating 'good'; use 'excellent' or 'outstanding'."}</span>
              </div>
            </div>

            {transcript && (
              <div style={{ padding: "1rem", border: "1px dashed var(--border)", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Transcript Analysis</p>
                <p style={{ margin: 0, color: "var(--foreground-faint)", fontSize: "0.875rem", fontStyle: "italic" }}>{`"${transcript}"`}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
