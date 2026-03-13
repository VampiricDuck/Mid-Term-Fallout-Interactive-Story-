export function renderGameOver(root, api) {
  root.innerHTML = `
    <section class="scene scene-gameover">
      <h1>Game Over</h1>
      <pre>
>> You have died.
>> The wasteland shows no mercy.
      </pre>

      <button id="goMainMenu">[ RETURN TO MAIN MENU ]</button>
    </section>
  `;

  root.querySelector("#goMainMenu")?.addEventListener("click", () => {
    if (typeof api.resetPlayer === "function") {
      api.resetPlayer();
    }
    api.setScene("mainMenu"); // fixed key
  });
}