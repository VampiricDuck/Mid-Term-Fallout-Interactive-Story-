

// Character Data //
let name0 = "";
let sex = "-";
let str = 5;
let per = 5;
let end = 5;
let cha = 5;
let int = 5;
let agi = 5;
let luc = 5;
let strmod = str - 5;
let permod = per - 5;
let endmod = end - 5;
let chamod = cha - 5;
let intmod = int - 5;
let agimod = agi - 5;
let lucmod = luc - 5;
let level = 1;
let scorept = 3;
let xp = 0;
let hp = endmod + 10;
let sp = agimod + 10;
let ap = agimod + 10;
let hr = (level + end) / 2;
let ac ;
// skills //
let barter = chamod;
let breach;
if (permod > chamod) {
    breach = permod;
} else {
    breach = chamod;
}
let energyweapons = permod;
let explosives = permod;
let guns = agimod;
let intimiation;
if (strmod > chamod) {
    intimidation = strmod;
} else {
    intimidation = chamod;
}
let medicine;
if (permod > intmod) {
    medicine = permod;
} else {
    medicine = intmod;
}
let melee = strmod;
let science = intmod;
let sneak = agimod;
let speech = chamod;
let survival = endmod;
let unarmed = strmod;
let luckbs = Math.floor(lucmod / 2);

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
        name: name0,
        sex: sex,
        hp: hp,
        sp: sp,
        ap: ap,
        hr: hr,
        ac: ac,
        str: "STRENGTH ",
        strnum: str,
        strmod: strmod,
        per: "PERSEPTION ",
        pernum: per,
        permod: permod,
        end: "ENDURENCE ",
        endnum: end,
        endmod: endmod,
        cha: "CHARISMA ",
        chanum: cha,
        chamod: chamod,
        int: "INTELIGENCE ",
        intnum: int,
        intmod: intmod,
        agi: "AGILITY ",
        aginum: agi,
        agimod: agimod,
        luc: "LUCK ",
        lucnum: luc,
        lucmod: lucmod,
        scorept: scorept,
        barter: barter,
        breach: breach,
        energyweapons: energyweapons,
        explosives: explosives,
        guns: guns,
        intimidation: intimidation,
        medicine: medicine,
        melee: melee,
        science: science,
        sneak: sneak,
        speech: speech,
        survival: survival,
        unarmed: unarmed
    },
];
function characterCreation(index) {
    document.getElementById("logo-v").src = pageNodes[index].img
    document.getElementById("scorept").textContent = "POINTS REMAINING: " + pageNodes[index].scorept
    document.getElementById("name").textContent = "NAME: "
    document.getElementById("sex").textContent = "SEX: " + pageNodes[index].sex + " >> "
    document.getElementById("level").textContent = "LEVEL: " + level
    document.getElementById("hp").textContent = "HIT POINTS: " + pageNodes[index].hp
    document.getElementById("sp").textContent = "STAMINA POINTS: " + pageNodes[index].sp
    document.getElementById("ap").textContent = "ACTION POINTS: " + pageNodes[index].ap
    document.getElementById("hr").textContent = "HEALING RATING: " + pageNodes[index].hr
    document.getElementById("ac").textContent = "ARMOR CLASS: " + pageNodes[index].ac
    document.getElementById("skills").textContent = "SKILLS: "
    document.getElementById("barter").textContent = "BARTER: " + pageNodes[index].barter
    document.getElementById("breach").textContent = "BREACH: " + pageNodes[index].breach
    document.getElementById("energyweapons").textContent = "ENERGY WEAPONS: " + pageNodes[index].energyweapons
    document.getElementById("explosives").textContent = "EXPLOSIVES: " + pageNodes[index].explosives
    document.getElementById("guns").textContent = "GUNS: " + pageNodes[index].guns
    document.getElementById("intimidation").textContent = "INTIMIDATION: " + pageNodes[index].intimidation
    document.getElementById("medicine").textContent = "MEDICINE: " + pageNodes[index].medicine
    document.getElementById("melee").textContent = "MELEE: " + pageNodes[index].melee
    document.getElementById("science").textContent = "SCIENCE: " + pageNodes[index].science
    document.getElementById("sneak").textContent = "SNEAK: " + pageNodes[index].sneak
    document.getElementById("speech").textContent = "SPEECH: " + pageNodes[index].speech
    document.getElementById("survival").textContent = "SURVIVAL: " + pageNodes[index].survival
    document.getElementById("unarmed").textContent = "UNARMED: " + pageNodes[index].unarmed

    if (strmod < 0) {
        document.getElementById("strength").textContent = pageNodes[index].str + pageNodes[index].strnum + " >> " + "Modifier " + pageNodes[index].strmod
    } else {
        document.getElementById("strength").textContent = pageNodes[index].str + pageNodes[index].strnum + " >> " + "Modifier " + "+" + pageNodes[index].strmod}
    if (permod < 0) {
        document.getElementById("perseption").textContent = pageNodes[index].per + pageNodes[index].pernum + " >> " + "Modifier " + pageNodes[index].permod
    } else {
        document.getElementById("perseption").textContent = pageNodes[index].per + pageNodes[index].pernum + " >> " + "Modifier " + "+" + pageNodes[index].permod}
    if (endmod < 0) {
        document.getElementById("endurance").textContent = pageNodes[index].end + pageNodes[index].endnum + " >> " + "Modifier " + pageNodes[index].endmod
    } else {
        document.getElementById("endurance").textContent = pageNodes[index].end + pageNodes[index].endnum + " >> " + "Modifier " + "+" + pageNodes[index].endmod}
    if (chamod < 0) {
        document.getElementById("charisma").textContent = pageNodes[index].cha + pageNodes[index].chanum + " >> " + "Modifier " + pageNodes[index].chamod
    } else {
        document.getElementById("charisma").textContent = pageNodes[index].cha + pageNodes[index].chanum + " >> " + "Modifier " + "+" + pageNodes[index].chamod}
    if (intmod < 0) {
        document.getElementById("intelligence").textContent = pageNodes[index].int + pageNodes[index].intnum + " >> " + "Modifier " + pageNodes[index].intmod
    } else {
        document.getElementById("intelligence").textContent = pageNodes[index].int + pageNodes[index].intnum + " >> " + "Modifier " + "+" + pageNodes[index].intmod}
    if (agimod < 0) {
        document.getElementById("agility").textContent = pageNodes[index].agi + pageNodes[index].aginum + " >> " + "Modifier " + pageNodes[index].agimod
    } else {
        document.getElementById("agility").textContent = pageNodes[index].agi + pageNodes[index].aginum + " >> " + "Modifier " + "+" + pageNodes[index].agimod}
    if (lucmod < 0) {
        document.getElementById("luck").textContent = pageNodes[index].luc + pageNodes[index].lucnum + " >> " + "Modifier " + pageNodes[index].lucmod
    } else {
        document.getElementById("luck").textContent = pageNodes[index].luc + pageNodes[index].lucnum + " >> " + "Modifier " + "+" + pageNodes[index].lucmod}
}
characterCreation(3)
document.getElementById("malebutton").addEventListener("click", function () {
    sex = "M"
    pageNodes[3].sex = sex
    characterCreation(3);
});
document.getElementById("femalebutton").addEventListener("click", function () {
    sex = "F"
    pageNodes[3].sex = sex
    characterCreation(3);
});
document.getElementById("name-input").addEventListener("input", function () {
    name0 = String(document.getElementById("name-input").value);
    pageNodes[3].name = name0;
    console.log(name0);
    characterCreation(3);
});
document.getElementById("strincrease").addEventListener("click", function () {
    if (str < 10 && scorept > 0) {
        str += 1;
        strmod = str - 5;
        scorept -= 1;
        if (strmod > chamod) {
            intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }
        melee = strmod + luckbs;
        unarmed = strmod + luckbs;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].melee = melee;
        pageNodes[3].unarmed = unarmed;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].strnum = str;
    pageNodes[3].strmod = strmod;
    characterCreation(3);
});
document.getElementById("strdecrease").addEventListener("click", function () {
    if (str > 1) {
        str -= 1;
        strmod = str - 5;
        scorept += 1;
        if (strmod > chamod) {
            intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }        
        melee = strmod + luckbs;
        unarmed = strmod + luckbs;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].melee = melee;
        pageNodes[3].unarmed = unarmed;
        pageNodes[3].scorept = scorept;
        pageNodes[3].strnum = str;
        pageNodes[3].strmod = strmod;
        characterCreation(3);
    }
});
document.getElementById("perincrease").addEventListener("click", function () {
    if (per < 10 && scorept > 0) {
        per += 1;
        permod = per - 5;
        scorept -= 1;
        if (permod > intmod) {
            breach = permod + luckbs;
        } else {            
            breach = intmod + luckbs;
        }
        if (permod > intmod) {
            medicine = permod + luckbs;
        } else {
            medicine = intmod + luckbs;
        }
        energyweapons = permod + luckbs;
        explosives = permod + luckbs;
        pageNodes[3].medicine = medicine;
        pageNodes[3].breach = breach;
        pageNodes[3].energyweapons = energyweapons;
        pageNodes[3].explosives = explosives;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].pernum = per;
    pageNodes[3].permod = permod;
    characterCreation(3);
});
document.getElementById("perdecrease").addEventListener("click", function () {
    if (per > 1) {
        per -= 1;
        permod = per - 5;
        scorept += 1;
        if (permod > intmod) {
            breach = permod + luckbs;
        } else {
            breach = intmod + luckbs;
        }
        if (permod > intmod) {
            medicine = permod + luckbs;
        } else {
            medicine = intmod + luckbs;
        }
        energyweapons = permod + luckbs;
        explosives = permod + luckbs;
        pageNodes[3].medicine = medicine;
        pageNodes[3].breach = breach;
        pageNodes[3].energyweapons = energyweapons;
        pageNodes[3].explosives = explosives;
        pageNodes[3].scorept = scorept;
        pageNodes[3].pernum = per;
        pageNodes[3].permod = permod;
        characterCreation(3);
    }
});
document.getElementById("endincrease").addEventListener("click", function () {
    if (end < 10 && scorept > 0) {
        end += 1;
        endmod = end - 5;
        scorept -= 1;
        hp = endmod + 10;
        hr = (level + end) / 2;
        survival = endmod + luckbs;
        pageNodes[3].survival = survival;
        pageNodes[3].hp = hp;
        pageNodes[3].hr = hr;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].endnum = end;
    pageNodes[3].endmod = endmod;
    characterCreation(3);
});
document.getElementById("enddecrease").addEventListener("click", function () {
    if (end > 1) {
        end -= 1;
        endmod = end - 5;
        scorept += 1;
        hp = endmod + 10;
        hr = (level + end) / 2;
        survival = endmod + luckbs;
        pageNodes[3].survival = survival;
        pageNodes[3].hp = hp;
        pageNodes[3].hr = hr;
        pageNodes[3].scorept = scorept;
        pageNodes[3].endnum = end;
        pageNodes[3].endmod = endmod;
        characterCreation(3);
    }
});
document.getElementById("chaincrease").addEventListener("click", function () {
    if (cha < 10 && scorept > 0) {
        cha += 1;
        chamod = cha - 5;
        scorept -= 1;
        barter = chamod + luckbs;
        if (strmod > chamod) {
            intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }
        speech = chamod + luckbs;
        pageNodes[3].barter = barter;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].speech = speech;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].chanum = cha;
    pageNodes[3].chamod = chamod;
    characterCreation(3);
});
document.getElementById("chadecrease").addEventListener("click", function () {
    if (cha > 1) {
        cha -= 1;
        chamod = cha - 5;
        scorept += 1;
        barter = chamod + luckbs;
        if (strmod > chamod) {
            intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }
        speech = chamod + luckbs;
        pageNodes[3].barter = barter;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].speech = speech;
        pageNodes[3].scorept = scorept;
        pageNodes[3].chanum = cha;
        pageNodes[3].chamod = chamod;
        characterCreation(3);
    }
});
document.getElementById("intincrease").addEventListener("click", function () {
    if (int < 10 && scorept > 0) {
        int += 1;
        intmod = int - 5;
        scorept -= 1;
        if (permod > intmod) {
            breach = permod + luckbs;
        } else {
            breach = intmod + luckbs;
        }
        if (permod > intmod) {
            medicine = permod + luckbs;
        } else {             
            medicine = intmod + luckbs;
        }
        science = intmod + luckbs;
        pageNodes[3].science = science;
        pageNodes[3].breach = breach;
        pageNodes[3].medicine = medicine;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].intnum = int;
    pageNodes[3].intmod = intmod;
    characterCreation(3);
});
document.getElementById("intdecrease").addEventListener("click", function () {
    if (int > 1) {
        int -= 1;
        intmod = int - 5;
        scorept += 1;
        if (permod > intmod) {
            breach = permod + luckbs;
        } else {             
            breach = intmod + luckbs;
        }
        if (permod > intmod) {
            medicine = permod + luckbs;
        } else {             
            medicine = intmod + luckbs;
        }
        science = intmod + luckbs;
        pageNodes[3].science = science;
        pageNodes[3].breach = breach;
        pageNodes[3].medicine = medicine;
        pageNodes[3].scorept = scorept;
        pageNodes[3].intnum = int;
        pageNodes[3].intmod = intmod;
        characterCreation(3);
    }
});
document.getElementById("agiincrease").addEventListener("click", function () {
    if (agi < 10 && scorept > 0) {
        agi += 1;
        agimod = agi - 5;
        scorept -= 1;
        sp = agimod + 10;
        ap = agimod + 10;
        guns = agimod + luckbs;
        sneak = agimod + luckbs;
        pageNodes[3].guns = guns;
        pageNodes[3].sneak = sneak;
        pageNodes[3].hp = hp;
        pageNodes[3].scorept = scorept;
        pageNodes[3].sp = sp;
        pageNodes[3].ap = ap;
    }
    pageNodes[3].aginum = agi;
    pageNodes[3].agimod = agimod;
    characterCreation(3);
});
document.getElementById("agidecrease").addEventListener("click", function () {
    if (agi > 1) {
        agi -= 1;
        agimod = agi - 5;
        scorept += 1;
        sp = agimod + 10;
        ap = agimod + 10;
        guns = agimod + luckbs;
        sneak = agimod + luckbs;
        pageNodes[3].guns = guns;
        pageNodes[3].sneak = sneak;
        pageNodes[3].hp = hp;
        pageNodes[3].sp = sp;
        pageNodes[3].ap = ap;
        pageNodes[3].scorept = scorept;
        pageNodes[3].aginum = agi;
        pageNodes[3].agimod = agimod;
        characterCreation(3);
    }
});
document.getElementById("lucincrease").addEventListener("click", function () {
    if (luc < 10 && scorept > 0) {
        luc += 1;
        lucmod = luc - 5;
        scorept -= 1;
        luckbs = Math.floor(lucmod / 2);
        barter = chamod + luckbs;
        if ( permod > intmod) {
             breach = permod + luckbs;
        } else {
             breach = intmod + luckbs;
        }
        energyweapons = permod + luckbs;
        explosives = permod + luckbs;
        guns = agimod + luckbs;
        if (strmod > chamod) {
             intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }
        if (permod > intmod) {
             medicine = permod + luckbs;
        } else {
            medicine = intmod + luckbs;
        }
        melee = strmod + luckbs;
        science = intmod + luckbs;
        sneak = agimod + luckbs;
        speech = chamod + luckbs;
        survival = endmod + luckbs;
        unarmed = strmod +luckbs;
        pageNodes[3].barter = barter;
        pageNodes[3].breach = breach;
        pageNodes[3].energyweapons = energyweapons;
        pageNodes[3].explosives = explosives;
        pageNodes[3].guns = guns;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].medicine = medicine;
        pageNodes[3].melee = melee;
        pageNodes[3].science = science;
        pageNodes[3].sneak = sneak;
        pageNodes[3].speech = speech;
        pageNodes[3].survival = survival;
        pageNodes[3].unarmed = unarmed;
        pageNodes[3].scorept = scorept;
    }
    pageNodes[3].lucnum = luc;
    pageNodes[3].lucmod = lucmod;
    characterCreation(3);
});
document.getElementById("lucdecrease").addEventListener("click", function () {
    if (luc > 1) {
        luc -= 1;
        lucmod = luc - 5;
        scorept += 1;
        luckbs = Math.ceil(lucmod / 2);
        barter = chamod + luckbs;
        if ( permod > intmod) {
             breach = permod + luckbs;
        } else {
             breach = intmod + luckbs;
        }
        energyweapons = permod + luckbs;
        explosives = permod + luckbs;
        guns = agimod + luckbs;
        if (strmod > chamod) {
             intimidation = strmod + luckbs;
        } else {
            intimidation = chamod + luckbs;
        }
        if (permod > intmod) {
             medicine = permod + luckbs;
        } else {
            medicine = intmod + luckbs;
        }
        melee = strmod + luckbs;
        science = intmod + luckbs;
        sneak = agimod + luckbs;
        speech = chamod + luckbs;
        survival = endmod + luckbs;
        unarmed = strmod +luckbs;
        pageNodes[3].barter = barter;
        pageNodes[3].breach = breach;
        pageNodes[3].energyweapons = energyweapons;
        pageNodes[3].explosives = explosives;
        pageNodes[3].guns = guns;
        pageNodes[3].intimidation = intimidation;
        pageNodes[3].medicine = medicine;
        pageNodes[3].melee = melee;
        pageNodes[3].science = science;
        pageNodes[3].sneak = sneak;
        pageNodes[3].speech = speech;
        pageNodes[3].survival = survival;
        pageNodes[3].unarmed = unarmed;
        pageNodes[3].scorept = scorept;
        pageNodes[3].lucnum = luc;
        pageNodes[3].lucmod = lucmod;
        characterCreation(3);
    }
});