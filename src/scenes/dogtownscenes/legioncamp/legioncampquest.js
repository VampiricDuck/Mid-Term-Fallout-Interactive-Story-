import { goToScene } from "../../sceneNavigation.js";

export function renderlegioncampquest(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>LEGION CAMP</h1><br />
      <img src="(0)Images/legioncamp.png" alt="Legion Camp Image" class="intro-image" width="339" height="177" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>>> Legion Soldier: Work is thin right now. Keep yourself armed and check back after your next patrol sweep.</p><br />
      <div class="actions">
        <button id="leavebtn">[ RETURN ]</button>
      </div>
    </section>
  `;

  root.querySelector("#leavebtn")?.addEventListener("click", () => goToScene(api, "legionCamp"));
}