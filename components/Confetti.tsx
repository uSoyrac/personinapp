"use client";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rot: number;
  round: boolean;
  fall: number;
  delay: number;
};

export default function Confetti({ duration = 2000 }: { duration?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const colors = ["#FF6F61", "#9B8FE4", "#00C9A7", "#FFB4A2", "#56CCF2", "#FFD700", "#FF4D6D"];
    // All random values are computed here (after mount) and stored on each
    // particle so that rendering stays pure — calling Math.random() during
    // render would be impure and could cause SSR/hydration mismatches.
    const p: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -50 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rot: Math.random() * 360,
      round: Math.random() > 0.5,
      fall: 1.5 + Math.random(),
      delay: Math.random() * 0.5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- particles depend on Math.random(), which must run on the client after mount to stay hydration-safe
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
            borderRadius: p.round ? "50%" : "2px",
            transform: `rotate(${p.rot}deg)`,
            animation: `confettiFall ${p.fall}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
