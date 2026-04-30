import { getGameState } from "./gamification";
import { getNativeLanguage } from "./translations";

export type Timeframe = "weekly" | "monthly" | "allTime";
export type Region = "worldwide" | "national";

export interface LeaderboardUser {
  id: string;
  name: string;
  country: string;
  avatarColor: string;
  xpWeekly: number;
  xpMonthly: number;
  xpAllTime: number;
  isCurrentUser?: boolean;
}

const STORAGE_KEY = "practiceforge_mock_leaderboard";

const FIRST_NAMES = ["Alex", "Sarah", "Mehmet", "Elena", "Carlos", "Yuki", "Ahmet", "Sofia", "Luca", "Maria", "Can", "Zeynep", "David", "Emma", "John", "Ayşe", "Luis", "Chen"];
const LAST_INITIALS = ["A.", "B.", "C.", "D.", "K.", "M.", "S.", "Y.", "Z."];
const COUNTRIES = ["tr", "us", "es", "fr", "de", "it", "br"];
const COLORS = ["#FFE200", "#D4FF00", "#FFA8E4", "#A45EE5", "#8CE0FF", "#FF9CEE", "#34C759", "#FF3B30"];

function generateMockUsers(): LeaderboardUser[] {
  const users: LeaderboardUser[] = [];
  for (let i = 0; i < 200; i++) {
    const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)]}`;
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const avatarColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Generate realistic layered XP
    const xpWeekly = Math.floor(Math.random() * 2000) + 100;
    const xpMonthly = xpWeekly + Math.floor(Math.random() * 5000);
    const xpAllTime = xpMonthly + Math.floor(Math.random() * 20000);

    users.push({ id: `mock_${i}`, name, country, avatarColor, xpWeekly, xpMonthly, xpAllTime });
  }
  return users;
}

function getStoredMockUsers(): LeaderboardUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    
    const generated = generateMockUsers();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
    return generated;
  } catch {
    return [];
  }
}

export function getLeaderboard(timeframe: Timeframe, region: Region): LeaderboardUser[] {
  const users = getStoredMockUsers();
  const gameState = getGameState();
  const nativeLang = getNativeLanguage() ?? "us";
  
  // Base current user
  const currentUser: LeaderboardUser = {
    id: "current_user",
    name: "You",
    country: nativeLang,
    avatarColor: "#000",
    xpWeekly: gameState.xp, // In a real app, we'd track timeframe specific XP. Using total XP for MVP.
    xpMonthly: gameState.xp,
    xpAllTime: gameState.xp,
    isCurrentUser: true,
  };

  let pool = [...users, currentUser];

  // Filter by region
  if (region === "national") {
    pool = pool.filter(u => u.country === currentUser.country);
  }

  // Sort
  pool.sort((a, b) => {
    if (timeframe === "weekly") return b.xpWeekly - a.xpWeekly;
    if (timeframe === "monthly") return b.xpMonthly - a.xpMonthly;
    return b.xpAllTime - a.xpAllTime;
  });

  return pool;
}
