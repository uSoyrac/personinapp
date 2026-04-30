"use client";
import { useEffect, useState } from "react";

export default function Confetti({ duration = 2000 }: { duration?: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; rot: number }[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const colors = ["#FF6F61", "#9B8FE4", "#00C9A7", "#FFB4A2", "#56CCF2", "#FFD700", "#FF4D6D"];
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -50 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rot: Math.random() * 360,
    }));
    setParticles(p);
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rot}deg)`,
            animation: `confettiFall ${1.5 + Math.random()}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
