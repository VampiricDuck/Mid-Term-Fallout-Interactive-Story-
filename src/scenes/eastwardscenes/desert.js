import { recalculatePlayerStats } from "../../utils/leveling.js";
import { goToScene, maybeTravelWithCombat } from "../sceneNavigation.js";

function awardDiscoveryXp(api, nextScene, xpAward) {
  const player = api.getState().player ?? {};
  const nextPlayer = recalculatePlayerStats({
    ...player,
    xp: (Number(player.xp) || 0) + xpAward
  });

  api.patchPlayer(nextPlayer);

  if (nextPlayer.canLevelUp) {
    api.patchStory({ pendingScene: nextScene });
    api.setScene("levelup");
    return;
  }

  api.setScene(nextScene);
}

export function renderdesert(root, api) {
  const story = api.getState().story ?? {};
  const foundIdahoSprings = !!story.idahoSpringsDiscovered;

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>DESERT</h1><br />
      <img src="(0)Images/desert.png" alt="Desert Image" class="intro-image" width="307" height="173" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>This sandy dream was once miles of prosperous farmland, now reduced to nothing more than a sandstorm valley.</p><br />
      <p>${foundIdahoSprings ? "You know a safe trail from here to Idaho Springs." : "Rumors say a hidden refuge lies somewhere out beyond the dunes, but most wanderers die before they find it."}</p><br />
      <div class="actions">
        <button id="exploreBtn">[ EXPLORE ]</button>
        ${foundIdahoSprings ? '<button id="idahoBtn">[ IDAHO SPRINGS ]</button>' : ""}
        <button id="westBtn">[ WEST ]</button>
      </div>
    </section>
  `;

  root.querySelector("#exploreBtn")?.addEventListener("click", () => {
    if (!foundIdahoSprings && Math.random() < 0.05) {
      api.patchStory({ idahoSpringsDiscovered: true });
      awardDiscoveryXp(api, "idahoSprings", 500);
      return;
    }

    maybeTravelWithCombat(api, "desert", 0.8);
  });

  root.querySelector("#idahoBtn")?.addEventListener("click", () => {
    goToScene(api, "idahoSprings");
  });

  root.querySelector("#westBtn")?.addEventListener("click", () => {
    maybeTravelWithCombat(api, "dogtown", 0.75);
  });
}