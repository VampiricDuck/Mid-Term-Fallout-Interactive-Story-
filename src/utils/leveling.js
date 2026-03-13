export const SKILL_KEYS = [
  "barter",
  "breach",
  "crafting",
  "energyweapons",
  "explosives",
  "guns",
  "intimidation",
  "medicine",
  "melee",
  "science",
  "sneak",
  "speech",
  "survival",
  "unarmed"
];

export const STAT_KEYS = ["str", "per", "end", "cha", "int", "agi", "luc"];

const BACKGROUND_SKILL_BONUSES = {
  wastelander: {
    guns: 2,
    survival: 2,
    unarmed: 2
  }
};

const SKILL_POINT_LEVELS = new Set([5, 9, 13, 17, 21, 25, 29]);
const NO_PERK_LEVELS = new Set([5, 9, 13, 17, 19]);

export function createEmptySkillBonuses() {
  return Object.fromEntries(SKILL_KEYS.map((key) => [key, 0]));
}

export function xpRequiredForNextLevel(level = 1) {
  return Math.max(1, level) * 1000;
}

export function totalXpRequiredForLevel(level = 1) {
  if (level <= 1) return 0;
  return ((level - 1) * level * 1000) / 2;
}

export function canLevelUp(player = {}) {
  const level = player.level ?? 1;
  const xp = player.xp ?? 0;
  return xp >= totalXpRequiredForLevel(level + 1);
}

export function getSkillPointAward(intScore = 5) {
  if (intScore <= 4) return 3;
  if (intScore >= 6) return 5;
  return 4;
}

export function getTotalSkillPointsEarned(level = 1, intScore = 5) {
  let total = 0;
  for (let lv = 1; lv <= level; lv += 1) {
    if (SKILL_POINT_LEVELS.has(lv)) {
      total += getSkillPointAward(intScore);
    }
  }
  return total;
}

export function getTotalPerkPointsEarned(level = 1) {
  let total = 0;
  for (let lv = 2; lv <= level; lv += 1) {
    if (!NO_PERK_LEVELS.has(lv)) total += 1;
  }
  return total;
}

function getGrowthSteps(level = 1) {
  return Math.max(0, Math.floor((level - 1) / 2));
}

function sumSkillBonuses(skillBonuses = {}) {
  return SKILL_KEYS.reduce((sum, key) => sum + (skillBonuses[key] ?? 0), 0);
}

export function recalculatePlayerStats(player = {}) {
  const p = structuredClone(player ?? {});

  // FIX: define next before using it
  const next = {
    level: 1,
    xp: 0,
    str: 5,
    per: 5,
    end: 5,
    cha: 5,
    int: 5,
    agi: 5,
    luc: 5,
    perkPointsSpent: 0,
    karmaCapsFlipped: 0,
    background: "wastelander",
    ...p
  };

  next.skillBonuses = {
    ...createEmptySkillBonuses(),
    ...(next.skillBonuses ?? {})
  };

  next.strmod = next.str - 5;
  next.permod = next.per - 5;
  next.endmod = next.end - 5;
  next.chamod = next.cha - 5;
  next.intmod = next.int - 5;
  next.agimod = next.agi - 5;
  next.lucmod = next.luc - 5;

  const growthSteps = getGrowthSteps(next.level);

  next.hp = 10 + next.endmod + growthSteps * (5 + next.endmod);
  next.sp = 10 + next.agimod + growthSteps * (5 + next.agimod);
  next.ap = next.agimod + 10;
  next.hr = (next.level + next.end) / 2;
  next.ac = 10;
  next.luckbs = Math.floor(next.lucmod / 2);

  next.barter = next.chamod + next.luckbs;
  next.breach = Math.max(next.permod, next.chamod) + next.luckbs;
  next.crafting = next.intmod + next.luckbs;
  next.energyweapons = next.permod + next.luckbs;
  next.explosives = next.permod + next.luckbs;
  next.guns = next.agimod + next.luckbs;
  next.intimidation = Math.max(next.strmod, next.chamod) + next.luckbs;
  next.medicine = Math.max(next.permod, next.intmod) + next.luckbs;
  next.melee = next.strmod + next.luckbs;
  next.science = next.intmod + next.luckbs;
  next.sneak = next.agimod + next.luckbs;
  next.speech = next.chamod + next.luckbs;
  next.survival = next.endmod + next.luckbs;
  next.unarmed = next.strmod + next.luckbs;

  const bg = BACKGROUND_SKILL_BONUSES[next.background] ?? {};
  next.guns += bg.guns ?? 0;
  next.survival += bg.survival ?? 0;
  next.unarmed += bg.unarmed ?? 0;

  for (const key of SKILL_KEYS) {
    next[key] += next.skillBonuses[key] ?? 0;
  }

  next.critRequirement = Math.max(
    2,
    Math.min(20, 20 - Math.floor((next.lucmod ?? 0) / 2))
  );

  next.karmaCapsMax = next.luc >= 10 ? 2 : 1;
  next.karmaCapsFlipped = Math.max(
    0,
    Math.min(next.karmaCapsFlipped ?? 0, next.karmaCapsMax)
  );
  next.karmaCapsAvailable = next.karmaCapsMax - next.karmaCapsFlipped;

  next.totalSkillPointsEarned = getTotalSkillPointsEarned(next.level, next.int);
  next.unspentSkillPoints = Math.max(
    0,
    next.totalSkillPointsEarned - sumSkillBonuses(next.skillBonuses)
  );

  next.totalPerkPointsEarned = getTotalPerkPointsEarned(next.level);
  next.unspentPerkPoints = Math.max(
    0,
    next.totalPerkPointsEarned - (next.perkPointsSpent ?? 0)
  );

  next.xpToNextLevel = xpRequiredForNextLevel(next.level);
  next.nextLevelTotalXp = totalXpRequiredForLevel(next.level + 1);
  next.canLevelUp = canLevelUp(next);

  return next;
}

export function levelUpPlayer(player = {}) {
  const current = recalculatePlayerStats(player);
  if (!current.canLevelUp) return current;
  return recalculatePlayerStats({
    ...current,
    level: current.level + 1
  });
}

export function spendSkillPoint(player = {}, skillKey) {
  const current = recalculatePlayerStats(player);
  if (!SKILL_KEYS.includes(skillKey)) return current;
  if ((current.unspentSkillPoints ?? 0) <= 0) return current;

  return recalculatePlayerStats({
    ...current,
    skillBonuses: {
      ...current.skillBonuses,
      [skillKey]: (current.skillBonuses?.[skillKey] ?? 0) + 1
    }
  });
}

export function spendPerkPointOnStat(player = {}, statKey) {
  const current = recalculatePlayerStats(player);
  if (!STAT_KEYS.includes(statKey)) return current;
  if ((current.unspentPerkPoints ?? 0) <= 0) return current;
  if ((current[statKey] ?? 0) >= 10) return current;

  return recalculatePlayerStats({
    ...current,
    [statKey]: (current[statKey] ?? 0) + 1,
    perkPointsSpent: (current.perkPointsSpent ?? 0) + 1
  });
}