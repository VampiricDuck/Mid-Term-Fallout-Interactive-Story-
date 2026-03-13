import { createEmptySkillBonuses, recalculatePlayerStats } from "../utils/leveling.js";

// initial character data, will be updated as the player changes their stats and equipment.
const chardata = {
  name: "",
  sex: "-",
  str: 5,
  per: 5,
  end: 5,
  cha: 5,
  int: 5,
  agi: 5,
  luc: 5,
  level: 1,
  scorept: 3,
  xp: 0,
  race: "human",
  background: "wastelander",
  critRequirement: 20,
  karmaCapsMax: 1,
  karmaCapsFlipped: 0,
  karmaCapsAvailable: 1,
  equipment: [],
  skillBonuses: createEmptySkillBonuses(),
  perkPointsSpent: 0
};

export function recalcCharData() {
  Object.assign(chardata, recalculatePlayerStats(chardata));
}

export function resetCharData() {
  chardata.name = "";
  chardata.sex = "-";
  chardata.str = 5;
  chardata.per = 5;
  chardata.end = 5;
  chardata.cha = 5;
  chardata.int = 5;
  chardata.agi = 5;
  chardata.luc = 5;
  chardata.level = 1;
  chardata.scorept = 3;
  chardata.xp = 0;
  chardata.race = "human";
  chardata.background = "wastelander";
  chardata.equipment = [];
  chardata.skillBonuses = createEmptySkillBonuses();
  chardata.perkPointsSpent = 0;
  chardata.karmaCapsFlipped = 0;
  recalcCharData();
}

recalcCharData();

export default chardata;