// Render Intro scene.
export function renderIntro(root, api) {
  root.innerHTML = `
    <section class="scene scene-intro">
      <h1>WAR NEVER CHANGES</h1><br />
      <img src="(0)Images/placeholder.png" alt="Intro Image" class="intro-image" width="100" height="100" /><br /><br />
      -------------------------------------------------------<br /><br />
      <p>The year is 2286, 5 years after the New California Republic successfully defeated the Caesar's Legion, forcing a tactical retreat to their home territory, Colorado. You are a nomad traveling east through the decrepit wastelands of the post-apocalyptic United States to reach North Carolina. As you make your trech through the bipolar climat of nuclear calorado, you are taken prisoner by legion solgiers as you reach the once prosperous city of denver now refered to as Dogtown. opon arivel in a massive legion camp you are questioned and harased about your reason for invading the closed borders of colarodo. unbenounsed to you the legion is a stratagisic move closed its borders as an attempt to prevent NCR spys, as a result no civilion is alowed to enter or leave. your story begins with a identificaiton document in a rundown city known for its savege mongrals turned legion solgiers.</p><br />
      <div class="actions">
        <button id="continueBtn">[ CONTINUE ]</button>
      </div>
    </section>
  `;

  const continueBtn = root.querySelector("#continueBtn");

  continueBtn?.addEventListener("click", () => {
    api.patchStory({ introSeen: true }); // Mark intro complete.
//    api.setScene("characterCreation"); // Move forward.
  });
}