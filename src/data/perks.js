export const PERKS = {
  // --- Intelligence ---
  nerd_rage: {
    id: "nerd_rage",
    name: "Nerd Rage!",
    category: "intelligence",
    maxRanks: 1,
    requirements: { int: 7 },
    description: "While below half hit points, your DT increases by 2.",
    effects: [{ type: "conditional_modifier", stat: "DT", value: 2, when: "hp_below_half" }]
  },

  robotic_expert: {
    id: "robotic_expert",
    name: "Robotic Expert",
    category: "intelligence",
    maxRanks: 1,
    requirements: { int: 8 },
    description: "Ignore 2 DT when damaging robots.",
    effects: [{ type: "conditional_modifier", stat: "ignoreDT", value: 2, againstTags: ["robot"] }]
  },

  // --- Agility ---
  action_hero: {
    id: "action_hero",
    name: "Action Hero",
    category: "agility",
    maxRanks: 1,
    requirements: { agi: 4 },
    description: "Your AP maximum increases by 2 (to a max of 15).",
    effects: [{ type: "modifier", stat: "apMax", value: 2, max: 15 }]
  },

  the_dance: {
    id: "the_dance",
    name: "The Dance",
    category: "agility",
    maxRanks: 1,
    requirements: { agi: 5 },
    description: "Bladed melee weapons may use Agility modifier for damage.",
    effects: [{ type: "passive_flag", key: "bladed_melee_can_use_agi_for_damage", value: true }]
  },

  efficient_speedster: {
    id: "efficient_speedster",
    name: "Efficient Speedster",
    category: "agility",
    maxRanks: 1,
    requirements: { agi: 9 },
    description: "You recycle all unused AP at the start of your turn.",
    effects: [{ type: "passive_flag", key: "recycle_all_unused_ap", value: true }]
  },

  // --- Luck (simple) ---
  scrounger: {
    id: "scrounger",
    name: "Scrounger",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 4 },
    description: "Roll twice on loot Luck checks and keep the better result.",
    effects: [{ type: "passive_flag", key: "advantage_on_loot_luck_checks", value: true }]
  },

  big_crits: {
    id: "big_crits",
    name: "Big Crits",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 4 },
    description: "Natural 20 critical damage is doubled.",
    effects: [{ type: "passive_flag", key: "double_crit_damage_on_nat20", value: true }]
  },

  bloody_mess: {
    id: "bloody_mess",
    name: "Bloody Mess",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 5 },
    description: "Weapon attacks deal +2 damage.",
    effects: [{ type: "conditional_modifier", stat: "damage", value: 2, attackKinds: ["weapon"] }]
  },

  fortune_finder: {
    id: "fortune_finder",
    name: "Fortune Finder",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 5 },
    description: "Gain 800 caps immediately. Find extra caps equal to Luck modifier.",
    effects: [
      { type: "grant_caps_once", value: 800 },
      { type: "modifier", stat: "extraCapsFound", valueSource: "lucmod" }
    ]
  },

  make_it_double: {
    id: "make_it_double",
    name: "Make it Double",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 5 },
    description: "Gain +1 maximum Karma Cap.",
    effects: [{ type: "modifier", stat: "karmaCapsMax", value: 1 }]
  },

  outrageous_advantage: {
    id: "outrageous_advantage",
    name: "Outrageous Advantage",
    category: "luck",
    maxRanks: 1,
    requirements: { luc: 10 },
    description: "When you have advantage, roll 3d20 instead of 2d20.",
    effects: [{ type: "modifier", stat: "advantageDice", value: 3 }]
  }
};

export const PERK_KEYS = Object.keys(PERKS);

export function getPerkRank(player, perkId) {
  const perks = player?.perks ?? {};
  return Number(perks[perkId] ?? 0);
}

export function meetsPerkRequirements(player, perk) {
  if (!perk?.requirements) return true;
  const req = perk.requirements;

  if (req.str && (player?.str ?? 0) < req.str) return false;
  if (req.per && (player?.per ?? 0) < req.per) return false;
  if (req.end && (player?.end ?? 0) < req.end) return false;
  if (req.cha && (player?.cha ?? 0) < req.cha) return false;
  if (req.int && (player?.int ?? 0) < req.int) return false;
  if (req.agi && (player?.agi ?? 0) < req.agi) return false;
  if (req.luc && (player?.luc ?? 0) < req.luc) return false;
  if (Array.isArray(req.raceIn) && !req.raceIn.includes(player?.race)) return false;

  return true;
}

export function canTakePerk(player, perkId) {
  const perk = PERKS[perkId];
  if (!perk) return false;
  const rank = getPerkRank(player, perkId);
  if (rank >= (perk.maxRanks ?? 1)) return false;
  return meetsPerkRequirements(player, perk);
}

export function listAvailablePerks(player) {
  return PERK_KEYS
    .filter((perkId) => canTakePerk(player, perkId))
    .map((perkId) => PERKS[perkId]);
}