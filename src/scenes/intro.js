// Render Intro scene.
export function renderIntro(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>WAR NEVER CHANGES</h1><br />
      <img src="(0)Images/placeholder.png" alt="Intro Image" class="intro-image" width="100" height="100" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>The year is 2286, 5 years after the New California Republic successfully defeated the Caesar's Legion, forcing a tactical retreat to their home territory, Colorado. You are a nomad traveling east through the decrepit wastelands of the post-apocalyptic United States to reach North Carolina. As you make your trek through the bipolar climate of nuclear Colorado, you are taken prisoner by legion soldiers as you reach the once prosperous city of Denver now referred to as Dogtown. Upon arrival in a massive legion camp you are questioned and harassed about your reason for invading the closed borders of Colorado. unbeknownst to you the legion is a strategic move that closed its borders as an attempt to prevent NCR spies, as a result no civilian is allowed to enter or leave. Your story begins with an identification document in a rundown city known for its savage mongrels turned legion soldiers.</p><br />
      <div class="actions">
        <button id="continueBtn">[ CONTINUE ]</button>
      </div>
    </section>
  `;

  const continueBtn = root.querySelector("#continueBtn");

  continueBtn?.addEventListener("click", () => {
    api.patchStory({ introSeen: true }); // Mark intro complete.
    api.setScene("characterCreation"); // Move forward.
  });
}