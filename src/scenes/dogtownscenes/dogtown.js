import { goToScene, maybeTravelWithCombat } from "../sceneNavigation.js";

export function renderdogtown(root, api) {  
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>DOGTOWN</h1><br />
      <img src="(0)Images/dogtown.png" alt="Dogtown Image" class="intro-image" width="360" height="219" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>Dogtown spreads out in rusted platforms and collapsed towers. Legion hounds and handlers watch the streets while caravans move through wrecked alleys. You can head to the shop, revisit the legion camp, or travel out in any direction.</p><br />
      <div class="actions">
        <button id="shopBtn">[ SHOP ]</button>
        <button id="legionCampBtn">[ LEGION CAMP ]</button>
        <button id="northBtn">[ NORTH ]</button>
        <button id="eastBtn">[ EAST ]</button>
        <button id="southBtn">[ SOUTH ]</button>
        <button id="westBtn">[ WEST ]</button>
      </div>
    </section>
  `;

  root.querySelector("#shopBtn")?.addEventListener("click", () => goToScene(api, "shop"));
  root.querySelector("#legionCampBtn")?.addEventListener("click", () => goToScene(api, "legionCamp"));
  root.querySelector("#northBtn")?.addEventListener("click", () => maybeTravelWithCombat(api, "boulderRoad", 0.75));
  root.querySelector("#eastBtn")?.addEventListener("click", () => maybeTravelWithCombat(api, "desert", 0.75));
  root.querySelector("#southBtn")?.addEventListener("click", () => maybeTravelWithCombat(api, "georgetown", 0.75));
  root.querySelector("#westBtn")?.addEventListener("click", () => maybeTravelWithCombat(api, "unexploredMountains", 0.75));
}