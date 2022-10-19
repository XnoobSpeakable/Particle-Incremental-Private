import { formatb , getEl, D } from "./util";
import {
  player,
  getUpgradeTimesBought,
  getUpgradeCost,
  setUpgradeCost,
  UpgradeName
} from "./player";
import Decimal from "break_eternity.js";

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare var window: Window & Record<string, unknown>

export const currencyName = {
  num: "",
  alphaNum: " Alpha",
  omegaBase: " "
};

export type CurrencyName = keyof typeof currencyName;

export function UpdateCostVal(
  elementID: string,
  variable: Decimal,
  currency: CurrencyName = "num"
) {
  getEl(elementID).textContent =
    "Cost: " + formatb(variable) + currencyName[currency];
}

type Upgrade = {
  currency: CurrencyName;
  costDiv: string;
  scaleFunction: (upgradeName: UpgradeName) => void;
  extra?: undefined | (() => void) ;
}

function Upgrade(x: Upgrade) { return x; } //when the impostor is sus

export const upgrades = {
  gen: Upgrade({
    scaleFunction: scaleGen,
    costDiv: "divgencost",
    currency: "num"
  }),
  bb: Upgrade({
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
  unlockgb: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divgenunlockcost",
    currency: "num"
  }),
  gbupt: Upgrade({
    scaleFunction: scaleMultiplier(D(5)),
    costDiv: "divgbuptcost",
    currency: "num",
    extra: GBTExtra
  }),
  gbupm: Upgrade({
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
    currency: "num"
  }),
  alphaacc: Upgrade({
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divalphaacceleratorcost",
    currency: "num"
  }),
  tb: Upgrade({
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
  gboostdouble: Upgrade({
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
  baunlock: Upgrade({
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divbau",
    currency: "omegaBase"
  }),
  upgradeba: Upgrade({
    scaleFunction: scaleBA,
    costDiv: "divupgradeba",
    currency: "omegaBase"
  }),
} as const;

export function scaleMultiplier(multiplier: Decimal): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).times(multiplier));
  };
}

export function scaleBangSpeed(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName).lte(3)) {
    scaleMultiplier(D(2))(upgradeName);
  } else {
    scaleMultiplier(D(5))(upgradeName);
  }
}

export function scaleSpeed(upgradeName: UpgradeName): void {
  if(getUpgradeTimesBought(upgradeName).lt(10)) {
    setUpgradeCost(upgradeName, D(50))
  }
  else if(getUpgradeTimesBought(upgradeName).gte(10) && getUpgradeTimesBought(upgradeName).lte(1000)) {
    setUpgradeCost(upgradeName, (D(31).times(getUpgradeTimesBought(upgradeName)).minus(110)));
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
  setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(1));
}

export function GBTExtra(): void {
  player.gbTimeLeftCon = player.gbTimeLeftCon.plus(
    D(2).pow(getUpgradeTimesBought("gboostdouble")).times(20)
  );
  player.gbTimeLeft = new Decimal(0);
  player.gbTimeLeft = player.gbTimeLeftCon;
}

export function GBMExtra(): void {
  player.gbTimeLeft = new Decimal(0);
  player.gbTimeLeft = player.gbTimeLeftCon;
}

export function GBDExtra(): void {
  player.gbTimeLeftCon = player.gbTimeLeftCon.times(2);
  player.gbTimeLeft = new Decimal(0);
  player.gbTimeLeft = player.gbTimeLeftCon;
}

export function NBExtra(): void {  
  getEl("divnp").textContent =
    "Nuclear Particles: " + formatb(getUpgradeTimesBought("nuclearbuy"));
}

export function NABExtra(): void {  
  getEl("divnap").textContent =
    "Nuclear Particles: " + formatb(getUpgradeTimesBought("nuclearalphabuy"));
}

export function PCAExtra(): void {
  if (getUpgradeTimesBought("upgradepca").lte(4)) {
    player.pcaTime = Math.ceil(player.pcaTime / 2);
  } else {
    player.pcaTime = (D(10).div(getUpgradeTimesBought("upgradepca").minus(3))).ceil().toNumber()
  }
}

export function BAExtra(): void {
  if (getUpgradeTimesBought("upgradeba").lte(4)) {
    player.baTime = Math.ceil(player.baTime / 2);
  } else {
    player.baTime = (D(10).div(getUpgradeTimesBought("upgradeba").minus(3))).ceil().toNumber()
  }
}

function buyUpgrade(upgradeName: UpgradeName): void {
  const upgrade = upgrades[upgradeName];
  const oldCost = getUpgradeCost(upgradeName);
  if (player[upgrade.currency].gte(oldCost)) {
    player.upgrades[upgradeName].timesBought = player.upgrades[upgradeName].timesBought.plus(1);
    player[upgrade.currency] = player[upgrade.currency].minus(oldCost);
    upgrade.scaleFunction(upgradeName);
    if (typeof upgrade.extra !== 'undefined') { upgrade.extra(); }
    UpdateCostVal(
      upgrade.costDiv,
      getUpgradeCost(upgradeName),
      upgrade.currency
    );
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
}

