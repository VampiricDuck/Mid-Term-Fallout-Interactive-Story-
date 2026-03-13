export const XP_DIFFICULTY_KIND = Object.freeze({
  easy: Object.freeze({
    encounter: 40,
    dungeon: 80,
    quest: 100
  }),
  average: Object.freeze({
    encounter: 80,
    dungeon: 150,
    quest: 200
  }),
  difficult: Object.freeze({
    encounter: 150,
    dungeon: 300,
    quest: 400
  })
});

function norm(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getXpReward(difficulty, kind) {
  const d = norm(difficulty);
  const k = norm(kind);
  return XP_DIFFICULTY_KIND[d]?.[k] ?? 0;
}

// Design guidance from your rules text
export function canUseEasyForLevel(level) {
  return Number(level ?? 1) > 6;
}