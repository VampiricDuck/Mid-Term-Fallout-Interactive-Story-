// Import state tools.
import {
  getState,
  setScene,
  subscribe,
  loadGame,
  saveGame,
  resetState,
  patchPlayer,
  patchStory
} from "./utils/stateManager.js";

// Import scene renderers.
import { renderMainMenu } from "./scenes/mainmenu.js";
import { renderIntro } from "./scenes/intro.js";
// import { renderCharacterCreation } from "./scenes/characterCreation.js";
// import { renderGameplay } from "./scenes/gameplay.js";
// import { renderCombat } from "./scenes/combat.js";

// Grab the dynamic mount point from HTML.
const sceneRoot = document.getElementById("sceneRoot");

// Map state.scene names to their renderer functions.
const sceneMap = {
  mainMenu: renderMainMenu,
  intro: renderIntro
  // characterCreation: renderCharacterCreation,
  // gameplay: renderGameplay,
  // combat: renderCombat
};

// Tools passed into every scene so scenes can change state.
const api = {
  getState,
  setScene,
  loadGame,
  saveGame,
  resetState,
  patchPlayer,
  patchStory
};

// Build a reusable scene shell.
// Non-main-menu scenes get a top-right [ SYSTEM ] button.
function buildSceneShell(activeScene) {
  const wrapper = document.createElement("section");
  wrapper.className = "scene-shell";

  if (activeScene !== "mainMenu") {
    const topBar = document.createElement("div");
    topBar.className = "scene-topbar";
    topBar.innerHTML = `<button id="systemBtn">[ SYSTEM ]</button>`;
    wrapper.appendChild(topBar);
  }

  const content = document.createElement("div");
  content.id = "sceneContent";
  wrapper.appendChild(content);

  return { wrapper, content };
}

// Build overlay/panel for save/load/menu/resume.
function buildSystemOverlay() {
  const overlay = document.createElement("section");
  overlay.id = "systemOverlay";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="system-panel" role="dialog" aria-modal="true" aria-label="System Menu">
      <h3>SYSTEM</h3>
      <p id="systemStatus" aria-live="polite"></p>
      <div class="actions">
        <button id="sysSaveBtn">[ SAVE ]</button>
        <button id="sysLoadBtn">[ LOAD ]</button>
        <button id="sysMenuBtn">[ MAIN MENU ]</button>
        <button id="sysResumeBtn">[ RESUME ]</button>
      </div>
    </div>
  `;

  return overlay;
}

// Wire overlay button behavior.
function wireSystemOverlay(wrapper) {
  const systemBtn = wrapper.querySelector("#systemBtn");
  const overlay = wrapper.querySelector("#systemOverlay");
  const panel = wrapper.querySelector(".system-panel");
  const content = wrapper.querySelector("#sceneContent");
  const status = wrapper.querySelector("#systemStatus");

  const sysSaveBtn = wrapper.querySelector("#sysSaveBtn");
  const sysLoadBtn = wrapper.querySelector("#sysLoadBtn");
  const sysMenuBtn = wrapper.querySelector("#sysMenuBtn");
  const sysResumeBtn = wrapper.querySelector("#sysResumeBtn");

  const setStatus = (text) => {
    if (status) status.textContent = text;
  };

  const openOverlay = () => {
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (content) content.setAttribute("inert", "");
    setStatus("");
  };

  const closeOverlay = () => {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (content) content.removeAttribute("inert");
  };

  systemBtn?.addEventListener("click", openOverlay);
  sysResumeBtn?.addEventListener("click", closeOverlay);

  // Optional: click backdrop to close
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // Prevent panel clicks from bubbling to backdrop
  panel?.addEventListener("click", (e) => e.stopPropagation());

  sysSaveBtn?.addEventListener("click", () => {
    saveGame();
    setStatus(">> Game saved.");
  });

  sysLoadBtn?.addEventListener("click", () => {
    const ok = loadGame();
    if (!ok) setStatus(">> No save file found.");
  });

  sysMenuBtn?.addEventListener("click", () => {
    closeOverlay();
    setScene("mainMenu");
  });
}

const SCENE_ENTER_MS = 5000; // transition speed after startup
let isFirstRender = true;    // track initial boot render

function runSceneLoadingAnimation(targetEl) {
  if (!targetEl) return;

  targetEl.getAnimations().forEach((a) => a.cancel());

  targetEl.animate(
    [
      { clipPath: "inset(0 0 100% 0)", opacity: 0.75 },
      { clipPath: "inset(0 0 0% 0)", opacity: 1 }
    ],
    {
      duration: SCENE_ENTER_MS,
      easing: "linear",
      fill: "none"
    }
  );
}

// Main render function called at startup and every state change.
function render() {
  const { scene } = getState();
  const renderer = sceneMap[scene];

  sceneRoot.replaceChildren();

  if (!renderer) {
    sceneRoot.textContent = `Scene not found: ${scene}`;
    return;
  }

  const { wrapper, content } = buildSceneShell(scene);
  sceneRoot.appendChild(wrapper);

  if (scene !== "mainMenu") {
    const overlay = buildSystemOverlay();
    wrapper.appendChild(overlay);
    wireSystemOverlay(wrapper);
  }

  renderer(content, api);

  // Skip JS scene animation on first load (CSS boot animation already running).
  if (isFirstRender) {
    isFirstRender = false;
  } else {
    runSceneLoadingAnimation(wrapper);
  }
}

// Subscribe render() so every state update redraws UI.
subscribe(render);

// First draw on page load.
render();