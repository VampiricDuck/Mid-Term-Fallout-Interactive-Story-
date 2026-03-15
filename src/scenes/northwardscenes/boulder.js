import { goToScene } from "../sceneNavigation.js";

export function renderboulder(root, api) {
  const story = api.getState().story ?? {};
  const hasNcrDeal = !!story.ncrBriefed;
  const willReachEast = !!story.ncrKnowsDogtown;

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>BOULDER</h1><br />
      <img src="(0)Images/boulder.png" alt="Boulder Image" class="intro-image" width="400" height="225" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>The ruined city of Boulder lies under concrete dust and collapsed towers. The old interstate still rises above the wreckage, the only road east that has not been swallowed whole by the wastes.</p><br />
      <p>${hasNcrDeal ? "The NCR already has your report. If it was accurate, they can screen the road for Legion ambushes." : "No NCR escort waits here. If you leave now, you are gambling your life on whatever is hiding beyond the interstate."}</p><br />
      <div class="actions">
        <button id="eastBtn">[ EAST ]</button>
        <button id="southBtn">[ SOUTH ]</button>
      </div>
    </section>
  `;

  root.querySelector("#eastBtn")?.addEventListener("click", () => {
    goToScene(api, willReachEast ? "goodEnd" : "badEnd");
  });

  root.querySelector("#southBtn")?.addEventListener("click", () => {
    goToScene(api, "boulderRoad");
  });
}