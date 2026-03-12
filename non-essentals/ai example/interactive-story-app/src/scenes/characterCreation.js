const chardata = {
    name: "",
    sex: "",
    str: 5,
    per: 5,
    end: 5,
    cha: 5,
    int: 5,
    agi: 5,
    luc: 5,
    strmod: 0,
    permod: 0,
    endmod: 0,
    chamod: 0,
    intmod: 0,
    agimod: 0,
    lucmod: 0,
    level: 1,
    scorept: 3,
    xp: 0,
    hp: 10,
    sp: 10,
    ap: 10,
    hr: 5,
    ac: 10,
    radDC: 12,
    race: "human",
    background: "wastelander",
    traits: [],
    equipment: [],
};

function updateCharacterStats() {
    chardata.strmod = chardata.str - 5;
    chardata.permod = chardata.per - 5;
    chardata.endmod = chardata.end - 5;
    chardata.chamod = chardata.cha - 5;
    chardata.intmod = chardata.int - 5;
    chardata.agimod = chardata.agi - 5;
    chardata.lucmod = chardata.luc - 5;
    chardata.hp = chardata.endmod + 10;
    chardata.sp = chardata.agimod + 10;
    chardata.ap = chardata.agimod + 10;
    chardata.hr = (chardata.level + chardata.end) / 2;
    chardata.radDC = 12 - chardata.endmod;
}

function initializeCharacterCreation() {
    updateCharacterStats();
    renderCharacterCreation();
}

function renderCharacterCreation() {
    document.getElementById("name-input").value = chardata.name;
    document.getElementById("sex").textContent = "Sex: " + chardata.sex;
    document.getElementById("scorept").textContent = "Points Remaining: " + chardata.scorept;
    document.getElementById("strength").textContent = "Strength: " + chardata.str + " (Modifier: " + chardata.strmod + ")";
    document.getElementById("perception").textContent = "Perception: " + chardata.per + " (Modifier: " + chardata.permod + ")";
    document.getElementById("endurance").textContent = "Endurance: " + chardata.end + " (Modifier: " + chardata.endmod + ")";
    document.getElementById("charisma").textContent = "Charisma: " + chardata.cha + " (Modifier: " + chardata.chamod + ")";
    document.getElementById("intelligence").textContent = "Intelligence: " + chardata.int + " (Modifier: " + chardata.intmod + ")";
    document.getElementById("agility").textContent = "Agility: " + chardata.agi + " (Modifier: " + chardata.agimod + ")";
    document.getElementById("luck").textContent = "Luck: " + chardata.luc + " (Modifier: " + chardata.lucmod + ")";
}

document.getElementById("malebutton").addEventListener("click", function () {
    chardata.sex = "M";
    renderCharacterCreation();
});

document.getElementById("femalebutton").addEventListener("click", function () {
    chardata.sex = "F";
    renderCharacterCreation();
});

document.getElementById("name-input").addEventListener("input", function () {
    chardata.name = this.value;
    renderCharacterCreation();
});

document.getElementById("strincrease").addEventListener("click", function () {
    if (chardata.str < 10 && chardata.scorept > 0) {
        chardata.str++;
        chardata.scorept--;
        updateCharacterStats();
        renderCharacterCreation();
    }
});

document.getElementById("strdecrease").addEventListener("click", function () {
    if (chardata.str > 1) {
        chardata.str--;
        chardata.scorept++;
        updateCharacterStats();
        renderCharacterCreation();
    }
});

// Similar event listeners for other attributes (perception, endurance, charisma, intelligence, agility, luck) would go here.

initializeCharacterCreation();