import { maybeTravelWithCombat } from "../sceneNavigation.js";

export function renderboulderroad(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>BOULDER ROAD</h1><br />
      <img src="(0)Images/boulderroad.png" alt="Boulder Road Image" class="intro-image" width="474" height="266" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>A large highway still stands despite the all-consuming plant life; this great interstate still connects Dogtown to Boulder.</p><br />
      <div class="actions">
        <button id="northBtn">[ NORTH ]</button>
        <button id="southBtn">[ SOUTH ]</button>
      </div>
    </section>
  `;

  root.querySelector("#northBtn")?.addEventListener("click", () => {
    maybeTravelWithCombat(api, "boulder", 0.75);
  });

  root.querySelector("#southBtn")?.addEventListener("click", () => {
    maybeTravelWithCombat(api, "dogtown", 0.75);
  });
}