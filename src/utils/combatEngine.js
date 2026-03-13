import { ENEMIES, ENEMY_KEYS } from "../data/enemies.js";
import { ITEMS } from "../data/items.js";
import { getXpReward } from "../data/xp.js";
import { recalculatePlayerStats } from "./leveling.js";
import { getPerkRank } from "../data/perks.js";

const WEAPON_TYPES = new Set([
  "melee weapon",
  "unarmed weapon",
  "mechanical weapon",
  "ranged weapon",
  "big gun",
  "energy weapon",
  "thrown explosive"
]);
const MAX_LOG_LINES = 12;

const n = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;
const rollD20 = () => rollDie(20);
const signText = (v) => `${n(v, 0) >= 0 ? "+" : "-"}${Math.abs(n(v, 0))}`;

function pushLog(state, msg) {
  state.log.push(msg);
  if (state.log.length > MAX_LOG_LINES) state.log = state.log.slice(-MAX_LOG_LINES);
}

function weightedDifficulty() {
  const r = Math.random() * 100;
  if (r < 15) return "easy";
  if (r < 95) return "average";
  return "difficult";
}

function vitalsOf(entity) {
  return Math.max(0, n(entity?.hp, 0)) + Math.max(0, n(entity?.sp, 0));
}

function parseDamage(expr) {
  if (!expr) return 0;
  const s = String(expr);
  let total = 0;

  for (const m of s.matchAll(/(\d+)d(\d+)/gi)) {
    const count = n(m[1], 0);
    const sides = n(m[2], 0);
    for (let i = 0; i < count; i++) total += rollDie(sides);
  }
  for (const m of s.matchAll(/([+-]\d+)/g)) total += n(m[1], 0);

  if (!/d/i.test(s) && !/[+-]\d+/.test(s)) {
    const solo = s.match(/-?\d+/);
    if (solo) total += n(solo[0], 0);
  }

  return Math.max(0, Math.floor(total));
}

function parseCrit(critText) {
  // Supports:
  // "20, x2" (multiplier) and "20, 1d6" (bonus crit dice)
  const s = String(critText ?? "").toLowerCase();
  if (!s || s === "-") return { threshold: 21, multiplier: 1, bonusExpr: null };

  let threshold = 20;
  let multiplier = 1;
  let bonusExpr = null;

  const th = s.match(/\b(1?\d|20)\b/);
  if (th) threshold = n(th[1], 20);

  const mx = s.match(/x\s*(\d+)/i);
  if (mx) multiplier = Math.max(2, n(mx[1], 2));

  const dice = s.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?)/i);
  if (dice) bonusExpr = dice[1].replace(/\s+/g, "");

  return { threshold: clamp(threshold, 2, 20), multiplier, bonusExpr };
}

function perk(player, id) {
  try {
    return n(getPerkRank(player, id), 0) > 0;
  } catch {
    return false;
  }
}

function perkRank(player, id) {
  try {
    return n(getPerkRank(player, id), 0);
  } catch {
    return 0;
  }
}

function hasPerk(player, id) {
  return perkRank(player, id) > 0;
}

function normalizeInvEntry(raw) {
  if (typeof raw === "string") return { id: raw, quantity: 1 };
  return {
    ...raw,
    id: raw?.id ?? raw?.itemId ?? raw?.key ?? "",
    quantity: n(raw?.quantity ?? raw?.qty ?? raw?.count ?? 1, 1)
  };
}

function setInvQty(entry, qty) {
  const q = Math.max(0, n(qty, 0));
  if ("quantity" in (entry ?? {})) return { ...entry, quantity: q };
  if ("qty" in (entry ?? {})) return { ...entry, qty: q };
  if ("count" in (entry ?? {})) return { ...entry, count: q };
  return { ...entry, quantity: q };
}

function consumeItem(player, itemId, amount = 1) {
  const p = structuredClone(player ?? {});
  if (!Array.isArray(p.inventory)) p.inventory = [];
  const idx = p.inventory.findIndex((it) => (it?.id ?? it?.itemId) === itemId);
  if (idx < 0) return { ok: false, player: p };

  const e = p.inventory[idx];
  const qty = n(e?.quantity ?? e?.qty ?? e?.count ?? 0, 0);
  if (qty < amount) return { ok: false, player: p };

  const next = qty - amount;
  if (next <= 0) p.inventory.splice(idx, 1);
  else p.inventory[idx] = setInvQty(e, next);

  return { ok: true, player: p };
}

function addItem(player, itemId, amount = 1) {
  const p = structuredClone(player ?? {});
  if (!Array.isArray(p.inventory)) p.inventory = [];
  const idx = p.inventory.findIndex((it) => (it?.id ?? it?.itemId) === itemId);

  if (idx >= 0) {
    const e = p.inventory[idx];
    const qty = n(e?.quantity ?? e?.qty ?? e?.count ?? 0, 0);
    p.inventory[idx] = setInvQty(e, qty + amount);
  } else {
    p.inventory.push({ id: itemId, quantity: amount });
  }

  return p;
}

function getPlayerWeapons(player) {
  const inv = Array.isArray(player?.inventory) ? player.inventory : [];
  return inv
    .map(normalizeInvEntry)
    .filter((e) => e.id && e.quantity > 0 && WEAPON_TYPES.has(String(ITEMS[e.id]?.type ?? "").toLowerCase()))
    .map((e) => {
      const decay = getDecay(player, e.id);
      return { ...e, template: ITEMS[e.id], decay, broken: decay >= 10 };
    });
}

function getConsumables(player) {
  const inv = Array.isArray(player?.inventory) ? player.inventory : [];
  return inv
    .map(normalizeInvEntry)
    .filter((e) => e.id && e.quantity > 0 && String(ITEMS[e.id]?.type ?? "").toLowerCase() === "consumable")
    .map((e) => ({ ...e, template: ITEMS[e.id] }));
}

function chooseEnemyForDifficulty(playerVitals, difficulty) {
  const ratioTarget = difficulty === "easy" ? 0.75 : difficulty === "difficult" ? 1.35 : 1.0;
  const target = playerVitals * ratioTarget;

  const candidates = ENEMY_KEYS.map((k) => ENEMIES[k])
    .filter(Boolean)
    .map((e) => ({ e, score: Math.abs(vitalsOf(e) - target) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);

  return candidates[Math.floor(Math.random() * candidates.length)]?.e ?? ENEMIES[ENEMY_KEYS[0]];
}

function applyDamage(target, rawDamage, dtIgnore = 0) {
  const dt = Math.max(0, n(target.dt, 0) - Math.max(0, dtIgnore));
  const dmg = Math.max(0, Math.floor(rawDamage) - dt);

  const spHit = Math.min(n(target.sp, 0), dmg);
  target.sp = Math.max(0, n(target.sp, 0) - spHit);

  const hpHit = Math.max(0, dmg - spHit);
  target.hp = Math.max(0, n(target.hp, 0) - hpHit);

  return { dmg, spHit, hpHit };
}

function playerToHitMod(player, weapon) {
  const t = String(weapon?.type ?? "").toLowerCase();
  if (t === "ranged weapon" || t === "mechanical weapon") return n(player.guns, 0);
  if (t === "unarmed weapon") return n(player.unarmed, 0);
  return n(player.melee, 0);
}

function getEquippedArmorDefense(player) {
  const armorId = player?.loadout?.armorId ?? null;
  const armor = armorId ? ITEMS[armorId] : null;
  if (!armor) return { hasArmor: false, ac: null, dt: null };

  const armorDecay = getDecay(player, armorId);
  if (armorDecay >= 10) {
    // Broken armor gives no armor benefits.
    return { hasArmor: false, ac: null, dt: null, broken: true, decay: armorDecay };
  }

  const penalty = Math.floor(armorDecay / 2);

  const rawAc = n(
    armor?.armorClass ?? armor?.ac ?? armor?.AC ?? armor?.acBonus ?? armor?.armorClassBonus,
    10
  );
  const rawDt = n(
    armor?.damageThreshold ?? armor?.dt ?? armor?.DT ?? armor?.dtBonus,
    0
  );

  return {
    hasArmor: true,
    ac: Math.max(10, rawAc - penalty),
    dt: Math.max(0, rawDt - penalty),
    broken: false,
    decay: armorDecay
  };
}

function makeEnemyCombatant(enemy) {
  return {
    ...structuredClone(enemy),
    hpMax: n(enemy.hp, 1),
    spMax: n(enemy.sp, 0),
    hp: n(enemy.hp, 1),
    sp: n(enemy.sp, 0),
    apMax: n(enemy.ap, 10),
    ap: n(enemy.ap, 10),
    dt: n(enemy.dt, 0)
  };
}

function makePlayerCombatant(playerIn) {
  const p = recalculatePlayerStats(structuredClone(playerIn ?? {}));
  const armor = getEquippedArmorDefense(p);

  const baseAc = n(p.ac, 10);
  const baseDt = n(p.dt ?? p.DT ?? 0, 0) + n(p.toughness, 0);
  const apBase = n(p.ap, 10);
  const apMax = perk(p, "action_hero") ? Math.min(15, apBase + 2) : apBase;
  const danceRank = perkRank(p, "the_dance"); // FIX

  return {
    ...p,
    itemDecay: structuredClone(playerIn?.itemDecay ?? p.itemDecay ?? {}),
    hpMax: n(p.hpMax ?? p.hp, 1),
    spMax: n(p.spMax ?? p.sp, 0),
    hp: n(p.hp, 1),
    sp: n(p.sp, 0),
    apMax,
    ap: apMax,
    ac: (armor.hasArmor ? armor.ac : baseAc) + danceRank,
    dt: armor.hasArmor ? armor.dt : baseDt,
    agimod: n(p.agimod, 0),
    lucmod: n(p.lucmod, 0)
  };
}

function isEnemyHealAction(action) {
  const effects = Array.isArray(action?.effects) ? action.effects : [];
  return effects.includes("heal_self") || effects.includes("heal_self_or_ally") || effects.includes("heal_self_or_ally_plus1");
}

function canEnemyUseAction(state, action) {
  const limit = n(action?.limits?.perEncounter, 0);
  if (!limit) return true;
  return n(state.enemyUses?.[action.name], 0) < limit;
}

function markEnemyActionUsed(state, action) {
  const limit = n(action?.limits?.perEncounter, 0);
  if (!limit) return;
  if (!state.enemyUses) state.enemyUses = {};
  state.enemyUses[action.name] = n(state.enemyUses[action.name], 0) + 1;
}

function rollLoot(enemy, lucmod, player = null) {
  const table = Array.isArray(enemy?.loot) ? enemy.loot.filter((x) => ITEMS[x?.id]) : [];
  if (!table.length) return [];

  const scrounger = perkRank(player, "scrounger");

  let picks = Math.random() < 0.35 + Math.max(0, lucmod) * 0.05 ? 2 : 1;
  picks += scrounger > 0 ? 1 : 0; // extra loot roll from Scrounger

  const out = [];
  const used = new Set();
  for (let i = 0; i < picks; i++) {
    const pool = table.filter((x) => !used.has(x.id));
    if (!pool.length) break;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    used.add(pick.id);

    let qty = Math.max(1, Math.floor(Math.random() * Math.max(1, n(pick.quantity, 1))) + 1);

    // Scrounger: extra quantity for ammo/junk-like items
    const id = String(pick.id ?? "").toLowerCase();
    if (scrounger > 0 && (id.includes("ammo") || id.includes("junk") || id.includes("scrap"))) {
      qty += scrounger;
    }

    out.push({ id: pick.id, quantity: qty });
  }

  return out;
}

function normText(s) {
  return String(s ?? "").toLowerCase().replace(/[_-]/g, " ").trim();
}

function getWeaponProps(weapon) {
  const arr = Array.isArray(weapon?.properties) ? weapon.properties : [];
  return arr.map(normText);
}

function hasProp(props, token) {
  const t = normText(token);
  return props.some((p) => p === t || p.includes(t));
}

function perkRankAny(player, ids) {
  return Math.max(...ids.map((id) => n(getPerkRank(player, id), 0)), 0);
}

function isRangedWeapon(weapon) {
  const t = normText(weapon?.type);
  return t === "ranged weapon" || t === "mechanical weapon";
}
function isMeleeWeapon(weapon) {
  const t = normText(weapon?.type);
  return t === "melee weapon" || t === "unarmed weapon";
}
function isUnarmedWeapon(weapon) {
  return normText(weapon?.type) === "unarmed weapon";
}

function getCombatModifiers(player, weapon, enemy) {
  const props = getWeaponProps(weapon);

  let toHit = 0;
  let flatDamage = 0;
  let dtIgnore = 0;
  let apDelta = 0;
  let critThresholdDelta = 0;
  let critMultDelta = 0;
  let extraAmmoPerShot = 0;
  let critFailDecayOn = 1;

  if (hasProp(props, "accurate")) toHit += 1;
  if (hasProp(props, "inaccurate")) toHit -= 1;
  if (hasProp(props, "heavy")) apDelta += 1;
  if (hasProp(props, "light")) apDelta -= 1;
  if (hasProp(props, "piercing") || hasProp(props, "armor piercing")) dtIgnore += 2;
  if (hasProp(props, "vicious") || hasProp(props, "brutal")) flatDamage += 2;
  if (hasProp(props, "deadly")) critThresholdDelta -= 1;
  if (hasProp(props, "high crit")) critMultDelta += 1;
  if (hasProp(props, "automatic")) extraAmmoPerShot += 1;
  if (hasProp(props, "unreliable") || hasProp(props, "fragile")) critFailDecayOn = 2;

  const bloodyMess = perkRankAny(player, ["bloody_mess"]);
  flatDamage += bloodyMess * 2;

  const betterCrits = perkRankAny(player, ["better_criticals"]);
  if (betterCrits > 0) critMultDelta += 1;

  const gunslinger = perkRankAny(player, ["gunslinger"]);
  const commando = perkRankAny(player, ["commando"]);
  const slugger = perkRankAny(player, ["slugger", "big_leagues"]);
  const ironFist = perkRankAny(player, ["iron_fist", "ironfist"]);

  if (isRangedWeapon(weapon)) {
    toHit += gunslinger + commando;
    flatDamage += gunslinger + commando;
  }
  if (isMeleeWeapon(weapon)) {
    toHit += slugger;
    flatDamage += slugger;
  }
  if (isUnarmedWeapon(weapon)) {
    toHit += ironFist;
    flatDamage += ironFist * 2;
  }

  const roboticExpert = perkRankAny(player, ["robotic_expert"]);
  if (roboticExpert > 0 && normText(enemy?.group) === "robot") dtIgnore += 2;

  return {
    toHit,
    flatDamage,
    dtIgnore,
    apDelta,
    critThresholdDelta,
    critMultDelta,
    extraAmmoPerShot,
    critFailDecayOn
  };
}

export function createCombatEncounter(player) {
  const p = makePlayerCombatant(player);
  const difficulty = weightedDifficulty();
  const enemy = makeEnemyCombatant(chooseEnemyForDifficulty(vitalsOf(p), difficulty));
  const playerName = String(p?.name ?? "Wanderer");

  return {
    difficulty,
    kind: "encounter",
    player: p,
    playerName, // added
    enemy,
    turn: "player",
    ended: false,
    outcome: null,
    xpAwarded: 0,
    lootAwarded: [],
    enemyUses: {},
    log: [
      `>> ${playerName} enters combat.`,
      `>> Encounter difficulty: ${difficulty.toUpperCase()}`,
      `>> Enemy: ${enemy.name} (HP ${enemy.hp}/${enemy.hpMax}, SP ${enemy.sp}/${enemy.spMax}, AC ${enemy.ac})`
    ]
  };
}

export function syncCombatPlayerDefense(state, latestPlayer) {
  if (!state?.player) return;

  const merged = {
    ...structuredClone(latestPlayer ?? {}),
    itemDecay: structuredClone(state.player.itemDecay ?? latestPlayer?.itemDecay ?? {})
  };

  const p = recalculatePlayerStats(merged);
  const armor = getEquippedArmorDefense(p);
  const danceRank = perkRank(p, "the_dance"); // keep consistent with combatant build

  state.player.itemDecay = structuredClone(merged.itemDecay ?? {});
  state.player.ac = (armor.hasArmor ? armor.ac : n(p.ac, state.player.ac ?? 10)) + danceRank;
  state.player.dt = armor.hasArmor ? armor.dt : n(p.dt ?? p.DT, state.player.dt ?? 0);
}

export function getPlayerWeaponsForCombat(state) {
  return getPlayerWeapons(state?.player ?? {});
}

export function getPlayerConsumablesForCombat(state) {
  return getConsumables(state?.player ?? {});
}

export function playerAttack(state, weaponId) {
  if (state?.ended || state?.turn !== "player") return;
  const weapon = ITEMS[weaponId];
  if (!weapon || !WEAPON_TYPES.has(String(weapon.type ?? "").toLowerCase())) return;

  const weaponDecay = getDecay(state.player, weaponId);
  if (weaponDecay >= 10) {
    pushLog(state, `>> ${weapon.name ?? weaponId} is broken and cannot be used.`);
    return;
  }

  const mods = getCombatModifiers(state.player, weapon, state.enemy);

  const apCost = Math.max(1, n(weapon.AP, 4) + mods.apDelta);
  if (state.player.ap < apCost) return pushLog(state, ">> Not enough AP.");

  const ammoId = parseAmmoItemId(weapon);
  if (ammoId) {
    const ammoUse = 1 + Math.max(0, mods.extraAmmoPerShot);
    const c = consumeItem(state.player, ammoId, ammoUse);
    if (!c.ok) return pushLog(state, `>> Out of ammo (${ammoId}).`);
    state.player = c.player;
  }

  state.player.ap -= apCost;

  const d20 = rollD20();

  // critical fail -> decay
  if (d20 <= mods.critFailDecayOn) {
    const dec = addDecay(state.player, weaponId, 1);
    pushLog(state, `>> Critical fail with ${weapon.name ?? weaponId}. Decay ${dec.next}/10. Attack misses.`);
    return;
  }

  const skillMod = playerToHitMod(state.player, weapon);
  const decayPenalty = getDecay(state.player, weaponId);
  const totalMod = skillMod + mods.toHit - decayPenalty;
  const total = d20 + totalMod;
  const targetAC = n(state.enemy.ac, 10);

  if (total < targetAC) {
    pushLog(state, `>> You attack with ${weapon.name ?? weaponId}. Roll ${d20} ${signText(totalMod)} = ${total} vs AC ${targetAC}. Miss.`);
    return;
  }

  let dmg = parseDamage(weapon.damage ?? "1d4") + mods.flatDamage;

  const critMeta = parseCrit(weapon.CriticalHit ?? weapon.criticalHit ?? "20, x2");
  let isCrit = false;
  if (d20 >= critMeta.threshold) {
    isCrit = true;

    if (critMeta.multiplier > 1) dmg *= critMeta.multiplier;
    if (critMeta.bonusExpr) dmg += parseDamage(critMeta.bonusExpr);

    if (d20 === 20 && perk(state.player, "big_crits")) dmg *= 2;
  }

  const dealt = applyDamage(state.enemy, dmg, mods.dtIgnore);

  pushLog(
    state,
    `>> You attack with ${weapon.name ?? weaponId}. Roll ${d20} ${signText(totalMod)} = ${total} vs AC ${targetAC}. Hit for ${dealt.dmg} (${dealt.spHit} SP, ${dealt.hpHit} HP)${isCrit ? " [CRIT]" : ""}.`
  );

  if (state.enemy.hp <= 0) {
    state.ended = true;
    state.outcome = "victory";
    state.xpAwarded = getXpReward(state.difficulty, "encounter");
    state.lootAwarded = rollLoot(state.enemy, n(state.player.lucmod, 0), state.player);

    pushLog(state, `>> ${state.enemy.name} defeated. +${state.xpAwarded} XP`);
  }
}

export function playerUseConsumableInCombat(state, itemId) {
  if (state?.ended || state?.turn !== "player") return;
  const item = ITEMS[itemId];
  if (!item || String(item.type ?? "").toLowerCase() !== "consumable") return;

  const apCost = 5;
  if (state.player.ap < apCost) return pushLog(state, ">> Not enough AP.");

  const c = consumeItem(state.player, itemId, 1);
  if (!c.ok) return pushLog(state, ">> Item not available.");

  state.player = c.player;
  state.player.ap -= apCost;

  const hpGain = n(item.HPrestor ?? item.hpRestore, 0);
  const spGain = n(item.SPrestor ?? item.spRestore, 0);

  state.player.hp = Math.min(state.player.hpMax, state.player.hp + hpGain);
  state.player.sp = Math.min(state.player.spMax, state.player.sp + spGain);

  pushLog(state, `>> Used ${item.name ?? itemId}. (+${hpGain} HP, +${spGain} SP)`);
}

export function playerTryFlee(state) {
  if (state?.ended || state?.turn !== "player") return;
  if (state.player.ap < 2) return pushLog(state, ">> Not enough AP to flee.");
  state.player.ap -= 2;

  const d20 = rollD20();
  const mod = n(state.player.agimod, 0);
  const total = d20 + mod;
  const success = total >= 10; // DC 10

  if (success) {
    state.ended = true;
    state.outcome = "fled";
    state.xpAwarded = Math.floor(getXpReward(state.difficulty, "encounter") / 2);
    return pushLog(state, `>> Flee success. Roll ${d20} ${signText(mod)} = ${total}. +${state.xpAwarded} XP`);
  }

  state.player.ap = 0; // skip rest of turn
  pushLog(state, `>> Flee failed. Roll ${d20} ${signText(mod)} = ${total}. Turn lost.`);
}

export function endPlayerTurn(state) {
  if (!state?.ended) state.turn = "enemy";
}

export function runEnemyTurn(state) {
  if (state?.ended) return;

  state.turn = "enemy";
  state.enemy.ap = state.enemy.apMax;

  const pity = Math.random() < 0.2;
  const budget = pity ? Math.max(1, Math.floor(state.enemy.apMax / 2)) : state.enemy.apMax;
  let spent = 0;
  if (pity) pushLog(state, ">> Enemy hesitates and uses less AP.");

  const actions = Array.isArray(state.enemy.actions) ? state.enemy.actions : [];
  let safety = 0;

  while (!state.ended && spent < budget && safety < 20) {
    safety += 1;
    const available = actions.filter((a) => {
      if (n(a.apCost, 99) > budget - spent) return false;
      if (!canEnemyUseAction(state, a)) return false;
      if (isEnemyHealAction(a) && state.enemy.hp >= state.enemy.hpMax) return false;
      return true;
    });
    if (!available.length) break;

    const healChoices = available.filter(isEnemyHealAction);
    const chosen =
      healChoices.length && state.enemy.hp <= Math.floor(state.enemy.hpMax * 0.6)
        ? healChoices[0]
        : available[Math.floor(Math.random() * available.length)];

    const cost = Math.max(1, n(chosen.apCost, 4));
    state.enemy.ap -= cost;
    spent += cost;
    markEnemyActionUsed(state, chosen);

    if (isEnemyHealAction(chosen)) {
      const healBonus = (chosen.effects ?? []).includes("heal_self_or_ally_plus1") ? 1 : 0;
      const heal = Math.max(1, n(state.enemy.healingRate, 0) + healBonus);
      const before = state.enemy.hp;
      state.enemy.hp = Math.min(state.enemy.hpMax, state.enemy.hp + heal);
      pushLog(state, `>> ${state.enemy.name} uses ${chosen.name} and heals ${state.enemy.hp - before} HP.`);
      continue;
    }

    const attacks = Math.max(1, n(chosen.attacks, 1));
    for (let i = 0; i < attacks; i++) {
      if (state.ended) break;

      const d20 = rollD20();
      const mod = n(chosen.toHit, 0);
      const total = d20 + mod;
      const playerAC = n(state.player.ac, 10);

      if (total < playerAC) {
        pushLog(state, `>> ${state.enemy.name} uses ${chosen.name}. Roll ${d20} ${signText(mod)} = ${total} vs AC ${playerAC}. Miss.`);
        continue;
      }

      let dmg = parseDamage(chosen.damage ?? "1d4");
      const isCrit = d20 === 20;
      if (isCrit) dmg *= 2;

      let dtIgnore = 0;
      let tempPlayer = state.player;

      // Nerd Rage: conditional DT boost at <= half HP
      if (hasPerk(state.player, "nerd_rage") && n(state.player.hp, 0) <= Math.floor(n(state.player.hpMax, 1) / 2)) {
        tempPlayer = { ...state.player, dt: n(state.player.dt, 0) + 2 };
      }

      const dealt = applyDamage(tempPlayer, dmg, dtIgnore);
      state.player.hp = tempPlayer.hp;
      state.player.sp = tempPlayer.sp;

      pushLog(state, `>> ${state.enemy.name} uses ${chosen.name}. Roll ${d20} ${signText(mod)} = ${total} vs AC ${playerAC}. Hit for ${dealt.dmg} (${dealt.spHit} SP, ${dealt.hpHit} HP).`);

      // Armor decay on crit if wearing armor.
      const armorId = state.player?.loadout?.armorId;
      if (isCrit && armorId) {
        const dec = addDecay(state.player, armorId, 1);
        pushLog(state, `>> Your armor gains decay (${dec.next}/10).`);
        // refresh AC/DT immediately
        syncCombatPlayerDefense(state, state.player);
      }

      if (state.player.hp <= 0) {
        // Armor decay when dropped to 0 HP.
        if (armorId) {
          const dec = addDecay(state.player, armorId, 1);
          pushLog(state, `>> Your armor gains decay (${dec.next}/10) from being downed.`);
          syncCombatPlayerDefense(state, state.player);
        }
        state.ended = true;
        state.outcome = "defeat";
        state.xpAwarded = 0;
        pushLog(state, ">> You were defeated.");
        break;
      }
    }
  }

  if (!state.ended) {
    state.turn = "player";

    if (hasPerk(state.player, "efficient_speedster")) {
      const carry = Math.max(0, n(state.player.ap, 0));
      state.player.ap = Math.min(15, n(state.player.apMax, 10) + carry);
      pushLog(state, ">> AP recycled (Efficient Speedster).");
    } else {
      state.player.ap = state.player.apMax;
      pushLog(state, ">> AP restored.");
    }
  }

  return state;
}

export function applyCombatResultToPlayer(basePlayer, state) {
  let p = structuredClone(basePlayer ?? {});
  p.hp = Math.max(0, n(state?.player?.hp, p.hp ?? 1));

  const refreshed = recalculatePlayerStats({ ...p, hp: p.hp });
  p.sp = n(refreshed.sp, p.sp ?? 0);
  p.xp = Math.max(0, n(p.xp, 0) + n(state?.xpAwarded, 0));

  // Persist decay
  p.itemDecay = structuredClone(state?.player?.itemDecay ?? p.itemDecay ?? {});

  if (state?.outcome === "victory") {
    for (const drop of state.lootAwarded ?? []) {
      p = addItem(p, drop.id, n(drop.quantity, 1));
    }
  }

  return p;
}

function ensureDecayMap(entity) {
  if (!entity.itemDecay || typeof entity.itemDecay !== "object") entity.itemDecay = {};
}

function getDecay(entity, itemId) {
  ensureDecayMap(entity);
  return clamp(n(entity.itemDecay[itemId], 0), 0, 10);
}

function addDecay(entity, itemId, amount = 1) {
  ensureDecayMap(entity);
  const before = getDecay(entity, itemId);
  const next = clamp(before + Math.max(1, n(amount, 1)), 0, 10);
  entity.itemDecay[itemId] = next;
  return { before, next, brokeNow: before < 10 && next >= 10 };
}

function parseAmmoItemId(weapon) {
  // Supports both legacy Ammo field and your items.js `ammo: "10mm, 12 rounds"`
  if (weapon?.Ammo) return String(weapon.Ammo);

  const raw = String(weapon?.ammo ?? "").toLowerCase();
  if (!raw) return null;

  if (raw.includes("9mm")) return "ammo_9mm";
  if (raw.includes("10mm")) return "ammo_10mm";
  if (raw.includes(".357")) return "ammo_357";
  if (raw.includes("5.56")) return "ammo_556";
  if (raw.includes("5mm")) return "ammo_5mm";
  if (raw.includes(".308")) return "ammo_308";
  if (raw.includes("12 gauge")) return "ammo_12g";
  if (raw.includes("fuel")) return "fuel";
  if (raw.includes("missile")) return "missile";
  if (raw.includes("microfusion")) return "microfusion_cell";
  if (raw.includes("energy cell")) return "energy_cell";
  if (raw.includes("2mm ec")) return "ammo_2mm_ec";
  if (raw.includes("cryo cell")) return "cryo_cell";
  if (raw.includes("fusion core")) return "fusion_core";

  return null;
}