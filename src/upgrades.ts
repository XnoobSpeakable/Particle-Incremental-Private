import {
  player,
  getUpgradeTimesBought,
  getUpgradeCost,
  setUpgradeCost,
  UpgradeName
} from "./player";
import { formatb , getEl, D, onBought, formatD, jsnumber } from "./util"
import Decimal from "break_eternity.js";

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare var window: Window & Record<string, unknown>

export const currencyName = {
  num: "",
  alphaNum: " Alpha",
  boosterParticles: " Booster Particles",
  omegaBase: " ",
  betaNum: " Beta",
  omegaAlpha: " "
};

export type CurrencyName = keyof typeof currencyName;

export function UpdateCostVal(
  elementID: string,
  variable: Decimal,
  currency: CurrencyName = "num",
  prec: jsnumber = 2
) {
  if(prec === 2) {
    getEl(elementID).textContent =
    "Cost: " + formatb(variable) + currencyName[currency];
  }
  else {
    getEl(elementID).textContent =
    "Cost: " + formatD(variable, prec) + currencyName[currency];
  }
}

type Upgrade = {
  currency: CurrencyName;
  costDiv: string;
  scaleFunction: (upgradeName: UpgradeName) => void;
  extra?: undefined | (() => void) ;
  costRounding?: undefined | jsnumber;
};

function Upgrade(x: Upgrade) { return x; }

export const upgrades = {
  gen: Upgrade({
    scaleFunction: scaleGen,
    costDiv: "divgencost",
    currency: "num",
  }),
  biggerbatches: Upgrade({
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "divbbcost",
    currency: "num"
  }),
  speed: Upgrade({
    scaleFunction: scaleSpeed,
    costDiv: "divspeedcost",
    currency: "num"
  }),
  mbup: Upgrade({
    scaleFunction: scaleMultiplier(D(1.5)),
    costDiv: "divmbupcost",
    currency: "num"
  }),
  mbmult: Upgrade({
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "divmbmultcost",
    currency: "num"
  }),
  unlockgenboost: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divgenunlockcost",
    currency: "num"
  }),
  genboostuptime: Upgrade({
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divgbuptcost",
    currency: "num",
    extra: GBTExtra
  }),
  genboostupmult: Upgrade({
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divgbupmcost",
    currency: "num",
    extra: GBMExtra
  }),
  nuclearbuy: Upgrade({
    scaleFunction: scaleMultiplier(D(7)),
    costDiv: "divnuclearcost",
    currency: "num",
    extra: NBExtra
  }),
  speedparticle: Upgrade({
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divspeedparticlecost",
    currency: "num"
  }),
  machine: Upgrade({
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divmachinecost",
    currency: "num",
    extra: MachineExtra
  }),
  alphaacc: Upgrade({
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divalphaacceleratorcost",
    currency: "num"
  }),
  threeboost: Upgrade({
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divthreeboostcost",
    currency: "alphaNum"
  }),
  perbang: Upgrade({
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divperbangcost",
    currency: "alphaNum"
  }),
  bangspeed: Upgrade({
    scaleFunction: scaleBangSpeed,
    costDiv: "divbangspeedcost",
    currency: "alphaNum"
  }),
  unlockpca: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divunlockpca",
    currency: "alphaNum"
  }),
  upgradepca: Upgrade({
    scaleFunction: scaleMultiplier(D(3)),
    costDiv: "divupgradepcacost",
    currency: "alphaNum",
    extra: PCAExtra
  }),
  boosterup: Upgrade({
    scaleFunction: scaleMultiplier(D(10)),
    costDiv: "divboosterupcost",
    currency: "alphaNum"
  }),
  boosteruppercent: Upgrade({
    scaleFunction: scaleMultiplier(D(10)),
    costDiv: "divboosteruppercentcost",
    currency: "alphaNum"
  }),
  nuclearalphabuy: Upgrade({
    scaleFunction: scaleMultiplier(D(7)),
    costDiv: "divnuclearalphacost",
    currency: "alphaNum",
    extra: NABExtra
  }),
  genboostdouble: Upgrade({
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "gboostdouble",
    currency: "alphaNum",
    extra: GBDExtra
  }),
  alphamachinedouble: Upgrade({
    scaleFunction: scaleMultiplier(D(3)),
    costDiv: "alphamachinedouble",
    currency: "alphaNum"
  }),
  bangautobuyerunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divbau",
    currency: "omegaBase"
  }),
  upgradebangautobuyer: Upgrade({
    scaleFunction: scaleBA,
    costDiv: "divupgradeba",
    currency: "omegaBase",
    extra: BAExtra,
    costRounding: 1
  }),
  boostsacrifice: Upgrade({
    scaleFunction: scaleMultiplier(D(10)),
    costDiv: "divboostsacrificecost",
    currency: "boosterParticles",
    extra: BSExtra
  }),
  betaacc: Upgrade({
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divbetaacceleratorcost",
    currency: "alphaNum"
  }),
  unlockabgb: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divabgbcost",
    currency: "betaNum"
  }),
  abgbefficiency: Upgrade({
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "divabgbefficiencycost",
    currency: "betaNum"
  }),
  permerge: Upgrade({
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divpermergecost",
    currency: "betaNum"
  }),
  mergespeed: Upgrade({
    scaleFunction: scaleBangSpeed,
    costDiv: "divmergespeedcost",
    currency: "betaNum"
  }),
  GnBBAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  GBUAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  MBUAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  NPAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  AAccAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  SAunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  }),
  unlocknpboost: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divnpboostcost",
    currency: "betaNum",
    extra: NBExtra
  }),
  upgradenpboost: Upgrade({
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "divnpboostupcost",
    currency: "betaNum",
    extra: NBExtra
  }),
  reactorupmult: Upgrade({
    scaleFunction: scaleReactorUpMult,
    costDiv: "divreactorupmultcost",
    currency: "betaNum",
  }),
  reactoruptime: Upgrade({
    scaleFunction: scaleReactorUpTime,
    costDiv: "divreactoruptimecost",
    currency: "betaNum",
  }),
  unlocknapboost: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divnapboostcost",
    currency: "betaNum",
    extra: NABExtra
  }),
  upgradenapboost: Upgrade({
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divnapboostupcost",
    currency: "betaNum",
    extra: NABExtra
  }),
} as const;

export function scaleMultiplier(multiplier: Decimal): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).times(multiplier));
  };
}

export function scaleBangSpeed(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName).lte(2)) {
    scaleMultiplier(D(2))(upgradeName);
  } else {
    scaleMultiplier(D(5))(upgradeName);
  }
}

export function scaleSpeed(upgradeName: UpgradeName): void {
  const x = getUpgradeTimesBought(upgradeName)

  if(x.lt(10)) {
    setUpgradeCost( upgradeName, D(10).times(x).plus(100) )
  }
  else if(x.gte(10) && x.lte(1000)) {
    setUpgradeCost( upgradeName, D(40).times(x).minus(200) );
  }
  else {
    scaleMultiplier(D(1.1))(upgradeName)
  }
}

export function scaleGen(upgradeName: UpgradeName): void {
  if (getUpgradeCost(upgradeName).eq(0)) {
    setUpgradeCost(upgradeName, D(1000));
  } else {
    scaleMultiplier(D(4))(upgradeName);
  }
}

export function scaleBA(upgradeName: UpgradeName): void {
  setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(0.5));
}

export function scaleReactorUpMult(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName).lte(4)) {
    scaleMultiplier(D(4))(upgradeName);
  } else if (getUpgradeTimesBought(upgradeName).lte(8)) {
    scaleMultiplier(D(8))(upgradeName);
  }
  else {
    scaleMultiplier(D(64))(upgradeName);
  }
}

export function scaleReactorUpTime(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName).lte(4)) {
    scaleMultiplier(D(3))(upgradeName);
  } else if (getUpgradeTimesBought(upgradeName).lte(8)) {
    scaleMultiplier(D(7))(upgradeName);
  }
  else {
    scaleMultiplier(D(56))(upgradeName);
  }
}

export function GBTExtra(): void {
  player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.plus(
    D(2).pow(getUpgradeTimesBought("genboostdouble")).times(20)
  );
  player.genBoostTimeLeft = new Decimal(0);
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function GBMExtra(): void {
  player.genBoostTimeLeft = new Decimal(0);
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function GBDExtra(): void {
  player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.times(2);
  player.genBoostTimeLeft = new Decimal(0);
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function MachineExtra(): void {
  player.machineWear = 10
}

export function NBExtra(): void {  
  let nuclearParticles = getUpgradeTimesBought('nuclearbuy')

  if(getUpgradeTimesBought('unlocknpboost').eq(1)) {
    nuclearParticles = onBought(
        ['nuclearbuy', '*', [D(1), '+', ['upgradenpboost', '+', D(1), '/', D(10)]]]
    )
    getEl('divnp').textContent = "Nuclear Particles: " + formatD(nuclearParticles, 1);
  }

  else {
    getEl('divnp').textContent = "Nuclear Particles: " + formatb(getUpgradeTimesBought('nuclearbuy'));
  }
}

export function NABExtra(): void {  
  let nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')

  if(getUpgradeTimesBought('unlocknapboost').eq(1)) {
    nuclearAlphaParticles = onBought(
        ['nuclearalphabuy', '*', [D(1), '+', ['upgradenapboost', '+', D(1), '/', D(10)]]]
    )
    getEl('divnap').textContent = "Nuclear Alpha Particles: " + formatD(nuclearAlphaParticles, 1);
  }

  else {
    getEl('divnap').textContent = "Nuclear Alpha Particles: " + formatb(getUpgradeTimesBought('nuclearalphabuy'));
  }
}

export function PCAExtra(): void {
  if (getUpgradeTimesBought("upgradepca").lte(4)) {
    player.pcaTime = Math.ceil(player.pcaTime / 2);
  } else {
    player.pcaTime = (D(10).div(getUpgradeTimesBought("upgradepca").minus(3))).ceil().toNumber()
  }
}

export function BAExtra(): void {
  if (getUpgradeTimesBought("upgradebangautobuyer").lte(4)) {
    player.bangAutobuyerTime = Math.ceil(player.bangAutobuyerTime / 2);
  } else {
    player.bangAutobuyerTime = (D(10).div(getUpgradeTimesBought("upgradebangautobuyer").minus(3))).ceil().toNumber();
  }
}

export function BSExtra(): void {
  player.boosterParticles = D(0)
}

export function buyUpgrade(upgradeName: UpgradeName): void {
  const upgrade = upgrades[upgradeName];
  const oldCost = getUpgradeCost(upgradeName);

  if (player[upgrade.currency].gte(oldCost)) {
    player.upgrades[upgradeName].timesBought = player.upgrades[upgradeName].timesBought.plus(1);
    player[upgrade.currency] = player[upgrade.currency].minus(oldCost);
    upgrade.scaleFunction(upgradeName);

    if (typeof upgrade.extra !== 'undefined') { upgrade.extra(); }

    if (typeof upgrade.costRounding === 'undefined') {
      UpdateCostVal(
        upgrade.costDiv,
        getUpgradeCost(upgradeName),
        upgrade.currency
      );
    }
    else {
      UpdateCostVal(
        upgrade.costDiv,
        getUpgradeCost(upgradeName),
        upgrade.currency,
        upgrade.costRounding
      );
    }
  }
}
window.buyUpgrade = buyUpgrade;

window.buyFiftySpeed = function (): void {
  for(let i = 0; i < 50; i++) {
    if(player.num.gte(getUpgradeCost('speed'))) {
      buyUpgrade('speed')
    }
    else { return; }
  }
};
/*
const className = document.getElementsByClassName(
  'button'
) as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < className.length; i++) {
  //console.log(className[i].onclick!.toString())
  const str = className[i].onclick!.toString()

  if(str.includes('buyUpgrade')) {
     //console.log(str)
     const upgr = str.substring(37, str.length-3)
     console.log(upgr)
     const upgrade = upgrades[upgr];
     if (player[upgrade.currency].gte(getUpgradeCost(upgr))) {
        className[i].style.backgroundColor = 'FF00FF'
     }
     else {
        className[i].style.backgroundColor = 'FF0000'
     }
  }
}*/
