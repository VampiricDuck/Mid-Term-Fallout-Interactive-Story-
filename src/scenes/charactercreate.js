import chardata, { recalcCharData } from "../data/characterdata.js";

const STARTER_LOADOUT = {
  inventory: [
    { id: "leather_armor", quantity: 1 },
    { id: "sharpened_pole", quantity: 1 },
    { id: "pistol_10mm", quantity: 1 },
    { id: "ammo_10mm", quantity: 10 },
    { id: "healing_powder", quantity: 1 }
  ],
  caps: 50
};

export function renderCharacterCreate(root, api) {
  root.innerHTML = `
    <section class="scene scene-character-create">
      <h1>What Makes You S.P.E.C.I.A.L.?</h1><br />
      <img src="(0)Images/charactercreate.png" alt="Character Creation Image" class="character-create-image" width="160" height="100" /><br /><br />
      -------------------------------------------------------<br /><br />
      <form id="charForm">
        <label id="sex">Sex: </label><input type="button" id="malebutton" value="M"><input type="button" id="femalebutton" value="F"><br />
        <label id="name">Name: </label><input type="text" id="name-input"><br />
        <label id="level">Level: </label><br />
        <label id="race">Race: </label><br />
        <label id="hp">Hit Points: </label><br />
        <label id="sp">Stamina Points: </label><br />
        <label id="ap">Action Points: </label><br />
        <label id="hr">Healing Rate: </label><br />
        <label id="ac">Armor Class: </label><br />
        <label id="karmacaps">Karma Caps: </label><br />
        <br /><br />
        <label id="scorept">Score Points: </label><br /><br />

        <div class="stat-row"><label id="strength">Strength: </label><input id="strincrease" type="button" value="ᐱ"><input id="strdecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="perseption">Perception: </label><input id="perincrease" type="button" value="ᐱ"><input id="perdecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="endurance">Endurance: </label><input id="endincrease" type="button" value="ᐱ"><input id="enddecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="charisma">Charisma: </label><input id="chaincrease" type="button" value="ᐱ"><input id="chadecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="intelligence">Intelligence: </label><input id="intincrease" type="button" value="ᐱ"><input id="intdecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="agility">Agility: </label><input id="agiincrease" type="button" value="ᐱ"><input id="agidecrease" type="button" value="ᐯ"></div>
        <div class="stat-row"><label id="luck">Luck: </label><input id="lucincrease" type="button" value="ᐱ"><input id="lucdecrease" type="button" value="ᐯ"></div>

        <br /><label id="skills">Skills: </label><br />
        <ul>
          <li><label id="barter">Barter: </label></li>
          <li><label id="breach">Breach: </label></li>
          <li><label id="explosives">Explosives: </label></li>
          <li><label id="guns">Guns: </label></li>
          <li><label id="intimidation">Intimidation: </label></li>
          <li><label id="medicine">Medicine: </label></li>
          <li><label id="melee">Melee: </label></li>
          <li><label id="science">Science: </label></li>
          <li><label id="sneak">Sneak: </label></li>
          <li><label id="speech">Speech: </label></li>
          <li><label id="survival">Survival: </label></li>
          <li><label id="unarmed">Unarmed: </label></li>
        </ul>
      </form>
      <div class="actions continue-row">
        <button id="continueBtn">[ CONTINUE ]</button>
      </div>
    </section>
  `;

  const $ = (id) => root.querySelector(id);

  function paint() {
    recalcCharData();
    // Character creation should always display full vitals at current max values.
    chardata.hp = chardata.hpMax ?? chardata.hp;
    chardata.sp = chardata.spMax ?? chardata.sp;
    const sign = (n) => `${n >= 0 ? "+" : ""}${n}`;

    $("#sex").textContent        = `Sex: ${chardata.sex}`;
    $("#level").textContent      = `Level: ${chardata.level}`;
    $("#race").textContent       = `Race: ${chardata.race}`;
    $("#hp").textContent         = `Hit Points: ${chardata.hp}`;
    $("#sp").textContent         = `Stamina Points: ${chardata.sp}`;
    $("#ap").textContent         = `Action Points: ${chardata.ap}`;
    $("#hr").textContent         = `Healing Rate: ${chardata.hr}`;
    $("#ac").textContent         = `Armor Class: ${chardata.ac}`;
    $("#karmacaps").textContent  = `Karma Caps: ${chardata.karmaCapsAvailable}/${chardata.karmaCapsMax}`;
    $("#scorept").textContent    = `Score Points: ${chardata.scorept}`;

    $("#strength").textContent     = `Strength: ${chardata.str} >> Proficiency ${sign(chardata.strmod)}`;
    $("#perseption").textContent   = `Perception: ${chardata.per} >> Proficiency ${sign(chardata.permod)}`;
    $("#endurance").textContent    = `Endurance: ${chardata.end} >> Proficiency ${sign(chardata.endmod)}`;
    $("#charisma").textContent     = `Charisma: ${chardata.cha} >> Proficiency ${sign(chardata.chamod)}`;
    $("#intelligence").textContent = `Intelligence: ${chardata.int} >> Proficiency ${sign(chardata.intmod)}`;
    $("#agility").textContent      = `Agility: ${chardata.agi} >> Proficiency ${sign(chardata.agimod)}`;
    $("#luck").textContent         = `Luck: ${chardata.luc} >> Proficiency ${sign(chardata.lucmod)}`;

    $("#barter").textContent       = `Barter: ${sign(chardata.barter)}`;
    $("#breach").textContent       = `Breach: ${sign(chardata.breach)}`;
    $("#explosives").textContent   = `Explosives: ${sign(chardata.explosives)}`;
    $("#guns").textContent        = `Guns: ${sign(chardata.guns)}`;
    $("#intimidation").textContent = `Intimidation: ${sign(chardata.intimidation)}`;
    $("#medicine").textContent     = `Medicine: ${sign(chardata.medicine)}`;
    $("#melee").textContent        = `Melee: ${sign(chardata.melee)}`;
    $("#science").textContent      = `Science: ${sign(chardata.science)}`;
    $("#sneak").textContent        = `Sneak: ${sign(chardata.sneak)}`;
    $("#speech").textContent       = `Speech: ${sign(chardata.speech)}`;
    $("#survival").textContent     = `Survival: ${sign(chardata.survival)}`;
    $("#unarmed").textContent      = `Unarmed: ${sign(chardata.unarmed)}`;
  }

  function adjustStat(key, delta) {
    if (delta > 0) {
      if (chardata.scorept <= 0 || chardata[key] >= 10) return;
      chardata[key] += 1;
      chardata.scorept -= 1;
    } else {
      if (chardata[key] <= 1) return;
      chardata[key] -= 1;
      chardata.scorept += 1;
    }
    paint();
  }

  $("#malebutton")?.addEventListener("click", () => { chardata.sex = "M"; paint(); });
  $("#femalebutton")?.addEventListener("click", () => { chardata.sex = "F"; paint(); });

  $("#strincrease")?.addEventListener("click", () => adjustStat("str", +1));
  $("#strdecrease")?.addEventListener("click", () => adjustStat("str", -1));
  $("#perincrease")?.addEventListener("click", () => adjustStat("per", +1));
  $("#perdecrease")?.addEventListener("click", () => adjustStat("per", -1));
  $("#endincrease")?.addEventListener("click", () => adjustStat("end", +1));
  $("#enddecrease")?.addEventListener("click", () => adjustStat("end", -1));
  $("#chaincrease")?.addEventListener("click", () => adjustStat("cha", +1));
  $("#chadecrease")?.addEventListener("click", () => adjustStat("cha", -1));
  $("#intincrease")?.addEventListener("click", () => adjustStat("int", +1));
  $("#intdecrease")?.addEventListener("click", () => adjustStat("int", -1));
  $("#agiincrease")?.addEventListener("click", () => adjustStat("agi", +1));
  $("#agidecrease")?.addEventListener("click", () => adjustStat("agi", -1));
  $("#lucincrease")?.addEventListener("click", () => adjustStat("luc", +1));
  $("#lucdecrease")?.addEventListener("click", () => adjustStat("luc", -1));

  root.querySelector("#continueBtn")?.addEventListener("click", () => {
    chardata.name = ($("#name-input")?.value || "").trim() || "Wanderer";
    chardata.background = "wastelander";
    recalcCharData();
    chardata.hp = chardata.hpMax ?? chardata.hp;
    chardata.sp = chardata.spMax ?? chardata.sp;

    const mergedPlayer = {
      ...structuredClone(chardata),
      inventory: structuredClone(STARTER_LOADOUT.inventory),
      equipment: [],
      perks: {},
      xp: 0,
      level: 1,
      caps: STARTER_LOADOUT.caps
    };

    api.patchPlayer(mergedPlayer);
    api.patchStory({ pendingScene: null, location: "dogtownIntro" });
    api.setScene("dogtownIntro");
  });

  paint();
}

