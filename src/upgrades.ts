import {
  player,
  getUpgradeTimesBought,
  getUpgradeCost,
  setUpgradeCost,
  type UpgradeName
} from "./player";
import { formatb, getElement, D, onBought, formatD } from "./util"
import Decimal from "break_eternity.js";

declare global {
  interface Window {
    buyUpgrade: (upgrade: UpgradeName) => void;
    buyFiftySpeed: VoidFunction;
  }
}

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
  precision = 2
) {
  if (precision === 2) {
    getElement(elementID).textContent =
      "Cost: " + formatb(variable) + currencyName[currency];
  }
  else {
    getElement(elementID).textContent =
      "Cost: " + formatD(variable, precision) + currencyName[currency];
  }
}

interface Upgrade {
  currency: CurrencyName;
  costDiv: string;
  scaleFunction: (upgradeName: UpgradeName) => void;
  extra?: VoidFunction;
  costRounding?: number;
}


export const upgrades = {
  gen: {
    scaleFunction: scaleGen,
    costDiv: "divgencost",
    currency: "num",
  },
  biggerbatches: {
    scaleFunction: scaleMultiplier(Decimal.dTwo),
    costDiv: "divbbcost",
    currency: "num"
  },
  speed: {
    scaleFunction: scaleSpeed,
    costDiv: "divspeedcost",
    currency: "num"
  },
  mbup: {
    scaleFunction: scaleMultiplier(D(1.5)),
    costDiv: "divmbupcost",
    currency: "num"
  },
  mbmult: {
    scaleFunction: scaleMultiplier(Decimal.dTwo),
    costDiv: "divmbmultcost",
    currency: "num"
  },
  unlockgenboost: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divgenunlockcost",
    currency: "num"
  },
  genboostuptime: {
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divgbuptcost",
    currency: "num",
    extra: GBTExtra
  },
  genboostupmult: {
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divgbupmcost",
    currency: "num",
    extra: GBMExtra
  },
  nuclearbuy: {
    scaleFunction: scaleMultiplier(D(7)),
    costDiv: "divnuclearcost",
    currency: "num",
    extra: NBExtra
  },
  speedparticle: {
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divspeedparticlecost",
    currency: "num"
  },
  machine: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divmachinecost",
    currency: "num",
    extra: MachineExtra
  },
  alphaacc: {
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divalphaacceleratorcost",
    currency: "num"
  },
  threeboost: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divthreeboostcost",
    currency: "alphaNum"
  },
  perbang: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divperbangcost",
    currency: "alphaNum"
  },
  bangspeed: {
    scaleFunction: scaleBangSpeed,
    costDiv: "divbangspeedcost",
    currency: "alphaNum"
  },
  unlockpca: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divunlockpca",
    currency: "alphaNum"
  },
  upgradepca: {
    scaleFunction: scaleMultiplier(D(3)),
    costDiv: "divupgradepcacost",
    currency: "alphaNum",
    extra: PCAExtra
  },
  boosterup: {
    scaleFunction: scaleMultiplier(Decimal.dTen),
    costDiv: "divboosterupcost",
    currency: "alphaNum"
  },
  boosteruppercent: {
    scaleFunction: scaleMultiplier(Decimal.dTen),
    costDiv: "divboosteruppercentcost",
    currency: "alphaNum"
  },
  nuclearalphabuy: {
    scaleFunction: scaleMultiplier(D(7)),
    costDiv: "divnuclearalphacost",
    currency: "alphaNum",
    extra: NABExtra
  },
  genboostdouble: {
    scaleFunction: scaleMultiplier(Decimal.dTwo),
    costDiv: "gboostdouble",
    currency: "alphaNum",
    extra: GBDExtra
  },
  alphamachinedouble: {
    scaleFunction: scaleMultiplier(D(3)),
    costDiv: "alphamachinedouble",
    currency: "alphaNum"
  },
  bangautobuyerunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divbau",
    currency: "omegaBase"
  },
  upgradebangautobuyer: {
    scaleFunction: scaleBA,
    costDiv: "divupgradeba",
    currency: "omegaBase",
    extra: BAExtra,
    costRounding: 1
  },
  boostsacrifice: {
    scaleFunction: scaleMultiplier(Decimal.dTen),
    costDiv: "divboostsacrificecost",
    currency: "boosterParticles",
    extra: BSExtra
  },
  betaacc: {
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divbetaacceleratorcost",
    currency: "alphaNum"
  },
  unlockabgb: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divabgbcost",
    currency: "betaNum"
  },
  abgbefficiency: {
    scaleFunction: scaleMultiplier(Decimal.dTwo),
    costDiv: "divabgbefficiencycost",
    currency: "betaNum"
  },
  permerge: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divpermergecost",
    currency: "betaNum"
  },
  mergespeed: {
    scaleFunction: scaleBangSpeed,
    costDiv: "divmergespeedcost",
    currency: "betaNum"
  },
  GnBBAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  GBUAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  MBUAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  NPAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  AAccAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  SAunlock: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "usewhencostdisplaynotneeded",
    currency: "omegaAlpha"
  },
  unlocknpboost: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divnpboostcost",
    currency: "betaNum",
    extra: NBExtra
  },
  upgradenpboost: {
    scaleFunction: scaleMultiplier(Decimal.dTwo),
    costDiv: "divnpboostupcost",
    currency: "betaNum",
    extra: NBExtra
  },
  reactorupmult: {
    scaleFunction: scaleReactorUpMult,
    costDiv: "divreactorupmultcost",
    currency: "betaNum",
  },
  reactoruptime: {
    scaleFunction: scaleReactorUpTime,
    costDiv: "divreactoruptimecost",
    currency: "betaNum",
  },
  unlocknapboost: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divnapboostcost",
    currency: "betaNum",
    extra: NABExtra
  },
  upgradenapboost: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divnapboostupcost",
    currency: "betaNum",
    extra: NABExtra
  },
  reactorUnlockNAP: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divreactorunlockNAPcost",
    currency: "betaNum"
  },
  reactorUnlockBP: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divreactorunlockBPcost",
    currency: "betaNum"
  },
  reactorUnlockMB: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divreactorunlockMBcost",
    currency: "betaNum"
  },
  reactorUnlockGB: {
    scaleFunction: scaleMultiplier(Decimal.dInf),
    costDiv: "divreactorunlockGBcost",
    currency: "betaNum",
  },
  reactorupMB: {
    scaleFunction: scaleMultiplier(D(4)),
    costDiv: "divnapboostupcost",
    currency: "betaNum"
  },
} as const satisfies Record<string, Upgrade>;

export function scaleMultiplier(multiplier: Decimal): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).times(multiplier));
  };
}

export function scaleBangSpeed(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName).lte(Decimal.dTwo)) {
    scaleMultiplier(Decimal.dTwo)(upgradeName);
  } else {
    scaleMultiplier(D(5))(upgradeName);
  }
}

export function scaleSpeed(upgradeName: UpgradeName): void {
  const x = getUpgradeTimesBought(upgradeName)

  if (x.lt(Decimal.dTen)) {
    setUpgradeCost(upgradeName, Decimal.dTen.times(x).plus(100))
  }
  else if (x.gte(Decimal.dTen) && x.lte(1000)) {
    setUpgradeCost(upgradeName, x.times(40).minus(200));
  }
  else {
    scaleMultiplier(D(1.1))(upgradeName)
  }
}

export function scaleGen(upgradeName: UpgradeName): void {
  if (getUpgradeCost(upgradeName).eq(Decimal.dZero)) {
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
    scaleMultiplier(D(2.75))(upgradeName);
  } else if (getUpgradeTimesBought(upgradeName).lte(8)) {
    scaleMultiplier(D(5.5))(upgradeName);
  }
  else {
    scaleMultiplier(D(44))(upgradeName);
  }
}

export function GBTExtra(): void {
  player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.plus(
    D(2).pow(getUpgradeTimesBought("genboostdouble")).times(20)
  );
  player.genBoostTimeLeft = Decimal.dZero;
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function GBMExtra(): void {
  player.genBoostTimeLeft = Decimal.dZero;
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function GBDExtra(): void {
  player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.times(Decimal.dTwo);
  player.genBoostTimeLeft = Decimal.dZero;
  player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

export function MachineExtra(): void {
  player.machineWear = 10
}

export function NBExtra(): void {
  let nuclearParticles = getUpgradeTimesBought('nuclearbuy')

  if (getUpgradeTimesBought('unlocknpboost').eq(Decimal.dOne)) {
    nuclearParticles = onBought(
      ['nuclearbuy', '*', [Decimal.dOne, '+', ['upgradenpboost', '+', Decimal.dOne, '/', Decimal.dTen]]]
    )
    getElement('divnp').textContent = "Nuclear Particles: " + formatD(nuclearParticles, 1);
  }

  else {
    getElement('divnp').textContent = "Nuclear Particles: " + formatb(getUpgradeTimesBought('nuclearbuy'));
  }
}

export function NABExtra(): void {
  let nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')

  if (getUpgradeTimesBought('unlocknapboost').eq(Decimal.dOne)) {
    nuclearAlphaParticles = onBought(
      ['nuclearalphabuy', '*', [Decimal.dOne, '+', ['upgradenapboost', '+', Decimal.dOne, '/', Decimal.dTen]]]
    )
    getElement('divnap').textContent = "Nuclear Alpha Particles: " + formatD(nuclearAlphaParticles, 1);
  }

  else {
    getElement('divnap').textContent = "Nuclear Alpha Particles: " + formatb(getUpgradeTimesBought('nuclearalphabuy'));
  }
}

export function PCAExtra(): void {
  if (getUpgradeTimesBought("upgradepca").lte(4)) {
    player.pcaTime = Math.ceil(player.pcaTime / 2);
  } else {
    player.pcaTime = (Decimal.dTen.div(getUpgradeTimesBought("upgradepca").minus(3))).ceil().toNumber()
  }
}

export function BAExtra(): void {
  if (getUpgradeTimesBought("upgradebangautobuyer").lte(4)) {
    player.bangAutobuyerTime = Math.ceil(player.bangAutobuyerTime / 2);
  } else {
    player.bangAutobuyerTime = (Decimal.dTen.div(getUpgradeTimesBought("upgradebangautobuyer").minus(3))).ceil().toNumber();
  }
}

export function BSExtra(): void {
  player.boosterParticles = Decimal.dZero
}

export function buyUpgrade(upgradeName: UpgradeName): void {
  const upgrade = upgrades[upgradeName];
  const oldCost = getUpgradeCost(upgradeName);

  if (player[upgrade.currency].gte(oldCost)) {
    player.upgrades[upgradeName].timesBought = player.upgrades[upgradeName].timesBought.plus(1);
    player[upgrade.currency] = player[upgrade.currency].minus(oldCost);
    upgrade.scaleFunction(upgradeName);
    if ("extra" in upgrade) { 
      upgrade.extra();
    }

    if (!("costRounding" in upgrade)) {
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
  for (let i = 0; i < 50; i++) {
    if (player.num.gte(getUpgradeCost('speed'))) {
      buyUpgrade('speed')
    }
    else return;
  }
};
