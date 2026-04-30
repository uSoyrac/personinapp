/**
 * Gamification — XP, streaks, badges, levels
 */

const XP_KEY = "practiceforge_xp";
const STREAK_KEY = "practiceforge_streak";
const BADGES_KEY = "practiceforge_badges";

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastActive: string | null;
  badges: string[];
}

export const BADGE_DEFS: Record<string, { name: string; icon: string; desc: string }> = {
  first_quiz: { name: "First Steps", icon: "🎯", desc: "Complete your first quiz" },
  perfect_score: { name: "Perfect!", icon: "💎", desc: "Get 100% on a quiz" },
  words_20: { name: "Word Collector", icon: "📚", desc: "Save 20 words" },
  words_50: { name: "Vocabulary Pro", icon: "🏆", desc: "Save 50 words" },
  streak_3: { name: "On Fire", icon: "🔥", desc: "3-day streak" },
  streak_7: { name: "Dedicated", icon: "⚡", desc: "7-day streak" },
  set_complete: { name: "Set Master", icon: "🎓", desc: "Complete a 20-word set" },
  writing_first: { name: "Author", icon: "✍️", desc: "Submit your first essay" },
};

function getState(): GameState {
  if (typeof window === "undefined") return { xp: 0, level: 1, streak: 0, lastActive: null, badges: [] };
  try {
    const xp = parseInt(localStorage.getItem(XP_KEY) ?? "0", 10);
    const streakData = JSON.parse(localStorage.getItem(STREAK_KEY) ?? "{}");
    const badges = JSON.parse(localStorage.getItem(BADGES_KEY) ?? "[]");
    return {
      xp, level: Math.floor(xp / 100) + 1,
      streak: streakData.count ?? 0, lastActive: streakData.lastDate ?? null,
      badges,
    };
  } catch { return { xp: 0, level: 1, streak: 0, lastActive: null, badges: [] }; }
}

function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(XP_KEY, String(state.xp));
  localStorage.setItem(STREAK_KEY, JSON.stringify({ count: state.streak, lastDate: state.lastActive }));
  localStorage.setItem(BADGES_KEY, JSON.stringify(state.badges));
}

export function getGameState(): GameState {
  const state = getState();
  // Update streak
  const today = new Date().toISOString().split("T")[0];
  if (state.lastActive) {
    const last = new Date(state.lastActive);
    const diff = Math.floor((Date.now() - last.getTime()) / 86400000);
    if (diff > 1) state.streak = 0;
  }
  return { ...state, level: Math.floor(state.xp / 100) + 1 };
}

export function addXP(amount: number): { newXP: number; leveledUp: boolean; newBadges: string[] } {
  const state = getState();
  const oldLevel = Math.floor(state.xp / 100) + 1;
  state.xp += amount;
  const newLevel = Math.floor(state.xp / 100) + 1;

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  if (state.lastActive !== today) {
    if (state.lastActive) {
      const last = new Date(state.lastActive);
      const diff = Math.floor((Date.now() - last.getTime()) / 86400000);
      state.streak = diff <= 1 ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastActive = today;
  }

  const newBadges: string[] = [];
  if (state.streak >= 3 && !state.badges.includes("streak_3")) { state.badges.push("streak_3"); newBadges.push("streak_3"); }
  if (state.streak >= 7 && !state.badges.includes("streak_7")) { state.badges.push("streak_7"); newBadges.push("streak_7"); }

  state.level = newLevel;
  saveState(state);
  return { newXP: state.xp, leveledUp: newLevel > oldLevel, newBadges };
}

export function awardBadge(badgeId: string): boolean {
  const state = getState();
  if (state.badges.includes(badgeId)) return false;
  state.badges.push(badgeId);
  saveState(state);
  return true;
}

export function getXPForLevel(level: number): { current: number; needed: number } {
  const state = getState();
  const base = (level - 1) * 100;
  return { current: state.xp - base, needed: 100 };
}
