import { goToScene, maybeTravelWithCombat } from "../sceneNavigation.js";

export function renderdogtownIntro(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>DOGTOWN</h1><br />
      <img src="(0)Images/dogtown.png" alt="Dogtown Image" class="intro-image" width="360" height="219" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>After handing over your identification, the legion guard studies it and finally waves you through.</p><br />
      <p>>> Legion Soldier: There is one condition. Nobody enters or leaves Colorado. NCR scouts are pushing in, and information is a weapon. Break that rule and we kill you. Enjoy Dogtown.</p><br />
      <p>Outside the camp, scrap-metal bridges connect shattered buildings while handlers keep their hounds watching every move. You quickly mark the key places: a shop, the legion camp, and roads in every direction.</p><br />
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