import { goToScene, maybeTravelWithCombat } from "../sceneNavigation.js";

export function rendergeorgetown(root, api) {
  const story = api.getState().story ?? {};
  const hasBriefedNcr = !!story.ncrBriefed;

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>GEORGETOWN</h1><br />
      <img src="(0)Images/georgetown.png" alt="Georgetown Image" class="intro-image" width="474" height="355" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>This city, just south of Dogtown, is not only significantly smaller but also has a significant lack of Legion soldiers. Instead, you find NCR troopers.</p><br />
      <p>${hasBriefedNcr ? "The NCR already has your report and is preparing the road out of Colorado." : "The NCR commander keeps watching you, convinced you know something useful about the Legion."}</p><br />

      <div class="actions">
        ${hasBriefedNcr ? "" : '<button id="approachNCR">[ APPROACH NCR ]</button>'}
        <button id="shopBtn">[ SHOP ]</button>
        <button id="northBtn">[ NORTH ]</button>
      </div>
    </section>
  `;

  root.querySelector("#approachNCR")?.addEventListener("click", () => {
    goToScene(api, "ncrTalk");
  });

  root.querySelector("#shopBtn")?.addEventListener("click", () => {
    goToScene(api, "shop");
  });

  root.querySelector("#northBtn")?.addEventListener("click", () => {
    maybeTravelWithCombat(api, "dogtown", 0.75);
  });
}