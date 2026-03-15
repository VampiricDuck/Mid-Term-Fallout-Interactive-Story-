// Render Main Menu scene.
export function renderMainMenu(root, api) {
  root.innerHTML = `
    <section class="scene scene-main-menu">
      <img src="(0)images/mainmenu.png" alt="Main Menu" class="scene-image" width="240" height="139">
      <h1>MAIN MENU</h1>
      <p>Welcome to the wasteland terminal.</p>

      <p id="menuStatus" class="menu-status" aria-live="polite"></p>

      <div class="actions">
        <button id="newGameBtn">[ NEW GAME ]</button>
        <button id="loadGameBtn">[ LOAD GAME ]</button>
        <button id="saveGameBtn">[ SAVE GAME ]</button>
      </div>
    </section>
  `;

  const newGameBtn = root.querySelector("#newGameBtn");
  const loadGameBtn = root.querySelector("#loadGameBtn");
  const saveGameBtn = root.querySelector("#saveGameBtn");
  const menuStatus = root.querySelector("#menuStatus");

  const setStatus = (text) => {
    if (menuStatus) menuStatus.textContent = text;
  };

  newGameBtn?.addEventListener("click", () => {
    api.resetState();
    api.setScene("intro");
  });

  loadGameBtn?.addEventListener("click", () => {
    const ok = api.loadGame();
    setStatus(ok ? ">> Save file loaded." : ">> No save file found.");
  });

  saveGameBtn?.addEventListener("click", () => {
    api.saveGame();
    setStatus(">> Game saved.");
  });
}