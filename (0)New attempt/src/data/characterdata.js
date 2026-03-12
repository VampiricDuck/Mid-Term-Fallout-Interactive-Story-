// initial character data, will be updated as the player changes their stats and equipment. This is also where the character's skills are calculated based on their stats.
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
chardata.luckbs = Math.floor(chardata.lucmod / 2)
chardata.barter = chardata.chamod;
chardata.breach = function() {
    if (chardata.permod > chardata.chamod) {
        return chardata.permod + chardata.luckbs;
    } else {
        return chardata.chamod + chardata.luckbs;
}
};
chardata.crafting = chardata.intmod;
chardata.energyweapons = chardata.permod;
chardata.explosives = chardata.permod;
chardata.guns = chardata.agimod;
chardata.intimidation = function() {
    if (chardata.strmod > chardata.chamod) {
            return chardata.strmod + chardata.luckbs;
        } else {
            return chardata.chamod + chardata.luckbs;
        }
    };
chardata.medicine = function() {
        if (chardata.permod > chardata.intmod) {
            return chardata.permod + chardata.luckbs;
        } else {
            return chardata.intmod + chardata.luckbs;
        }
    };
chardata.melee = chardata.strmod;
chardata.science = chardata.intmod;
chardata.sneak = chardata.agimod;
chardata.speech = chardata.chamod;
chardata.survival = chardata.endmod;
chardata.unarmed = chardata.strmod;