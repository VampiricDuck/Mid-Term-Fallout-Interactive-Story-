import { goToScene } from "../../sceneNavigation.js";

export function renderlegioncampinfo(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>LEGION CAMP</h1><br />
      <img src="(0)Images/legioncamp.png" alt="Legion Camp Image" class="intro-image" width="339" height="177" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>>> Legion Soldier: This is Dogtown's main legion camp. The quartermaster manages supplies, patrols rotate every shift, and all movement in and out is logged.</p><br />
      <p>>> Legion Soldier: If NCR pressure keeps growing, this camp becomes the front line.</p><br />
      <div class="actions">
        <button id="leavebtn">[ RETURN ]</button>
      </div>
    </section>
  `;

  root.querySelector("#leavebtn")?.addEventListener("click", () => goToScene(api, "legionCamp"));
}