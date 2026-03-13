import { ensureInventoryModel, useConsumable, toggleArmorEquip } from "../utils/inventory.js";
import { ITEMS } from "../data/items.js";
import { PROPERTIES } from "../data/properties.js";
import {
  getItemDecay,
  getJunkIdInInventory,
  getItemCount,
  repairItemDecayWithJunk
} from "../utils/inventory.js";

const WEAPON_TYPES = new Set([
  "melee weapon",
  "unarmed weapon",
  "mechanical weapon",
  "ranged weapon"
]);

export function mountInventoryOverlay(wrapper, api) {
  const overlay = document.createElement("section");
  overlay.id = "inventoryOverlay";
  overlay.innerHTML = `
    <div class="inventory-panel" role="dialog" aria-modal="true" aria-label="Inventory">
      <h3>INVENTORY</h3>
      <p id="invStatus" aria-live="polite"></p>
      <div id="invList"></div>
      <div class="actions">
        <button id="invCloseBtn">[ CLOSE ]</button>
      </div>
    </div>
  `;
  wrapper.appendChild(overlay);

  const detailModal = document.createElement("section");
  detailModal.id = "itemDetailModal";
  detailModal.innerHTML = `
    <div class="item-detail-panel">
      <h3 id="detailName"></h3>
      <div id="detailStats"></div>
      <div class="actions">
        <button id="detailCloseBtn">[ CLOSE ]</button>
      </div>
    </div>
  `;
  wrapper.appendChild(detailModal);

  const invBtn         = wrapper.querySelector("#inventoryBtn");
  const invCloseBtn    = overlay.querySelector("#invCloseBtn");
  const invList        = overlay.querySelector("#invList");
  const invStatus      = overlay.querySelector("#invStatus");
  const detailCloseBtn = detailModal.querySelector("#detailCloseBtn");
  const detailName     = detailModal.querySelector("#detailName");
  const detailStats    = detailModal.querySelector("#detailStats");

  let currentEquipment = [];

  const setStatus = (t) => { if (invStatus) invStatus.textContent = t; };

  function normalizeInvEntry(raw) {
    if (typeof raw === "string") return { id: raw, quantity: 1 };
    return {
      ...raw,
      id: raw?.id ?? raw?.itemId ?? raw?.key ?? "",
      quantity: raw?.quantity ?? raw?.qty ?? raw?.count ?? 1
    };
  }

  function resolveTemplate(invItem) {
    const n = normalizeInvEntry(invItem);
    return ITEMS[n.id] ?? null;
  }

  function getDisplayProperties(source) {
    const props = Array.isArray(source?.properties) ? source.properties : [];
    return props
      .map((p) => String(p).trim())
      .filter((p) =>
        p.length > 0 &&
        !/^thrown/i.test(p) &&
        !/^reach/i.test(p) &&
        !/^ranged/i.test(p)
      );
  }

  function renderPropertyList(props) {
    if (!props.length) return "";
    const tags = props
      .map((p) => `<span class="prop-tag" data-prop="${p}" title="Click for details">${p}</span>`)
      .join(", ");
    return `<p>>> Properties: ${tags}</p>`;
  }

  function renderItemDetail(invItem) {
    const n = normalizeInvEntry(invItem);
    const template = resolveTemplate(invItem);
    const source = template ?? invItem;
    if (!source) return;

    detailName.textContent = source.name ?? n.id ?? "Unknown Item";

    let html = "";
    const type = source.type ?? "";

    if (WEAPON_TYPES.has(type)) {
      html = `
        <p>>> Type: ${type}</p>
        <p>>> AP Cost: ${source.AP ?? "-"}</p>
        <p>>> Damage: ${source.damage ?? "-"}</p>
        <p>>> Critical: ${source.CriticalHit ?? "-"}</p>
        <p>>> STR Req: ${source.STRreq ?? "-"}</p>
      `;
      if (source.range != null)   html += `<p>>> Range: ${source.range}</p>`;
      if (source.Ammo != null)    html += `<p>>> Ammo Type: ${source.Ammo}</p>`;
      if (source.Mag != null)     html += `<p>>> Magazine: ${source.Mag}</p>`;
      if (source.Load != null)    html += `<p>>> Load: ${source.Load}</p>`;
      if (source.Decay != null)   html += `<p>>> Decay: ${source.Decay}</p>`;
      if (source.cost != null)    html += `<p>>> Value: ${source.cost} caps</p>`;
      const props = getDisplayProperties(source);
      html += renderPropertyList(props);

    } else if (type === "armor") {
      html = `
        <p>>> Type: Armor</p>
        <p>>> AC Bonus: ${source.AC ?? "-"}</p>
        <p>>> DT: ${source.DT ?? "-"}</p>
        <p>>> STR Req: ${source.STRreq ?? "-"}</p>
      `;
      if (source.Load != null)  html += `<p>>> Load: ${source.Load}</p>`;
      if (source.Decay != null) html += `<p>>> Decay: ${source.Decay}</p>`;
      if (source.cost != null)  html += `<p>>> Value: ${source.cost} caps</p>`;

    } else if (type === "ammo") {
      html = `
        <p>>> Type: Ammo</p>
        <p>>> Caliber: ${source.name ?? n.id}</p>
      `;
      if (source.damage != null)      html += `<p>>> Damage Modifier: ${source.damage}</p>`;
      if (source.description != null) html += `<p>>> ${source.description}</p>`;
      if (source.cost != null)        html += `<p>>> Value: ${source.cost} caps</p>`;

    } else if (type === "consumable") {
      html = `<p>>> Type: Consumable</p>`;
      if (source.HPrestor != null)    html += `<p>>> Restores: ${source.HPrestor} HP</p>`;
      if (source.SPrestor != null)    html += `<p>>> Restores: ${source.SPrestor} SP</p>`;
      if (source.description != null) html += `<p>>> ${source.description}</p>`;
      if (source.cost != null)        html += `<p>>> Value: ${source.cost} caps</p>`;

    } else if (type === "crafting material") {
      html = `<p>>> Type: Crafting Material</p>`;
      if (source.description != null) html += `<p>>> ${source.description}</p>`;
      if (source.cost != null)        html += `<p>>> Value: ${source.cost} caps</p>`;

    } else if (type === "currency") {
      html = `<p>>> Type: Currency</p>`;

    } else {
      html = `<p>>> Type: ${type || "Unknown"}</p>`;
      if (source.description != null) html += `<p>>> ${source.description}</p>`;
    }

    detailStats.innerHTML = html;
    detailModal.classList.add("open");

    detailStats.querySelectorAll(".prop-tag").forEach((el) => {
      el.addEventListener("click", () => {
        const existing = detailStats.querySelector(`#prop-desc-${el.dataset.prop}`);
        if (existing) { existing.remove(); return; }
        const desc = PROPERTIES[el.dataset.prop];
        if (!desc) return;
        const p = document.createElement("p");
        p.id = `prop-desc-${el.dataset.prop}`;
        p.className = "prop-desc";
        p.textContent = `  >> ${desc}`;
        el.insertAdjacentElement("afterend", p);
      });
    });
  }

  function getEquippedArmorId(player) {
    return player?.loadout?.armorId ?? null;
  }

  function renderList() {
    const state = api.getState();
    const p = ensureInventoryModel(state.player ?? {});
    const equippedArmorId = getEquippedArmorId(p);

    const rawInventory = Array.isArray(p.inventory) ? p.inventory : []; // FIX

    currentEquipment = rawInventory
      .map(normalizeInvEntry)
      .filter((it) => it.id && ITEMS[it.id]);

    if (!currentEquipment.length) {
      invList.innerHTML = `<p>>> Inventory is empty.</p>`;
      return;
    }

    invList.innerHTML = currentEquipment.map((it, idx) => {
      const template = resolveTemplate(it);
      const qty      = Number(it.quantity ?? 1);
      const itemId   = String(it.id);
      const itemName = template?.name ?? itemId;
      const itemType = template?.type ?? "";

      const isArmor      = itemType === "armor";
      const isConsumable = itemType === "consumable";
      const equipped     = isArmor && itemId === String(equippedArmorId ?? "");
      const equipTag     = equipped ? " (EQUIPPED)" : "";

      const decay = getItemDecay(p, itemId); // FIX: p, not player
      const junkId = getJunkIdInInventory(p); // FIX: p, not player
      const junkCount = junkId ? getItemCount(p, junkId) : 0; // FIX: p, not player
      const canRepair = decay > 0 && junkCount > 0;

      return `
        <div class="inv-row">
          <span class="inv-item-name" data-inv-index="${idx}" style="cursor:pointer;">
            ${itemName}${equipTag} x${qty}
          </span>
          <span class="inv-actions">
            ${isConsumable && qty > 0
              ? `<button data-use="${itemId}">[ USE ]</button>`
              : ""}
            ${isArmor && qty > 0
              ? `<button data-armor-toggle="${itemId}">[ ${equipped ? "UNEQUIP" : "EQUIP"} ]</button>`
              : ""}
            ${decay > 0
              ? `<button data-repair="${itemId}" ${canRepair ? "" : "disabled"}>[ REPAIR ]</button>`
              : ""}
          </span>
        </div>
      `;
    }).join("");

    // clicking item name opens detail for ALL item types
    invList.querySelectorAll(".inv-item-name").forEach((el) => {
      el.addEventListener("click", () => {
        renderItemDetail(currentEquipment[Number(el.dataset.invIndex)]);
      });
    });

    invList.querySelectorAll("button[data-use]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { player, msg } = useConsumable(api.getState().player, btn.dataset.use);
        api.patchPlayer(player);
        setStatus(msg);
        renderList();
      });
    });

    invList.querySelectorAll("button[data-armor-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { player, msg } = toggleArmorEquip(api.getState().player, btn.dataset.armorToggle);
        api.patchPlayer(player);
        setStatus(msg);
        renderList();
      });
    });

    invList.querySelectorAll("[data-repair]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const itemId = btn.getAttribute("data-repair");
        const state = api.getState();
        const res = repairItemDecayWithJunk(state.player, itemId);

        if (!res.ok) {
          setStatus("Cannot repair (need junk or item has no decay).");
          return;
        }

        api.patchPlayer(res.player);
        setStatus(`Repaired ${itemId}: decay is now ${res.decay}/10.`);
        renderList();
      });
    });
  }

  const open        = () => { overlay.classList.add("open"); renderList(); setStatus(""); };
  const close       = () => overlay.classList.remove("open");
  const closeDetail = () => detailModal.classList.remove("open");

  overlay.addEventListener("click",     (e) => { if (e.target === overlay)     close(); });
  detailModal.addEventListener("click", (e) => { if (e.target === detailModal) closeDetail(); });
  invCloseBtn?.addEventListener("click",    (e) => { e.stopPropagation(); close(); });
  detailCloseBtn?.addEventListener("click", (e) => { e.stopPropagation(); closeDetail(); });

  if (invBtn) {
    invBtn.addEventListener("click", open);
  } else {
    console.warn("inventoryBtn not found");
  }
}