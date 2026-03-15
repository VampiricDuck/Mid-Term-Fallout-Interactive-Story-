export function renderbadend(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>AMBUSH</h1><br />
      <img src="(0)Images/badend.png" alt="Bad End Image" class="intro-image" width="320" height="240" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>You leave Colorado without real protection. A few miles past Boulder, Legion scouts fall on you from the roadside ruins. The beating is fast, the sand is cold, and your story ends in a ditch that nobody will ever mark.</p><br />
      <div class="actions">
        <button id="menuBtn">[ MENU ]</button>
      </div>
    </section>
  `;

  root.querySelector("#menuBtn")?.addEventListener("click", () => {
    api.setScene("mainMenu");
  });
}