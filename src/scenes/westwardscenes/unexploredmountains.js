import { forceCombatAndReturn, maybeTravelWithCombat } from "../sceneNavigation.js";

export function renderunexploredmnt(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>MOUNTAIN RANGE</h1><br />
      <img src="(0)Images/unexploredmountains.png" alt="Mountain Range Image" class="intro-image" width="400" height="400" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>The mountain range is a frozen graveyard. Nuclear winter carved the passes into radioactive ice corridors, and almost nobody comes back from deep exploration.</p><br />
      <div class="actions">
        <button id="exploreBtn">[ EXPLORE ]</button>
        <button id="eastBtn">[ EAST ]</button>
      </div>
    </section>
  `;

  root.querySelector("#exploreBtn")?.addEventListener("click", () => {
    forceCombatAndReturn(api, "unexploredMountains");
  });

  root.querySelector("#eastBtn")?.addEventListener("click", () => {
    maybeTravelWithCombat(api, "dogtown", 0.75);
  });
}