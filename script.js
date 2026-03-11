
// Character Data //
const chardata = {};    
chardata.name = "-";
chardata.sex = "-";
chardata.str = 5;
chardata.per = 5;
chardata.end = 5;
chardata.cha = 5;
chardata.int = 5;
chardata.agi = 5;
chardata.luc = 5;
chardata.strmod = chardata.str - 5;
chardata.permod = chardata.per - 5;
chardata.endmod = chardata.end - 5;
chardata.chamod = chardata.cha - 5;
chardata.intmod = chardata.int - 5;
chardata.agimod = chardata.agi - 5;
chardata.lucmod = chardata.luc - 5;
chardata.level = 1;
chardata.scorept = 3;
chardata.xp = 0;
chardata.hp = chardata.endmod + 10;
chardata.sp = chardata.agimod + 10;
chardata.ap = chardata.agimod + 10;
chardata.hr = (chardata.level + chardata.end) / 2;
chardata.ac = 10;
chardata.radDC = 12 - chardata.endmod;
chardata.race = "human";
chardata.background = "wastelander";
chardata.traits = [
    {id: "1", name: "Adventurers Instinct", desc: "You know the best places to scavenge and where loot is often hiding. Whenever you roll a Luck ability check to search for items, you have advantage. However, any weapons or armor you find have an additional level of decay."},
    {id: "2", name: "Resourceful", desc: "You gain one extra Karma Cap"},
    {id: "3", name: "Unexposed", desc: "You have disadvantage on all Radiation checks."},
];
chardata.equipment = [
        {id: "1", name: "leather armor", type: "armor", AC: 11, DT: 1, STRreq: 1, Decay: 0, amount: 1},
        {id: "2", name: "sharpened pole", type: "melee weapon", AP: 5, damage: "1d4", CriticalHit: "20, x3",properties: ["Fragile", "Reach", "Thrown", "x6/x10"], STRreq: 1, Decay: 0, amount: 1},
        {id: "3", name: "10mm pistol", type: "ranged weapon", AP: 5, damage: "2d4", CriticalHit: "19, 1d4", ammo: "10mm, 12 rounds", properties: ["sturdy", "kickback"], STRreq: 4, Decay: 0, amount: 1},
        {id: "4", name: "10mm ammo", type: "ammo", amount: 10},
        {id: "5", name: "healing powder", type: "consumable", AP: 6, HPrestor: Math.floor(chardata.hr / 2), amount: 1},
        {id: "6", name: "caps", type: "currency", amount: 50},
];
// skills //
chardata.barter = chardata.chamod;
chardata.breach = function() {
    if (chardata.permod > chardata.chamod) {
        return chardata.permod;
    } else {
        return chardata.chamod;
}
};
chardata.crafting = chardata.intmod;
chardata.energyweapons = chardata.permod;
chardata.explosives = chardata.permod;
chardata.guns = chardata.agimod;
chardata.intimidation = function() {
    if (chardata.strmod > chardata.chamod) {
        return chardata.strmod;
        } else {
            return chardata.chamod;
        }
    };
chardata.medicine = function() {
        if (chardata.permod > chardata.intmod) {
            return chardata.permod;
        } else {
            return chardata.intmod;
        }
    };
chardata.melee = chardata.strmod;
chardata.science = chardata.intmod;
chardata.sneak = chardata.agimod;
chardata.speech = chardata.chamod;
chardata.survival = chardata.endmod;
chardata.unarmed = chardata.strmod,
chardata.luckbs = Math.floor(chardata.lucmod / 2)

// constant holding the nodes //
const pageNodes = [
    combat0 = {

    },
    menu1 = {

    },
    preintro2 = {

    },
    chrcreate3 = {
        img: "Images/placeholder.png",
        alt: "placeholder",
        imgwidth: "740",
        imghight: "729",
        title: "what makes you s.p.e.c.i.a.l.?",
    },
];

// items and equipment found in game //
const itemrep = [
    items= {

    }
];
function characterCreation(index) {
    document.getElementById("logo-v").src = pageNodes[index].img
    document.getElementById("scorept").textContent = "POINTS REMAINING: " + chardata.scorept
    document.getElementById("name").textContent = "NAME: "
    document.getElementById("sex").textContent = "SEX: " + chardata.sex + " >> "
    document.getElementById("level").textContent = "LEVEL: " + chardata.level
    document.getElementById("hp").textContent = "HIT POINTS: " + chardata.hp
    document.getElementById("sp").textContent = "STAMINA POINTS: " + chardata.sp
    document.getElementById("ap").textContent = "ACTION POINTS: " + chardata.ap
    document.getElementById("hr").textContent = "HEALING RATING: " + chardata.hr
    document.getElementById("ac").textContent = "ARMOR CLASS: " + chardata.ac
    document.getElementById("skills").textContent = "SKILLS: "
    if (chardata.barter < 0) {
        document.getElementById("barter").textContent = "BARTER: " + chardata.barter
    } else {
        document.getElementById("barter").textContent = "BARTER: " + "+" + chardata.barter}
    if (chardata.breach < 0) {
        document.getElementById("breach").textContent = "BREACH: " + chardata.breach()
    } else {
    document.getElementById("breach").textContent = "BREACH: " + "+" + chardata.breach}
    if (chardata.crafting < 0) {
        document.getElementById("crafting").textContent = "CRAFTING: " + chardata.crafting
    } else {
        document.getElementById("crafting").textContent = "CRAFTING: " + "+" + chardata.crafting}
    if (chardata.energyweapons < 0) {
        document.getElementById("energyweapons").textContent = "ENERGY WEAPONS: " + chardata.energyweapons
    } else {
        document.getElementById("energyweapons").textContent = "ENERGY WEAPONS: " + "+" + chardata.energyweapons}
    if (chardata.explosives < 0) {
        document.getElementById("explosives").textContent = "EXPLOSIVES: " + chardata.explosives
    } else {
        document.getElementById("explosives").textContent = "EXPLOSIVES: " + "+" + chardata.explosives}
    if (chardata.guns < 0) {
        document.getElementById("guns").textContent = "GUNS: " + chardata.guns
    } else {
        document.getElementById("guns").textContent = "GUNS: " + "+" + chardata.guns}
    if (chardata.intimidation < 0) {
        document.getElementById("intimidation").textContent = "INTIMIDATION: " + chardata.intimidation
    } else {
        document.getElementById("intimidation").textContent = "INTIMIDATION: " + "+" + chardata.intimidation}
    if (chardata.medicine < 0) {
        document.getElementById("medicine").textContent = "MEDICINE: " + chardata.medicine
    } else {
        document.getElementById("medicine").textContent = "MEDICINE: " + "+" + chardata.medicine}
    if (chardata.melee < 0) {
        document.getElementById("melee").textContent = "MELEE: " + chardata.melee
    } else {
        document.getElementById("melee").textContent = "MELEE: " + "+" + chardata.melee}
    if (chardata.science < 0) {
        document.getElementById("science").textContent = "SCIENCE: " + chardata.science
    } else {
        document.getElementById("science").textContent = "SCIENCE: " + "+" + chardata.science}
    if (chardata.sneak < 0) {
        document.getElementById("sneak").textContent = "SNEAK: " + chardata.sneak
    } else {
        document.getElementById("sneak").textContent = "SNEAK: " + "+" + chardata.sneak}
    if (chardata.speech < 0) {
        document.getElementById("speech").textContent = "SPEECH: " + chardata.speech
    } else {
        document.getElementById("speech").textContent = "SPEECH: " + "+" + chardata.speech}
    if (chardata.survival < 0) {
        document.getElementById("survival").textContent = "SURVIVAL: " + chardata.survival
    } else {
        document.getElementById("survival").textContent = "SURVIVAL: " + "+" + chardata.survival}
    if (chardata.unarmed < 0) {
        document.getElementById("unarmed").textContent = "UNARMED: " + chardata.unarmed
    } else {
        document.getElementById("unarmed").textContent = "UNARMED: " + "+" + chardata.unarmed}
    if (chardata.strmod < 0) {
        document.getElementById("strength").textContent = "STRENGTH: " + chardata.str + " >> " + "Modifier " + chardata.strmod
    } else {
        document.getElementById("strength").textContent = "STRENGTH: " + chardata.str + " >> " + "Modifier " + "+" + chardata.strmod}
    if (chardata.permod < 0) {
        document.getElementById("perseption").textContent = "PERCEPTION: " + chardata.per + " >> " + "Modifier " + chardata.permod
    } else {
        document.getElementById("perseption").textContent = "PERCEPTION: " + chardata.per + " >> " + "Modifier " + "+" + chardata.permod}
    if (chardata.endmod < 0) {
        document.getElementById("endurance").textContent = "ENDURANCE: " + chardata.end + " >> " + "Modifier " + chardata.endmod
    } else {
        document.getElementById("endurance").textContent = "ENDURANCE: " + chardata.end + " >> " + "Modifier " + "+" + chardata.endmod}
    if (chardata.chamod < 0) {
        document.getElementById("charisma").textContent = "CHARISMA: " + chardata.cha + " >> " + "Modifier " + chardata.chamod
    } else {
        document.getElementById("charisma").textContent = "CHARISMA: " + chardata.cha + " >> " + "Modifier " + "+" + chardata.chamod}
    if (chardata.intmod < 0) {
        document.getElementById("intelligence").textContent = "INTELLIGENCE: " + chardata.int + " >> " + "Modifier " + chardata.intmod
    } else {
        document.getElementById("intelligence").textContent = "INTELLIGENCE: " + chardata.int + " >> " + "Modifier " + "+" + chardata.intmod}
    if (chardata.agimod < 0) {
        document.getElementById("agility").textContent = "AGILITY: " + chardata.agi + " >> " + "Modifier " + chardata.agimod
    } else {
        document.getElementById("agility").textContent = "AGILITY: " + chardata.agi + " >> " + "Modifier " + "+" + chardata.agimod}
    if (chardata.lucmod < 0) {
        document.getElementById("luck").textContent = "LUCK: " + chardata.luc + " >> " + "Modifier " + chardata.lucmod
    } else {
        document.getElementById("luck").textContent = "LUCK: " + chardata.luc + " >> " + "Modifier " + "+" + chardata.lucmod}
}
characterCreation(3)
document.getElementById("malebutton").addEventListener("click", function () {
    sex = "M"
    chardata.sex = sex
    characterCreation(3);
});
document.getElementById("femalebutton").addEventListener("click", function () {
    sex = "F"
    chardata.sex = sex
    characterCreation(3);
});
document.getElementById("name-input").addEventListener("input", function () {
    name0 = String(document.getElementById("name-input").value);
    chardata.name = name0;
    console.log(name0);
    characterCreation(3);
});
document.getElementById("strincrease").addEventListener("click", function () {
    if (chardata.str < 10 && chardata.scorept > 0) {
        chardata.str += 1;
        chardata.strmod = chardata.str - 5;
        chardata.scorept -= 1;
        if (chardata.strmod > chardata.chamod) {
            chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        chardata.melee = chardata.strmod + chardata.luckbs;
        chardata.unarmed = chardata.strmod + chardata.luckbs;
        chardata.scorept = chardata.scorept;
    }
    chardata.strnum = chardata.str;
    chardata.strmod = chardata.strmod;
    characterCreation(3);
});
document.getElementById("strdecrease").addEventListener("click", function () {
    if (chardata.str > 1) {
        chardata.str -= 1;
        chardata.strmod = chardata.str - 5;
        chardata.scorept += 1;
        if (chardata.strmod > chardata.chamod) {
            chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        chardata.melee = chardata.strmod + chardata.luckbs;
        chardata.unarmed = chardata.strmod + chardata.luckbs;
        chardata.intimidation = chardata.intimidation;
        chardata.melee = chardata.melee;
        chardata.unarmed = chardata.unarmed;
        chardata.scorept = chardata.scorept;
        chardata.strnum = chardata.str;
        chardata.strmod = chardata.strmod;
        characterCreation(3);
    }
});
document.getElementById("perincrease").addEventListener("click", function () {
    if (chardata.per < 10 && chardata.scorept > 0) {
        chardata.per += 1;
        chardata.permod = chardata.per - 5;
        chardata.scorept -= 1;
        if (chardata.permod > chardata.intmod) {
            chardata.breach = chardata.permod + chardata.luckbs;
        } else {            
            chardata.breach = chardata.intmod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
            chardata.medicine = chardata.permod + chardata.luckbs;
        } else {
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.energyweapons = chardata.permod + chardata.luckbs;
        chardata.explosives = chardata.permod + chardata.luckbs;
        chardata.medicine = chardata.medicine;
        chardata.breach = chardata.breach;
        chardata.energyweapons = chardata.energyweapons;
        chardata.explosives = chardata.explosives;
        chardata.scorept = chardata.scorept;
    }
    chardata.pernum = chardata.per;
    chardata.permod = chardata.permod;
    characterCreation(3);
});
document.getElementById("perdecrease").addEventListener("click", function () {
    if (chardata.per > 1) {
        chardata.per -= 1;
        chardata.permod = chardata.per - 5;
        chardata.scorept += 1;
        if (chardata.permod > chardata.intmod) {
            chardata.breach = chardata.permod + chardata.luckbs;
        } else {
            chardata.breach = chardata.intmod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
            chardata.medicine = chardata.permod + chardata.luckbs;
        } else {
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.energyweapons = chardata.permod + chardata.luckbs;
        chardata.explosives = chardata.permod + chardata.luckbs;
        chardata.medicine = chardata.medicine;
        chardata.breach = chardata.breach;
        chardata.energyweapons = chardata.energyweapons;
        chardata.explosives = chardata.explosives;
        chardata.scorept = chardata.scorept;
        chardata.pernum = chardata.per;
        chardata.permod = chardata.permod;
        characterCreation(3);
    }
});
document.getElementById("endincrease").addEventListener("click", function () {
    if (chardata.end < 10 && chardata.scorept > 0) {
        chardata.end += 1;
        chardata.endmod = chardata.end - 5;
        chardata.scorept -= 1;
        chardata.hp = chardata.endmod + 10;
        chardata.hr = (chardata.level + chardata.end) / 2;
        chardata.radDC = 12 - chardata.endmod;
        chardata.survival = chardata.endmod + chardata.luckbs;
        chardata.hp = chardata.hp;
        chardata.hr = chardata.hr;
        chardata.scorept = chardata.scorept;
    }
    chardata.endnum = chardata.end;
    chardata.endmod = chardata.endmod;
    characterCreation(3);
});
document.getElementById("enddecrease").addEventListener("click", function () {
    if (chardata.end > 1) {
        chardata.end -= 1;
        chardata.endmod = chardata.end - 5;
        chardata.scorept += 1;
        chardata.hp = chardata.endmod + 10;
        chardata.hr = (chardata.level + chardata.end) / 2;
        chardata.radDC = 12 - chardata.endmod;
        chardata.survival = chardata.endmod + chardata.luckbs;
        chardata.survival = chardata.survival;
        chardata.hp = chardata.hp;
        chardata.hr = chardata.hr;
        chardata.scorept = chardata.scorept;
        chardata.endnum = chardata.end;
        chardata.endmod = chardata.endmod;
        characterCreation(3);
    }
});
document.getElementById("chaincrease").addEventListener("click", function () {
    if (chardata.cha < 10 && chardata.scorept > 0) {
        chardata.cha += 1;
        chardata.chamod = chardata.cha - 5;
        chardata.scorept -= 1;
        chardata.barter = chardata.chamod + chardata.luckbs;
        if (chardata.strmod > chardata.chamod) {
            chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        chardata.speech = chardata.chamod + chardata.luckbs;
        chardata.barter = chardata.barter;
        chardata.intimidation = chardata.intimidation;
        chardata.speech = chardata.speech;
        chardata.scorept = chardata.scorept;
    }
    chardata.chanum = chardata.cha;
    chardata.chamod = chardata.chamod;
    characterCreation(3);
});
document.getElementById("chadecrease").addEventListener("click", function () {
    if (chardata.cha > 1) {
        chardata.cha -= 1;
        chardata.chamod = chardata.cha - 5;
        chardata.scorept += 1;
        chardata.barter = chardata.chamod + chardata.luckbs;
        if (chardata.strmod > chardata.chamod) {
            chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        chardata.speech = chardata.chamod + chardata.luckbs;
        chardata.barter = chardata.barter;
        chardata.intimidation = chardata.intimidation;
        chardata.speech = chardata.speech;
        chardata.scorept = chardata.scorept;
        chardata.chanum = chardata.cha;
        chardata.chamod = chardata.chamod;
        characterCreation(3);
    }
});
document.getElementById("intincrease").addEventListener("click", function () {
    if (chardata.int < 10 && chardata.scorept > 0) {
        chardata.int += 1;
        chardata.intmod = chardata.int - 5;
        chardata.scorept -= 1;
        chardata.crafting = chardata.intmod + chardata.luckbs;
        if (chardata.permod > chardata.intmod) {
            chardata.breach = chardata.permod + chardata.luckbs;
        } else {
            chardata.breach = chardata.intmod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
            chardata.medicine = chardata.permod + chardata.luckbs;
        } else {             
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.science = chardata.intmod + chardata.luckbs;
        chardata.crafting = chardata.crafting;
        chardata.science = chardata.science;
        chardata.breach = chardata.breach;
        chardata.medicine = chardata.medicine;
        chardata.scorept = chardata.scorept;
    }
    chardata.intnum = chardata.int;
    chardata.intmod = chardata.intmod;
    characterCreation(3);
});
document.getElementById("intdecrease").addEventListener("click", function () {
    if (chardata.int > 1) {
        chardata.int -= 1;
        chardata.intmod = chardata.int - 5;
        chardata.scorept += 1;
        chardata.crafting = chardata.intmod + chardata.luckbs;
        if (chardata.permod > chardata.intmod) {
            chardata.breach = chardata.permod + chardata.luckbs;
        } else {             
            chardata.breach = chardata.intmod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
            chardata.medicine = chardata.permod + chardata.luckbs;
        } else {             
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.science = chardata.intmod + chardata.luckbs;
        chardata.crafting = chardata.crafting;
        chardata.science = chardata.science;
        chardata.breach = chardata.breach;
        chardata.medicine = chardata.medicine;
        chardata.scorept = chardata.scorept;
        chardata.intnum = chardata.int;
        chardata.intmod = chardata.intmod;
        characterCreation(3);
    }
});
document.getElementById("agiincrease").addEventListener("click", function () {
    if (chardata.agi < 10 && chardata.scorept > 0) {
        chardata.agi += 1;
        chardata.agimod = chardata.agi - 5;
        chardata.scorept -= 1;
        chardata.sp = chardata.agimod + 10;
        chardata.ap = chardata.agimod + 10;
        chardata.guns = chardata.agimod + chardata.luckbs;
        chardata.sneak = chardata.agimod + chardata.luckbs;
        chardata.hp = chardata.hp;
        chardata.scorept = chardata.scorept;
        chardata.sp = chardata.sp;
        chardata.ap = chardata.ap;
    }
    chardata.aginum = chardata.agi;
    chardata.agimod = chardata.agimod;
    characterCreation(3);
});
document.getElementById("agidecrease").addEventListener("click", function () {
    if (chardata.agi > 1) {
        chardata.agi -= 1;
        chardata.agimod = chardata.agi - 5;
        chardata.scorept += 1;
        chardata.sp = chardata.agimod + 10;
        chardata.ap = chardata.agimod + 10;
        chardata.guns = chardata.agimod + chardata.luckbs;
        chardata.sneak = chardata.agimod + chardata.luckbs;
        chardata.hp = chardata.hp;
        chardata.sp = chardata.sp;
        chardata.ap = chardata.ap;
        chardata.scorept = chardata.scorept;
        chardata.aginum = chardata.agi;
        chardata.agimod = chardata.agimod;
        characterCreation(3);
    }
});
document.getElementById("lucincrease").addEventListener("click", function () {
    if (chardata.luc < 10 && chardata.scorept > 0) {
        chardata.luc += 1;
        chardata.lucmod = chardata.luc - 5;
        chardata.scorept -= 1;
        chardata.luckbs = Math.floor(chardata.lucmod / 2);
        chardata.barter = chardata.chamod + chardata.luckbs;
        if ( chardata.permod > chardata.intmod) {
             chardata.breach = chardata.permod + chardata.luckbs;
        } else {
             chardata.breach = chardata.intmod + chardata.luckbs;
        }
        chardata.energyweapons = chardata.permod + chardata.luckbs;
        chardata.explosives = chardata.permod + chardata.luckbs;
        chardata.guns = chardata.agimod + chardata.luckbs;
        chardata.crafting = chardata.intmod + chardata.luckbs;
        if (chardata.strmod > chardata.chamod) {
             chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
             chardata.medicine = chardata.permod + chardata.luckbs;
        } else {
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.melee = chardata.strmod + chardata.luckbs;
        chardata.science = chardata.intmod + chardata.luckbs;
        chardata.sneak = chardata.agimod + chardata.luckbs;
        chardata.speech = chardata.chamod + chardata.luckbs;
        chardata.survival = chardata.endmod + chardata.luckbs;
        chardata.unarmed = chardata.strmod +chardata.luckbs;
        chardata.crafting = chardata.crafting;
        chardata.barter = chardata.barter;
        chardata.breach = chardata.breach;
        chardata.energyweapons = chardata.energyweapons;
        chardata.explosives = chardata.explosives;
        chardata.guns = chardata.guns;
        chardata.intimidation = chardata.intimidation;
        chardata.medicine = chardata.medicine;
        chardata.melee = chardata.melee;
        chardata.science = chardata.science;
        chardata.sneak = chardata.sneak;
        chardata.speech = chardata.speech;
        chardata.survival = chardata.survival;
        chardata.unarmed = chardata.unarmed;
        chardata.scorept = chardata.scorept;
    }
    chardata.lucnum = chardata.luc;
    chardata.lucmod = chardata.lucmod;
    characterCreation(3);
});
document.getElementById("lucdecrease").addEventListener("click", function () {
    if (chardata.luc > 1) {
        chardata.luc -= 1;
        chardata.lucmod = chardata.luc - 5;
        chardata.scorept += 1;
        chardata.luckbs = Math.ceil(chardata.lucmod / 2);
        chardata.barter = chardata.chamod + chardata.luckbs;
        if ( chardata.permod > chardata.intmod) {
             chardata.breach = chardata.permod + chardata.luckbs;
        } else {
             chardata.breach = chardata.intmod + chardata.luckbs;
        }
        chardata.energyweapons = chardata.permod + chardata.luckbs;
        chardata.explosives = chardata.permod + chardata.luckbs;
        chardata.guns = chardata.agimod + chardata.luckbs;
        if (chardata.strmod > chardata.chamod) {
             chardata.intimidation = chardata.strmod + chardata.luckbs;
        } else {
            chardata.intimidation = chardata.chamod + chardata.luckbs;
        }
        if (chardata.permod > chardata.intmod) {
             chardata.medicine = chardata.permod + chardata.luckbs;
        } else {
            chardata.medicine = chardata.intmod + chardata.luckbs;
        }
        chardata.melee = chardata.strmod + chardata.luckbs;
        chardata.science = chardata.intmod + chardata.luckbs;
        chardata.sneak = chardata.agimod + chardata.luckbs;
        chardata.speech = chardata.chamod + chardata.luckbs;
        chardata.survival = chardata.endmod + chardata.luckbs;
        chardata.unarmed = chardata.strmod + chardata.luckbs;
        chardata.crafting = chardata.intmod + chardata.luckbs;
        chardata.barter = chardata.chamod + chardata.luckbs;
        chardata.breach = chardata.permod + chardata.luckbs;
        chardata.guns = chardata.agimod + chardata.luckbs;
        chardata.intimidation = chardata.strmod + chardata.luckbs;
        chardata.medicine = chardata.permod + chardata.luckbs;
        chardata.melee = chardata.strmod + chardata.luckbs;
        chardata.science = chardata.intmod + chardata.luckbs;
        chardata.sneak = chardata.agimod + chardata.luckbs;
        chardata.speech = chardata.chamod + chardata.luckbs;
        chardata.survival = chardata.endmod + chardata.luckbs;
        chardata.unarmed = chardata.strmod + chardata.luckbs;
        chardata.scorept = chardata.scorept;
        chardata.lucnum = chardata.luc;
        chardata.lucmod = chardata.lucmod;
        characterCreation(3);
    }
});