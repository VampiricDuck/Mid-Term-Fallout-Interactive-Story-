// Simplified enemy dictionary for fast turn-based implementation.
// Intentionally removed: range bands, reload cycles, recharge gates, template AoE geometry.

export const ENEMIES = {
  // ---------------- ROBOTS ----------------
  mister_gutsy: {
    id: "mister_gutsy",
    name: "Mister Gutsy",
    group: "robot",
    ac: 13,
    dt: 2,
    hp: 72,
    ap: 12,
    stats: { str: 5, per: 6, end: 8, cha: 4, int: 6, agi: 7, luc: 4 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 12,
    loot: [{ id: "junk", quantity: 2 }, { id: "ammo_10mm", quantity: 2 }],
    actions: [
      { name: "10mm SMG Burst", apCost: 5, attacks: 3, toHit: 5, damage: "1d4+2 ballistic" },
      { name: "Flamer", apCost: 6, attacks: 1, toHit: 5, damage: "2d10+2 fire", effects: ["burn_1d10"] }
    ]
  },

  major_gutsy: {
    id: "major_gutsy",
    name: "Major Gutsy",
    group: "robot",
    ac: 13,
    dt: 2,
    hp: 152,
    ap: 12,
    stats: { str: 5, per: 7, end: 8, cha: 4, int: 6, agi: 7, luc: 4 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 22,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 3 }],
    actions: [
      { name: "Auto Laser Burst", apCost: 5, attacks: 3, toHit: 5, damage: "2d6+2 laser" },
      { name: "Flamer", apCost: 6, attacks: 1, toHit: 5, damage: "2d10+2 fire", effects: ["burn_1d10"] }
    ]
  },

  mister_handy: {
    id: "mister_handy",
    name: "Mister Handy",
    group: "robot",
    ac: 13,
    dt: 2,
    hp: 42,
    ap: 12,
    stats: { str: 5, per: 5, end: 6, cha: 7, int: 6, agi: 7, luc: 4 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 10,
    loot: [{ id: "junk", quantity: 2 }, { id: "ammo_10mm", quantity: 1 }],
    actions: [
      { name: "Buzzsaw", apCost: 4, attacks: 1, toHit: 3, damage: "1d10+2 slashing" },
      { name: "Flamer", apCost: 6, attacks: 1, toHit: 5, damage: "2d10+2 fire", effects: ["burn_1d10"] }
    ]
  },

  protectron: {
    id: "protectron",
    name: "Protectron",
    group: "robot",
    ac: 14,
    dt: 3,
    hp: 27,
    ap: 9,
    stats: { str: 8, per: 5, end: 9, cha: 4, int: 2, agi: 4, luc: 2 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 4,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Fist", apCost: 4, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning" },
      { name: "Laser", apCost: 5, attacks: 1, toHit: 2, damage: "2d6-1 laser" }
    ]
  },

  protectron_medic: {
    id: "protectron_medic",
    name: "Protectron Medic",
    group: "robot",
    ac: 14,
    dt: 3,
    hp: 54,
    ap: 9,
    stats: { str: 8, per: 5, end: 9, cha: 4, int: 2, agi: 4, luc: 2 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 7,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Defibrillator", apCost: 6, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning + 2d8 electricity" }
    ]
  },

  protectron_fire_brigadier: {
    id: "protectron_fire_brigadier",
    name: "Protectron Fire Brigadier",
    group: "robot",
    ac: 14,
    dt: 3,
    hp: 54,
    ap: 9,
    stats: { str: 8, per: 5, end: 9, cha: 4, int: 2, agi: 4, luc: 2 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 7,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Fist", apCost: 4, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning" },
      { name: "Cryo Spray", apCost: 6, attacks: 1, toHit: 5, damage: "1d10 cold", effects: ["stun_1"] }
    ]
  },

  protectron_utility: {
    id: "protectron_utility",
    name: "Protectron Utility",
    group: "robot",
    ac: 14,
    dt: 3,
    hp: 54,
    ap: 9,
    stats: { str: 8, per: 5, end: 9, cha: 4, int: 2, agi: 4, luc: 2 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 7,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Fist", apCost: 4, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning" },
      { name: "Nail Gun", apCost: 6, attacks: 1, toHit: 5, damage: "1d6-1 piercing" }
    ]
  },

  protectron_police: {
    id: "protectron_police",
    name: "Protectron Police",
    group: "robot",
    ac: 14,
    dt: 3,
    hp: 54,
    ap: 9,
    stats: { str: 8, per: 5, end: 9, cha: 4, int: 2, agi: 4, luc: 2 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 7,
    loot: [{ id: "junk", quantity: 2 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Fist", apCost: 4, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning" },
      { name: "Taser", apCost: 4, attacks: 1, toHit: 6, damage: "1d6+3 bludgeoning + 2d8 electricity", effects: ["stun_1"] }
    ]
  },

  sentry_bot: {
    id: "sentry_bot",
    name: "Sentry Bot",
    group: "robot",
    ac: 15,
    dt: 3,
    hp: 200,
    ap: 14,
    stats: { str: 9, per: 8, end: 10, cha: 3, int: 3, agi: 9, luc: 4 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 21,
    loot: [{ id: "fusion_core", quantity: 2 }, { id: "junk", quantity: 6 }],
    actions: [
      { name: "Double Chainguns", apCost: 5, attacks: 6, toHit: 7, damage: "1d6+4 ballistic" },
      { name: "Bash", apCost: 4, attacks: 1, toHit: 7, damage: "1d8+4 bludgeoning" }
    ]
  },

  robobrain: {
    id: "robobrain",
    name: "Robobrain",
    group: "robot",
    ac: 13,
    dt: 2,
    hp: 35,
    ap: 13,
    stats: { str: 8, per: 5, end: 7, cha: 6, int: 6, agi: 8, luc: 4 },
    immunities: { damage: ["poison"], conditions: ["irradiated", "poisoned"] },
    repairRate: 8,
    loot: [{ id: "junk", quantity: 4 }, { id: "energy_cell", quantity: 2 }],
    actions: [
      { name: "Tesla Rifle", apCost: 6, attacks: 1, toHit: 6, damage: "2d8+3 electricity", effects: ["chain_1"] },
      { name: "Mesmetron", apCost: 5, attacks: 1, toHit: 6, damage: "0", effects: ["incapacitate_1"] }
    ]
  },

  // ---------------- HUMANOIDS ----------------
  brotherhood_initiate: {
    id: "brotherhood_initiate",
    name: "Brotherhood Initiate",
    group: "humanoid",
    ac: 11,
    dt: 1,
    hp: 18,
    sp: 15,
    ap: 10,
    stats: { str: 5, per: 8, end: 6, cha: 4, int: 7, agi: 5, luc: 5 },
    healingRate: 6,
    loot: [
      { id: "leather_armor", quantity: 1 },
      { id: "police_baton", quantity: 1 },
      { id: "laser_pistol", quantity: 1 },
      { id: "energy_cell", quantity: 2 }
    ],
    actions: [
      { name: "Baton", apCost: 4, attacks: 1, toHit: 0, damage: "1d6 bludgeoning" },
      { name: "Laser Pistol", apCost: 5, attacks: 1, toHit: 5, damage: "1d8+3 laser" }
    ]
  },

  brotherhood_knight: {
    id: "brotherhood_knight",
    name: "Brotherhood Knight",
    group: "humanoid",
    ac: 12,
    dt: 1,
    hp: 36,
    sp: 36,
    ap: 11,
    stats: { str: 7, per: 9, end: 6, cha: 4, int: 7, agi: 6, luc: 5 },
    healingRate: 9,
    loot: [
      { id: "steel_armor", quantity: 1 },
      { id: "police_baton", quantity: 1 },
      { id: "laser_pistol", quantity: 1 },
      { id: "energy_cell", quantity: 3 },
      { id: "pulse_grenade", quantity: 1 }
    ],
    actions: [
      { name: "Baton", apCost: 4, attacks: 1, toHit: 4, damage: "1d6+2 bludgeoning" },
      { name: "Laser Rifle", apCost: 5, attacks: 1, toHit: 8, damage: "2d6+4 laser" },
      { name: "Pulse Grenade", apCost: 4, attacks: 1, toHit: 4, damage: "3d8 electricity", limits: { perEncounter: 1 } }
    ]
  },

  brotherhood_scribe: {
    id: "brotherhood_scribe",
    name: "Brotherhood Scribe",
    group: "humanoid",
    ac: 11,
    dt: 1,
    hp: 30,
    sp: 36,
    ap: 11,
    stats: { str: 5, per: 8, end: 5, cha: 5, int: 9, agi: 6, luc: 6 },
    healingRate: 8,
    loot: [
      { id: "cloth_armor", quantity: 1 },
      { id: "power_fist", quantity: 1 },
      { id: "plasma_pistol", quantity: 1 },
      { id: "microfusion_cell", quantity: 2 },
      { id: "stimpak", quantity: 2 },
      { id: "pulse_grenade", quantity: 1 }
    ],
    actions: [
      { name: "Power Fist", apCost: 4, attacks: 1, toHit: 4, damage: "4d6 bludgeoning", effects: ["knockback_15"] },
      { name: "Plasma Pistol", apCost: 6, attacks: 1, toHit: 5, damage: "2d8+3 plasma" },
      { name: "Stimpak", apCost: 5, attacks: 0, toHit: 0, damage: "0", effects: ["heal_self_or_ally"], limits: { perEncounter: 2 } }
    ]
  },

  brotherhood_paladin: {
    id: "brotherhood_paladin",
    name: "Brotherhood Paladin",
    group: "humanoid",
    ac: 17,
    dt: 8,
    hp: 60,
    sp: 70,
    ap: 12,
    stats: { str: 8, per: 9, end: 6, cha: 5, int: 8, agi: 7, luc: 6 },
    healingRate: 13,
    loot: [
      { id: "steel_armor", quantity: 1 },
      { id: "power_fist", quantity: 1 },
      { id: "gatling_laser", quantity: 1 },
      { id: "fusion_core", quantity: 3 },
      { id: "plasma_grenade", quantity: 2 },
      { id: "stimpak", quantity: 2 }
    ],
    actions: [
      { name: "Power Fist", apCost: 4, attacks: 1, toHit: 4, damage: "4d6+3 bludgeoning", effects: ["knockback_15"] },
      { name: "Gatling Laser", apCost: 6, attacks: 5, toHit: 8, damage: "2d10+4 laser" },
      { name: "Plasma Grenade", apCost: 4, attacks: 1, toHit: 4, damage: "6d8 plasma", limits: { perEncounter: 2 } },
      { name: "Auto-Inject Stimpak", apCost: 0, attacks: 0, toHit: 0, damage: "0", effects: ["heal_self"], limits: { perEncounter: 2, hpThreshold: 30 } }
    ]
  },

  civilian: {
    id: "civilian",
    name: "Civilian",
    group: "humanoid",
    ac: 10,
    dt: 0,
    hp: 5,
    sp: 5,
    ap: 10,
    stats: { str: 5, per: 5, end: 5, cha: 5, int: 5, agi: 5, luc: 5 },
    healingRate: 3,
    loot: [
      { id: "knife", quantity: 1 },
      { id: "pipe_pistol", quantity: 1 },
      { id: "ammo_9mm", quantity: 1 },
      { id: "cloth_armor", quantity: 1 }
    ],
    actions: [{ name: "Knife", apCost: 3, attacks: 1, toHit: 0, damage: "1d6 slashing" }]
  },

  doctor: {
    id: "doctor",
    name: "Doctor",
    group: "humanoid",
    ac: 10,
    dt: 0,
    hp: 10,
    sp: 10,
    ap: 10,
    stats: { str: 5, per: 7, end: 5, cha: 4, int: 7, agi: 5, luc: 5 },
    healingRate: 3,
    loot: [
      { id: "knife", quantity: 1 },
      { id: "cloth_armor", quantity: 1 },
      { id: "stimpak", quantity: 2 },
      { id: "healing_powder", quantity: 1 }
    ],
    actions: [
      { name: "Knife", apCost: 3, attacks: 1, toHit: 0, damage: "1d6 slashing" },
      { name: "Stimpak", apCost: 5, attacks: 0, toHit: 0, damage: "0", effects: ["heal_self_or_ally_plus1"], limits: { perEncounter: 2 } }
    ]
  },

  guard: {
    id: "guard",
    name: "Guard",
    group: "humanoid",
    ac: 11,
    dt: 1,
    hp: 24,
    sp: 21,
    ap: 12,
    stats: { str: 7, per: 6, end: 8, cha: 4, int: 4, agi: 7, luc: 5 },
    healingRate: 7,
    loot: [
      { id: "police_baton", quantity: 1 },
      { id: "pistol_10mm", quantity: 1 },
      { id: "ammo_10mm", quantity: 2 },
      { id: "combat_shotgun", quantity: 1 },
      { id: "ammo_12g", quantity: 1 },
      { id: "leather_armor", quantity: 1 }
    ],
    actions: [
      { name: "Baton", apCost: 4, attacks: 1, toHit: 4, damage: "1d6+2 bludgeoning" },
      { name: "10mm Pistol", apCost: 4, attacks: 1, toHit: 5, damage: "2d4+1 ballistic" },
      { name: "Hunting Shotgun", apCost: 6, attacks: 1, toHit: 5, damage: "3d6 ballistic" }
    ]
  },

  junkie: {
    id: "junkie",
    name: "Junkie",
    group: "humanoid",
    ac: 10,
    dt: 0,
    hp: 4,
    sp: 8,
    ap: 12,
    stats: { str: 5, per: 3, end: 4, cha: 3, int: 3, agi: 8, luc: 4 },
    healingRate: 3,
    loot: [
      { id: "shiv", quantity: 1 },
      { id: "pipe_pistol", quantity: 1 },
      { id: "ammo_9mm", quantity: 1 }
    ],
    actions: [
      { name: "Shiv", apCost: 3, attacks: 1, toHit: 0, damage: "1d4 piercing" }
    ]
  }
};

export const ENEMY_KEYS = Object.keys(ENEMIES);

export function getEnemyById(id) {
  return ENEMIES[id] ?? null;
}