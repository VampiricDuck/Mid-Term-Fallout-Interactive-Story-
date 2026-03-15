// Import state tools.
import {
  getState,
  setScene,
  subscribe,
  loadGame,
  saveGame,
  resetState,
  patchState,
  patchPlayer,
  patchStory
} from "./utils/stateManager.js";

// Import scene renderers.
import { renderMainMenu } from "./scenes/mainmenu.js";
import { renderIntro } from "./scenes/intro.js";
import { renderCharacterCreate } from "./scenes/charactercreate.js";
import { renderLevelUp } from "./scenes/levelup.js";
import { renderGameOver } from "./scenes/gameover.js";
import { renderCombat } from "./scenes/combat.js";
import { renderShop } from "./scenes/shop.js";
import { renderdogtownIntro } from "./scenes/dogtownscenes/introdogtown.js";
import { renderdogtown } from "./scenes/dogtownscenes/dogtown.js";
import { renderlegioncamp } from "./scenes/dogtownscenes/legioncamp/legioncamp.js";
import { renderlegioncampinfo } from "./scenes/dogtownscenes/legioncamp/legioncampinfo.js";
import { renderlegioncampquest } from "./scenes/dogtownscenes/legioncamp/legioncampquest.js";
import { renderboulderroad } from "./scenes/northwardscenes/boulderroad.js";
import { renderboulder } from "./scenes/northwardscenes/boulder.js";
import { renderbadend } from "./scenes/northwardscenes/badend.js";
import { rendergoodend } from "./scenes/northwardscenes/goodend.js";
import { renderdesert } from "./scenes/eastwardscenes/desert.js";
import { renderidahospings } from "./scenes/eastwardscenes/idahospings.js";
import { renderidahospringsquest } from "./scenes/eastwardscenes/idahospringsquest.js";
import { rendergeorgetown } from "./scenes/southwardscenes/georgetown.js";
import { renderncrtalk } from "./scenes/southwardscenes/ncrtalk.js";
import { renderunexploredmnt } from "./scenes/westwardscenes/unexploredmountains.js";
// import { renderGameplay } from "./scenes/gameplay.js";

// Import UI overlays.
import { mountInventoryOverlay } from "./ui/inventoryOverlay.js"; // add this
import { recalculatePlayerStats } from "./utils/leveling.js";

// Grab the dynamic mount point from HTML.
const sceneRoot = document.getElementById("sceneRoot");

const MUSIC_TRACKS = [
  "(0)music/01 Metallic Monks.mp3",
  "(0)music/02 Desert Wind.mp3",
  "(0)music/03 A Trader's Life.mp3",
  "(0)music/04 The Vault Of The Future.mp3",
  "(0)music/05 Industrial Junk.mp3",
  "(0)music/06 Moribund World.mp3",
  "(0)music/07 Vats Of Goo.mp3",
  "(0)music/08 City Of The Dead.mp3",
  "(0)music/09 Second Chance.mp3",
  "(0)music/10 Underground Troubles.mp3",
  "(0)music/11 City Of Lost Angels.mp3",
  "(0)music/12 Followers' Credo.mp3",
  "(0)music/14 Acolytes Of The New God.mp3",
  "(0)music/15 Flame Of The Ancient World.mp3",
  "(0)music/16 Khans Of New California.mp3"
];

let bgmAudio = null;
let bgmStarted = false;
let lastTrackIndex = -1;

function pickNextTrackIndex() {
  if (!MUSIC_TRACKS.length) return -1;
  if (MUSIC_TRACKS.length === 1) return 0;

  let idx = Math.floor(Math.random() * MUSIC_TRACKS.length);
  while (idx === lastTrackIndex) {
    idx = Math.floor(Math.random() * MUSIC_TRACKS.length);
  }
  return idx;
}

function playRandomTrack() {
  if (!bgmAudio || !MUSIC_TRACKS.length) return;

  const nextIdx = pickNextTrackIndex();
  if (nextIdx < 0) return;

  lastTrackIndex = nextIdx;
  bgmAudio.src = encodeURI(MUSIC_TRACKS[nextIdx]);
  return bgmAudio.play();
}

function ensureBackgroundMusic() {
  if (bgmAudio) return;

  bgmAudio = document.createElement("audio");
  bgmAudio.preload = "auto";
  bgmAudio.volume = 0.45;
  bgmAudio.addEventListener("ended", playRandomTrack);
  document.body.appendChild(bgmAudio);

  const interactionEvents = ["pointerdown", "keydown", "touchstart"];

  const removeInteractionListeners = () => {
    interactionEvents.forEach((evtName) => {
      window.removeEventListener(evtName, startMusic);
    });
  };

  const startMusic = async () => {
    if (bgmStarted) return;

    try {
      await playRandomTrack();
      bgmStarted = true;
      removeInteractionListeners();
    } catch {
      // Autoplay can be blocked until trusted user input.
    }
  };

  interactionEvents.forEach((evtName) => {
    window.addEventListener(evtName, startMusic);
  });

  // Try autoplay too; if blocked, interaction listeners above will start it.
  startMusic();
}

// Map state.scene names to their renderer functions.
const sceneMap = {
  mainMenu: renderMainMenu,
  intro: renderIntro,
  characterCreation: renderCharacterCreate,
  levelup: renderLevelUp,
  combat: renderCombat,
  shop: renderShop,
  dogtownIntro: renderdogtownIntro,
  dogtown: renderdogtown,
  legionCamp: renderlegioncamp,
  legionCampInfo: renderlegioncampinfo,
  legionCampQuest: renderlegioncampquest,
  boulderRoad: renderboulderroad,
  boulder: renderboulder,
  badEnd: renderbadend,
  goodEnd: rendergoodend,
  desert: renderdesert,
  idahoSprings: renderidahospings,
  idahoSpringsQuest: renderidahospringsquest,
  georgetown: rendergeorgetown,
  ncrTalk: renderncrtalk,
  unexploredMountains: renderunexploredmnt
};

// Tools passed into every scene so scenes can change state.
const api = {
  getState,
  patchState,
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
    topBar.innerHTML = `
      <button id="inventoryBtn">[ INVENTORY ]</button>
      <button id="systemBtn">[ SYSTEM ]</button>
    `;
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
let lastRenderedScene = null;

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
function render(root, api) {
  if (!root) return;

  root.replaceChildren();

  const scene = api.getState().scene;
  const previousScene = lastRenderedScene;
  lastRenderedScene = scene;

  // Skip JS scene animation on first load (CSS boot animation already running).
  if (isFirstRender) {
    isFirstRender = false;
  } else {
    const enteringCombat = scene === "combat" && previousScene !== "combat";
    const shouldAnimate = scene !== "combat" || enteringCombat;
    if (shouldAnimate) runSceneLoadingAnimation(root);
  }

  if (scene === "gameover") {
    renderGameOver(root, api);
    return;
  }

  const renderer = sceneMap[scene];

  if (!renderer) {
    root.textContent = `Scene not found: ${scene}`;
    return;
  }

  const { wrapper, content } = buildSceneShell(scene);
  root.appendChild(wrapper);

  if (scene !== "mainMenu") {
    const overlay = buildSystemOverlay();
    wrapper.appendChild(overlay);
    wireSystemOverlay(wrapper);

    mountInventoryOverlay(wrapper, api);
  }

  renderer(content, api);
}

// Subscribe render() so every state update redraws UI.
subscribe(() => render(sceneRoot, api));

// First draw on page load.
render(sceneRoot, api);
ensureBackgroundMusic();