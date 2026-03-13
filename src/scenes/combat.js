import { ITEMS } from "../data/items.js";
import {
  createCombatEncounter,
  syncCombatPlayerDefense,
  getPlayerWeaponsForCombat,
  getPlayerConsumablesForCombat,
  playerAttack,
  playerUseConsumableInCombat,
  playerTryFlee,
  endPlayerTurn,
  runEnemyTurn,
  applyCombatResultToPlayer
} from "../utils/combatEngine.js";

let activeCombatState = null;

export function renderCombat(root, api) {
  const livePlayer = api.getState().player ?? {};

  // Keep same encounter during re-renders (inventory/equip updates).
  if (!activeCombatState) {
    activeCombatState = createCombatEncounter(livePlayer);
  } else {
    syncCombatPlayerDefense(activeCombatState, livePlayer);
  }

  const state = activeCombatState;

  root.innerHTML = `
    <section class="scene scene-combat">
      <h1>Combat</h1>
      <div class="combat-shell" style="display:grid;grid-template-columns:1.3fr 1fr;gap:12px;">
        <div>
          <h3>LOG</h3>
          <div id="combatLog" style="min-height:220px;white-space:pre-wrap;"></div>
        </div>
        <div>
          <h3>STATUS</h3>
          <div id="combatStats"></div>
          <hr />
          <div id="combatActions"></div>
          <div id="combatSubmenu" style="margin-top:8px;"></div>
        </div>
      </div>
    </section>
  `;

  const logEl = root.querySelector("#combatLog");
  const statsEl = root.querySelector("#combatStats");
  const actionsEl = root.querySelector("#combatActions");
  const submenuEl = root.querySelector("#combatSubmenu");

  function runEnemyIfNeeded() {
    if (!state.ended && state.turn === "enemy") runEnemyTurn(state);
  }

  function afterPlayerAction() {
    if (state.ended) return;
    if (state.player.ap <= 0 || state.turn === "enemy") {
      endPlayerTurn(state);
      runEnemyIfNeeded();
    }
  }

  function finishCombat() {
    const updated = applyCombatResultToPlayer(livePlayer, state);
    api.patchPlayer(updated);

    // Clear encounter cache when leaving combat.
    activeCombatState = null;

    if (state.outcome === "defeat") {
      api.setScene("gameover");
      return;
    }

    api.setScene("gameplay");
  }

  function renderSubmenu(kind) {
    submenuEl.innerHTML = "";
    if (state.ended || state.turn !== "player") return;

    if (kind === "attack") {
      const weapons = getPlayerWeaponsForCombat(state);
      if (!weapons.length) {
        submenuEl.innerHTML = `<p>>> No weapons available.</p>`;
        return;
      }

      submenuEl.innerHTML = weapons
        .map((w) => {
          const ap = Number(w.template?.AP ?? 4);
          const decay = Number(w.decay ?? 0);
          const broken = w.broken || decay >= 10;
          return `<button data-weapon="${w.id}" ${broken ? "disabled" : ""}>
            [ ${w.template?.name ?? w.id} | AP ${ap} | DECAY ${decay}/10${broken ? " | BROKEN" : ""} ]
          </button>`;
        })
        .join("<br />");

      submenuEl.querySelectorAll("[data-weapon]").forEach((btn) => {
        btn.addEventListener("click", () => {
          playerAttack(state, btn.dataset.weapon);
          paint();
          afterPlayerAction();
          paint();
        });
      });
    }

    if (kind === "aid") {
      const aids = getPlayerConsumablesForCombat(state);
      if (!aids.length) {
        submenuEl.innerHTML = `<p>>> No consumables available.</p>`;
        return;
      }

      submenuEl.innerHTML = aids
        .map((a) => `<button data-aid="${a.id}">[ USE ${a.template?.name ?? a.id} x${a.quantity} | AP 5 ]</button>`)
        .join("<br />");

      submenuEl.querySelectorAll("[data-aid]").forEach((btn) => {
        btn.addEventListener("click", () => {
          playerUseConsumableInCombat(state, btn.dataset.aid);
          paint();
          afterPlayerAction();
          paint();
        });
      });
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  const UI_LOG_LINES = 6;

  function renderLog(lines) {
    const arr = Array.isArray(lines) ? lines : [];
    const visible = arr.slice(-UI_LOG_LINES); // only newest lines
    const lastIdx = visible.length - 1;

    logEl.innerHTML = visible
      .map((line, i) => {
        const safe = escapeHtml(line);
        return i === lastIdx ? `<div><strong>${safe}</strong></div>` : `<div>${safe}</div>`;
      })
      .join("");
  }

  function paint() {
    renderLog(state.log);

    statsEl.innerHTML = `
      <p>>> PLAYER: ${state.playerName ?? state.player?.name ?? "Wanderer"}</p>
      <p>>> PLAYER HP: ${state.player.hp}/${state.player.hpMax}</p>
      <p>>> PLAYER SP: ${state.player.sp}/${state.player.spMax}</p>
      <p>>> PLAYER AP: ${state.player.ap}/${state.player.apMax}</p>
      <p>>> PLAYER AC: ${state.player.ac}</p>
      <hr />
      <p>>> ENEMY: ${state.enemy.name}</p>
      <p>>> ENEMY HP: ${state.enemy.hp}/${state.enemy.hpMax}</p>
      <p>>> ENEMY SP: ${state.enemy.sp}/${state.enemy.spMax}</p>
      <p>>> ENEMY AC: ${state.enemy.ac}</p>
    `;

    if (state.ended) {
      const lootText = (state.lootAwarded ?? [])
        .map((l) => `${ITEMS[l.id]?.name ?? l.id} x${l.quantity}`)
        .join(", ");

      actionsEl.innerHTML = `
        <p>>> Result: ${String(state.outcome ?? "").toUpperCase()}</p>
        <p>>> XP Gained: ${state.xpAwarded}</p>
        ${lootText ? `<p>>> Loot: ${lootText}</p>` : ""}
        <button id="combatContinueBtn">[ CONTINUE ]</button>
      `;
      submenuEl.innerHTML = "";
      root.querySelector("#combatContinueBtn")?.addEventListener("click", finishCombat);
      return;
    }

    actionsEl.innerHTML = `
      <button id="actAttack">[ ATTACK ]</button>
      <button id="actAid">[ USE AID ]</button>
      <button id="actFlee">[ FLEE ]</button>
      <button id="actEnd">[ END TURN ]</button>
    `;

    root.querySelector("#actAttack")?.addEventListener("click", () => renderSubmenu("attack"));
    root.querySelector("#actAid")?.addEventListener("click", () => renderSubmenu("aid"));
    root.querySelector("#actFlee")?.addEventListener("click", () => {
      playerTryFlee(state);
      paint();
      afterPlayerAction();
      paint();
    });
    root.querySelector("#actEnd")?.addEventListener("click", () => {
      endPlayerTurn(state);
      runEnemyIfNeeded();
      paint();
    });
  }

  paint();
}