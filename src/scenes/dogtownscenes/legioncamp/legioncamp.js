import { goToScene } from "../../sceneNavigation.js";

export function renderlegioncamp(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>LEGION CAMP</h1><br />
      <img src="(0)Images/legioncamp.png" alt="Legion Camp Image" class="intro-image" width="339" height="177" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>The camp is orderly and tense, with patrols circling tents and raised watch posts.</p><br />
      <p>At the central desk, the same soldier who cleared your papers recognizes you and nods.</p><br />
      <p>>> Legion Soldier: Welcome back. Need information, work, or are you leaving?</p><br />
      <div class="actions">
        <button id="informationbtn">[ TELL ME ABOUT THIS LOCATION ]</button>
        <button id="questbtn">[ WORK AVAILABLE ]</button>
        <button id="leaveBtn">[ LEAVE ]</button>
      </div>
    </section>
  `;

  root.querySelector("#informationbtn")?.addEventListener("click", () => goToScene(api, "legionCampInfo"));
  root.querySelector("#questbtn")?.addEventListener("click", () => goToScene(api, "legionCampQuest"));
  root.querySelector("#leaveBtn")?.addEventListener("click", () => goToScene(api, "dogtown"));
}