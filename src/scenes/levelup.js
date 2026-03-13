import { listAvailablePerks, canTakePerk } from "../data/perks.js";
import {
  SKILL_KEYS,
  canLevelUp,
  levelUpPlayer,
  recalculatePlayerStats,
  spendSkillPoint
} from "../utils/leveling.js";

const SKILL_LABELS = {
  barter: "Barter",
  breach: "Breach",
  crafting: "Crafting",
  energyweapons: "Energy Weapons",
  explosives: "Explosives",
  guns: "Guns",
  intimidation: "Intimidation",
  medicine: "Medicine",
  melee: "Melee",
  science: "Science",
  sneak: "Sneak",
  speech: "Speech",
  survival: "Survival",
  unarmed: "Unarmed"
};

const HIDDEN_PERKS = new Set([
  "on_the_go_mechanic",
  "quick_draw",
  "old_world_gourmet"
]);

function formatReq(req = {}) {
  const parts = [];
  if (req.str) parts.push(`STR ${req.str}`);
  if (req.per) parts.push(`PER ${req.per}`);
  if (req.end) parts.push(`END ${req.end}`);
  if (req.cha) parts.push(`CHA ${req.cha}`);
  if (req.int) parts.push(`INT ${req.int}`);
  if (req.agi) parts.push(`AGI ${req.agi}`);
  if (req.luc) parts.push(`LUC ${req.luc}`);
  if (Array.isArray(req.raceIn)) parts.push(`Race: ${req.raceIn.join(", ")}`);
  return parts.join(" | ") || "None";
}

function applyPendingLevelUps(player) {
  let p = recalculatePlayerStats(structuredClone(player ?? {}));
  let safety = 0;
  while (canLevelUp(p) && safety < 50) {
    p = levelUpPlayer(p);
    p = recalculatePlayerStats(p);
    safety += 1;
  }
  return p;
}

export function renderLevelUp(root, api) {
  const statePlayer = api.getState().player ?? {};
  const leveledPlayer = applyPendingLevelUps(statePlayer);

  // Only patch if auto-leveling actually changed anything
  const changed =
    (leveledPlayer.level ?? 1) !== (statePlayer.level ?? 1) ||
    (leveledPlayer.unspentSkillPoints ?? 0) !== (statePlayer.unspentSkillPoints ?? 0) ||
    (leveledPlayer.unspentPerkPoints ?? 0) !== (statePlayer.unspentPerkPoints ?? 0) ||
    (leveledPlayer.hp ?? 0) !== (statePlayer.hp ?? 0) ||
    (leveledPlayer.sp ?? 0) !== (statePlayer.sp ?? 0) ||
    (leveledPlayer.ap ?? 0) !== (statePlayer.ap ?? 0);

  if (changed) {
    api.patchPlayer(leveledPlayer);
    return; // prevent render-loop stack growth
  }

  let player = leveledPlayer;
  if (!player.perks) player.perks = {};

  root.innerHTML = `
    <section class="scene scene-levelup">
      <h1>Level Up</h1>
      <div id="levelupSummary"></div>
      <div class="actions">
        <button id="levelupContinueBtn">[ CONTINUE ]</button>
      </div>
      <hr />
      <h2>Perk Points</h2>
      <div id="perkInfo"></div>
      <div id="perkList"></div>
      <hr />
      <h2>Skill Points</h2>
      <div id="skillInfo"></div>
      <div id="skillButtons"></div>
    </section>
  `;

  const summary = root.querySelector("#levelupSummary");
  const perkInfo = root.querySelector("#perkInfo");
  const perkList = root.querySelector("#perkList");
  const skillInfo = root.querySelector("#skillInfo");
  const skillButtons = root.querySelector("#skillButtons");
  const continueBtn = root.querySelector("#levelupContinueBtn");

  function takePerk(perkId) {
    player = recalculatePlayerStats(player);
    if ((player.unspentPerkPoints ?? 0) <= 0) return;
    if (!canTakePerk(player, perkId)) return;

    player = recalculatePlayerStats({
      ...player,
      perks: {
        ...(player.perks ?? {}),
        [perkId]: (player.perks?.[perkId] ?? 0) + 1
      },
      perkPointsSpent: (player.perkPointsSpent ?? 0) + 1
    });

    api.patchPlayer(player);
    paint();
  }

  function paint() {
    player = recalculatePlayerStats(player);

    summary.innerHTML = `
      <p>> Level: ${player.level}</p>
      <p>> XP: ${player.xp}</p>
      <p>> HP: ${player.hp}</p>
      <p>> SP: ${player.sp}</p>
      <p>> AP: ${player.ap}</p>
    `;

    const availablePerks = listAvailablePerks(player)
      .filter((perk) => !HIDDEN_PERKS.has(perk.id));

    perkInfo.innerHTML = `
      <p>> Unspent Perk Points: ${player.unspentPerkPoints ?? 0}</p>
      <p>> Available Perks: ${availablePerks.length}</p>
    `;

    if (!availablePerks.length) {
      perkList.innerHTML = `<p>> No perks currently available.</p>`;
    } else {
      perkList.innerHTML = availablePerks.map((perk) => `
        <button data-perk="${perk.id}" ${(player.unspentPerkPoints ?? 0) <= 0 ? "disabled" : ""}>[ ${perk.name} ]</button>
        <p>> Req: ${formatReq(perk.requirements)}<br>> ${perk.description}</p>
      `).join("");
    }

    perkList.querySelectorAll("[data-perk]").forEach((btn) => {
      btn.addEventListener("click", () => takePerk(btn.dataset.perk));
    });

    skillInfo.innerHTML = `<p>> Unspent Skill Points: ${player.unspentSkillPoints ?? 0}</p>`;

    skillButtons.innerHTML = SKILL_KEYS.map((key) => `
      <button data-skill="${key}" ${(player.unspentSkillPoints ?? 0) <= 0 ? "disabled" : ""}>
        [ ${SKILL_LABELS[key] ?? key}: ${player[key]} ]
      </button>
    `).join("");

    skillButtons.querySelectorAll("[data-skill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        player = spendSkillPoint(player, btn.dataset.skill);
        api.patchPlayer(player);
        paint();
      });
    });
  }

  continueBtn?.addEventListener("click", () => {
    api.setScene("combat"); // or "gameplay" when testing is done
  });

  paint();
}