import { goToScene } from "../sceneNavigation.js";

export function renderidahospings(root, api) {
  const story = api.getState().story ?? {};
  const questDone = !!story.idahoSpringsQuestDone;

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>IDAHO SPRINGS</h1><br />
      <img src="(0)Images/idahospings.png" alt="Idaho Springs Image" class="intro-image" width="320" height="171" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>In the middle of the desert exists this small oasis where travelers may find refuge from the scorching heat. Some have taken permanent residence, and others have set up temporary shops.</p><br />
      <p>${questDone ? "The settlement mechanic nods when you pass. You already earned your keep here." : "A settlement mechanic is paying for anyone willing to help keep the pumps and caravans moving."}</p><br />
      <div class="actions">
        <button id="shopBtn">[ SHOP ]</button>
        <button id="desertBtn">[ DESERT ]</button>
        <button id="questBtn">[ ASK FOR WORK ]</button>
      </div>
    </section>
  `;

  root.querySelector("#shopBtn")?.addEventListener("click", () => {
    goToScene(api, "shop");
  });

  root.querySelector("#desertBtn")?.addEventListener("click", () => {
    goToScene(api, "desert");
  });

  root.querySelector("#questBtn")?.addEventListener("click", () => {
    goToScene(api, "idahoSpringsQuest");
  });
}