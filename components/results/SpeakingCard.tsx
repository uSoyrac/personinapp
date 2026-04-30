"use client";

import { useState, useRef, useEffect } from "react";
import type { PracticeGenerationResult } from "@/types";

export default function SpeakingCard({ result }: { result: PracticeGenerationResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API for zero-cost transcription
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
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setFeedback(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const analyzeSpeech = async () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis since we don't have the real endpoint yet.
    // In a real implementation, this would hit `/api/speaking-feedback`
    setTimeout(() => {
      setFeedback("Great effort! You spoke clearly and answered the prompt well. \n\n**Strengths:** Good fluency and confidence.\n\n**Improvements:** Try to use more advanced vocabulary. For example, instead of saying 'very good', you could use 'excellent' or 'outstanding'.");
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

        <button 
          onClick={toggleRecording} 
          className={isRecording ? "btn-secondary" : "btn-primary"}
          style={{ width: "100%", justifyContent: "center", background: isRecording ? "var(--rose)" : "var(--brutal-green)", color: "#000" }}
          disabled={!recognitionRef.current || isAnalyzing}
        >
          {isRecording ? "🛑 Stop Recording" : "🎤 Start Recording"}
        </button>

        {transcript && (
          <div style={{ padding: "1rem", border: "2px solid #000", background: "#fff", minHeight: "100px" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground-muted)", marginBottom: "0.5rem" }}>Live Transcript:</p>
            <p style={{ margin: 0 }}>{transcript}</p>
          </div>
        )}

        {transcript && !isRecording && !feedback && (
          <button 
            onClick={analyzeSpeech} 
            className="btn-primary"
            style={{ background: "var(--brutal-yellow)", color: "#000" }}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing with AI..." : "✨ Get AI Feedback (Gold Plan)"}
          </button>
        )}

        {feedback && (
          <div className="animate-scaleIn" style={{ padding: "1.5rem", background: "var(--mint-glow)", border: "2px solid var(--mint)", marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 0.5rem", color: "var(--mint-light)" }}>AI Feedback</h4>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
