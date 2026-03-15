import { recalculatePlayerStats } from "../../utils/leveling.js";
import { goToScene } from "../sceneNavigation.js";

function addStackableItem(inventory, itemId, quantity) {
  const nextInventory = Array.isArray(inventory) ? structuredClone(inventory) : [];
  const idx = nextInventory.findIndex((entry) => (entry?.id ?? entry?.itemId) === itemId);

  if (idx >= 0) {
    const currentQty = Number(nextInventory[idx]?.quantity ?? nextInventory[idx]?.qty ?? nextInventory[idx]?.count ?? 0) || 0;
    nextInventory[idx] = {
      ...nextInventory[idx],
      quantity: currentQty + quantity
    };
    return nextInventory;
  }

  nextInventory.push({ id: itemId, quantity });
  return nextInventory;
}

export function renderidahospringsquest(root, api) {
  const story = api.getState().story ?? {};
  const questDone = !!story.idahoSpringsQuestDone;

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>IDAHO SPRINGS JOB</h1><br />
      <img src="(0)Images/idahosprings.png" alt="Idaho Springs Image" class="intro-image" width="320" height="171" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>${questDone ? "The caravan quartermaster already paid you for escorting the pump parts back through the dunes. There is no more work here right now." : "A caravan quartermaster needs spare parts and water hauled in from the edge of the dunes. The locals handle the heavy lifting; they just need someone dangerous enough to keep raiders off them. The job is already done by the time you arrive, but the quartermaster still offers the promised pay for showing up armed and ready."}</p><br />
      <div class="actions">
        ${questDone ? "" : '<button id="collectBtn">[ COLLECT PAYMENT ]</button>'}
        <button id="exitBtn">[ RETURN ]</button>
      </div>
    </section>
  `;

  root.querySelector("#collectBtn")?.addEventListener("click", () => {
    const player = api.getState().player ?? {};
    const nextInventory = addStackableItem(player.inventory, "ammo_10mm", 12);
    const withAid = addStackableItem(nextInventory, "healing_powder", 2);
    const nextPlayer = recalculatePlayerStats({
      ...player,
      xp: (Number(player.xp) || 0) + 750,
      caps: (Number(player.caps) || 0) + 75,
      inventory: withAid
    });

    api.patchPlayer(nextPlayer);
    api.patchStory({ idahoSpringsQuestDone: true });

    if (nextPlayer.canLevelUp) {
      api.patchStory({ pendingScene: "idahoSprings" });
      api.setScene("levelup");
      return;
    }

    goToScene(api, "idahoSprings");
  });

  root.querySelector("#exitBtn")?.addEventListener("click", () => {
    goToScene(api, "idahoSprings");
  });
}