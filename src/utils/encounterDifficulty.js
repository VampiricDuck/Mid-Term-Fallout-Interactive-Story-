import { ENEMIES } from "../data/enemies.js";
import { recalculatePlayerStats } from "./leveling.js";

/**
 * Rules:
 * - Easy: encounter total HP+SP is well below expected player vitals for that level
 * - Average: close to expected player vitals
 * - Difficult: well above expected player vitals
 * - Easy is discouraged for player level <= 6
 */

function toNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function expectedVitalsAtLevel(level) {
  const p = recalculatePlayerStats({ level: Math.max(1, toNum(level, 1)) });
  const hp = Math.max(1, toNum(p.hp, 1));
  const sp = Math.max(0, toNum(p.sp, 0));
  return hp + sp;
}

function enemyVitals(enemy) {
  if (!enemy) return 0;
  const hp = Math.max(0, toNum(enemy.hp, 0));
  const sp = Math.max(0, toNum(enemy.sp, 0));
  return hp + sp;
}

function resolveEnemy(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return ENEMIES[entry] ?? null;
  if (entry.id && ENEMIES[entry.id]) return ENEMIES[entry.id];
  return entry; // already an enemy-like object
}

export function getEncounterVitalsTotal(encounter = []) {
  const list = Array.isArray(encounter) ? encounter : [encounter];
  return list.reduce((sum, e) => sum + enemyVitals(resolveEnemy(e)), 0);
}

export function determineEncounterDifficulty(playerLevel, encounter = []) {
  const playerLvl = Math.max(1, toNum(playerLevel, 1));
  const baseline = expectedVitalsAtLevel(playerLvl);
  const encounterTotal = getEncounterVitalsTotal(encounter);

  // ratio < 1 means weaker than baseline; > 1 means stronger
  const ratio = baseline > 0 ? encounterTotal / baseline : 1;

  // Tunable thresholds
  let difficulty = "average";
  if (ratio <= 0.75) difficulty = playerLvl <= 6 ? "average" : "easy";
  else if (ratio >= 1.35) difficulty = "difficult";

  return {
    difficulty,            // "easy" | "average" | "difficult"
    ratio,                 // encounter / expected
    expectedPlayerVitals: baseline,
    encounterVitals: encounterTotal
  };
}