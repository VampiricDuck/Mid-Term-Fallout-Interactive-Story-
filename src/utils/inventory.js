import { ITEMS } from "../data/items.js";

const JUNK_IDS = ["junk_scrap", "junk", "scrap_metal"]; // first match is used

export function ensureInventoryModel(player = {}) {
  return {
    ...player,
    equipment: Array.isArray(player.equipment) ? player.equipment : [],
    loadout: player.loadout ?? { armorId: null }
  };
}

function getInvQty(entry) {
  return Number(entry?.quantity ?? entry?.qty ?? entry?.count ?? 0);
}

function setInvQty(entry, nextQty) {
  const q = Math.max(0, Number(nextQty) || 0);
  if ("quantity" in (entry ?? {})) return { ...entry, quantity: q };
  if ("qty" in (entry ?? {})) return { ...entry, qty: q };
  if ("count" in (entry ?? {})) return { ...entry, count: q };
  return { ...entry, quantity: q };
}

function toNum(v, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function readQty(entry) {
  return toNum(entry?.quantity ?? entry?.qty ?? entry?.count ?? 0, 0);
}

function writeQty(entry, qty) {
  const q = Math.max(0, toNum(qty, 0));
  if ("quantity" in (entry ?? {})) return { ...entry, quantity: q };
  if ("qty" in (entry ?? {})) return { ...entry, qty: q };
  if ("count" in (entry ?? {})) return { ...entry, count: q };
  return { ...entry, quantity: q };
}

function findInvIndex(player, itemId) {
  const inv = Array.isArray(player?.inventory) ? player.inventory : [];
  return inv.findIndex((it) => (it?.id ?? it?.itemId) === itemId);
}

function ensureDecayMap(player) {
  if (!player.itemDecay || typeof player.itemDecay !== "object") player.itemDecay = {};
}

export function useConsumable(player, itemId) {
  const p = structuredClone(player ?? {});
  if (!Array.isArray(p.inventory)) p.inventory = [];

  const idx = p.inventory.findIndex((it) => (it?.id ?? it?.itemId) === itemId);
  if (idx < 0) return { player: p, msg: "Item not found." };

  const invEntry = p.inventory[idx];
  const qty = getInvQty(invEntry);
  if (qty <= 0) return { player: p, msg: "No remaining quantity." };

  const template = ITEMS[itemId];
  if (!template || template.type !== "consumable") {
    return { player: p, msg: "That item is not usable." };
  }

  const hpGain = Number(template.HPrestor ?? template.hpRestore ?? 0) || 0;
  const spGain = Number(template.SPrestor ?? template.spRestore ?? 0) || 0;

  // Adjust these max fields if your project uses different names
  const hpMax = Number(p.hpMax ?? p.maxHp ?? p.hp ?? 0);
  const spMax = Number(p.spMax ?? p.maxSp ?? p.sp ?? 0);

  p.hp = Math.min(hpMax, Number(p.hp ?? 0) + hpGain);
  p.sp = Math.min(spMax, Number(p.sp ?? 0) + spGain);

  const remaining = qty - 1;
  if (remaining <= 0) {
    p.inventory.splice(idx, 1);
  } else {
    p.inventory[idx] = setInvQty(invEntry, remaining);
  }

  return { player: p, msg: `Used ${template.name}.` };
}

export function equipArmor(player, itemId) {
  const p = ensureInventoryModel(player);
  const armor = p.equipment.find(
    (i) => String(i.id) === String(itemId) && i.type === "armor" && (i.amount ?? 0) > 0
  );
  if (!armor) return { player: p, ok: false, msg: ">> Armor not found." };

  return {
    player: { ...p, loadout: { ...p.loadout, armorId: String(itemId) } },
    ok: true,
    msg: `>> Equipped ${armor.name}.`
  };
}

function getEquippedArmorAC(player) {
  const armorId = player?.loadout?.armorId ?? null;
  if (!armorId) return 10; // base AC when no armor equipped
  const armor = (player.equipment ?? []).find(
    (i) => String(i.id) === String(armorId) && i.type === "armor" && (i.amount ?? 0) > 0
  );
  return Number(armor?.AC ?? 10);
}

export function toggleArmorEquip(player, armorId) {
  const p = structuredClone(player ?? {});
  if (!p.loadout) p.loadout = {};

  const currentlyEquipped = p.loadout.armorId ?? null;

  if (currentlyEquipped === armorId) {
    p.loadout.armorId = null;
    return { player: p, msg: "Armor unequipped." };
  }

  p.loadout.armorId = armorId;
  return { player: p, msg: "Armor equipped." };
}

export function getCombatWeapons(player) {
  const p = ensureInventoryModel(player);
  return p.equipment.filter(
    (i) => (i.type ?? "").includes("weapon") && (i.amount ?? 0) > 0
  );
}

export function addLootToInventory(player, lootItems) {
  const p = {
    ...player,
    equipment: Array.isArray(player?.equipment) ? [...player.equipment] : []
  };

  for (const drop of lootItems) {
    const stackable = !!drop.stackable;
    if (stackable) {
      const idx = p.equipment.findIndex((e) => String(e.id) === String(drop.id));
      if (idx >= 0) {
        p.equipment[idx] = {
          ...p.equipment[idx],
          amount: (p.equipment[idx].amount ?? 0) + (drop.amount ?? 0)
        };
      } else {
        p.equipment.push({ ...drop, id: drop.id });  // ensure id is preserved
      }
    } else {
      const copies = Math.max(1, drop.amount ?? 1);
      for (let i = 0; i < copies; i++) {
        p.equipment.push({ ...drop, amount: 1, id: drop.id });  // ensure id is preserved
      }
    }
  }

  return p;
}

export function getItemDecay(player, itemId) {
  const d = toNum(player?.itemDecay?.[itemId], 0);
  return Math.max(0, Math.min(10, d));
}

export function getJunkIdInInventory(player) {
  for (const id of JUNK_IDS) {
    if (findInvIndex(player, id) >= 0) return id;
  }
  return null;
}

export function getItemCount(player, itemId) {
  const idx = findInvIndex(player, itemId);
  if (idx < 0) return 0;
  return readQty(player.inventory[idx]);
}

/**
 * Repairs 1 decay level from itemId by consuming 1 junk item.
 * Returns { ok, reason?, player }.
 */
export function repairItemDecayWithJunk(playerIn, itemId) {
  const player = structuredClone(playerIn ?? {});
  if (!itemId) return { ok: false, reason: "invalid_item", player };

  ensureDecayMap(player);
  const currentDecay = getItemDecay(player, itemId);
  if (currentDecay <= 0) return { ok: false, reason: "no_decay", player };

  const junkId = getJunkIdInInventory(player);
  if (!junkId) return { ok: false, reason: "no_junk", player };

  const junkIdx = findInvIndex(player, junkId);
  const junkEntry = player.inventory[junkIdx];
  const junkQty = readQty(junkEntry);
  if (junkQty <= 0) return { ok: false, reason: "no_junk", player };

  const nextDecay = Math.max(0, currentDecay - 1);
  player.itemDecay[itemId] = nextDecay;

  const nextJunk = junkQty - 1;
  if (nextJunk <= 0) player.inventory.splice(junkIdx, 1);
  else player.inventory[junkIdx] = writeQty(junkEntry, nextJunk);

  return { ok: true, player, itemId, decay: nextDecay, junkUsed: junkId };
}