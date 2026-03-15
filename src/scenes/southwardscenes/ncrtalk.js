import { goToScene } from "../sceneNavigation.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderncrtalk(root, api) {
  const story = api.getState().story ?? {};
  const priorIntel = String(story.ncrIntel ?? "");

  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>NCR COMMAND</h1><br />
      <img src="(0)Images/georgetown.png" alt="Georgetown Image" class="intro-image" width="474" height="355" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>NCR commander >> You want out of Colorado, and I want the Legion's center of operations. Give me something real and my troopers will keep the interstate east of Boulder clear long enough for you to leave.</p><br />

      <div class="actions">
        <div class="inform-row" style="display:flex; align-items:center; gap:0.5rem;">
          <label for="informInput" style="margin:0;">[ INFORM ]:</label>
          <input type="text" id="informInput" value="${escapeHtml(priorIntel)}" />
        </div>
        <button id="submitBtn">[ REPORT ]</button>
        <button id="exitBtn">[ RETURN ]</button>
        <p id="ncrStatus" aria-live="polite"></p>
      </div>
    </section>
  `;

  const input = root.querySelector("#informInput");
  const status = root.querySelector("#ncrStatus");

  root.querySelector("#submitBtn")?.addEventListener("click", () => {
    const intel = String(input?.value ?? "").trim();
    if (!intel) {
      if (status) status.textContent = ">> The commander waits for a real report.";
      return;
    }

    const knowsDogtown = /dogtown/i.test(intel);
    api.patchStory({
      ncrIntel: intel,
      ncrBriefed: true,
      ncrKnowsDogtown: knowsDogtown
    });

    if (status) {
      status.textContent = knowsDogtown
        ? ">> NCR scouts move immediately. The road east of Boulder may now be survivable."
        : ">> The NCR takes the report, but the command tent feels unconvinced.";
    }
  });

  root.querySelector("#exitBtn")?.addEventListener("click", () => {
    goToScene(api, "georgetown");
  });
}