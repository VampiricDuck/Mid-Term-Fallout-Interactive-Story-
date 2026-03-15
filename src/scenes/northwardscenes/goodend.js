export function rendergoodend(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>EAST</h1><br />
      <img src="(0)Images/goodend.png" alt="Good End Image" class="intro-image" width="328" height="185" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>Because the NCR believed your warning, the interstate is screened before you move. For the first time since entering Colorado, the road ahead is open. You leave the state alive and continue east with a future still in front of you.</p><br />
      <div class="actions">
        <button id="menuBtn">[ MENU ]</button>
      </div>
    </section>
  `;

  root.querySelector("#menuBtn")?.addEventListener("click", () => {
    api.setScene("mainMenu");
  });
}