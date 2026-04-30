"use client";

import { useState, useRef, useEffect } from "react";
import type { PracticeGenerationResult } from "@/types";

export default function SpeakingCard({ result }: { result: PracticeGenerationResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Exam Mode State
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [examComplete, setExamComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + " " + finalTranscript);
        }
      };
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
    setIsRecording(true);

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
    setIsRecording(false);
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
    <div className="card" style={{ padding: "2rem" }}>
      <div className="badge badge-accent" style={{ marginBottom: "1rem", display: "inline-flex" }}>
        Premium Speaking Agent 🎙️
      </div>
      
      <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
        Part 2: Long Turn
      </h3>
      
      <div style={{ background: "var(--surface)", padding: "1.5rem", borderLeft: "4px solid var(--brutal-yellow)", marginBottom: "2rem" }}>
        <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{result.speakingPrompt}</p>
        {result.speakingFollowUps.length > 0 && (
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem", color: "var(--foreground-muted)" }}>
            {result.speakingFollowUps.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {!recognitionRef.current && (
          <div style={{ color: "var(--rose)", fontWeight: 700 }}>
            ⚠️ Speech Recognition is not supported in this browser. Please use Chrome.
          </div>
        )}

        {examStarted && !examComplete && (
          <div style={{ fontSize: "2rem", fontWeight: 900, textAlign: "center", color: timeLeft <= 30 ? "var(--rose)" : "var(--foreground)" }}>
            ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}

        {!examStarted ? (
          <button 
            onClick={startExam} 
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", background: "var(--brutal-green)", color: "#000", padding: "1.5rem", fontSize: "1.25rem" }}
            disabled={!recognitionRef.current}
          >
            🎤 Start 2-Minute Speaking Exam
          </button>
        ) : (
          !examComplete && (
            <button 
              onClick={finishExam} 
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center", background: "var(--rose)", color: "#fff" }}
            >
              🛑 Finish Early
            </button>
          )
        )}

        {transcript && (
          <div style={{ padding: "1rem", border: "2px solid #000", background: "#fff", minHeight: "100px" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground-muted)", marginBottom: "0.5rem" }}>Live Transcript:</p>
            <p style={{ margin: 0 }}>{transcript}</p>
          </div>
        )}

        {examComplete && !feedback && (
          <button 
            onClick={analyzeSpeech} 
            className="btn-primary"
            style={{ background: "var(--brutal-yellow)", color: "#000", padding: "1rem" }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing with AI..." : "✨ Calculate Score (Gold Plan)"}
          </button>
        )}

        {feedback && (
          <div className="animate-scaleIn" style={{ padding: "1.5rem", background: "var(--surface)", border: "4px solid #000", boxShadow: "6px 6px 0px #000", marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 1rem", fontSize: "1.5rem", borderBottom: "2px solid #000", paddingBottom: "0.5rem" }}>AI Examiner Report</h4>
            <div style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "1.0625rem" }}>{feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
}
