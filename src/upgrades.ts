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

export const upgrades = {
  gen: {
    multiplier: 4,
    scaleFunction: scaleGen,
    costDiv: "divgencost",
    currency: "num"
  },
  bb: {
    scaleFunction: scaleMultiplier(D(2)),
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
    scaleFunction: scaleMultiplier(D(2)),
    costDiv: "divmbmultcost",
    currency: "num"
  },
  unlockgb: {
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divgenunlockcost",
    currency: "num"
  },
  gbupt: {
    scaleFunction: GBTExtra(scaleMultiplier(D(5))),
    costDiv: "divgbuptcost",
    currency: "num"
  },
  gbupm: {
    scaleFunction: GBMExtra(scaleMultiplier(D(5))),
    costDiv: "divgbupmcost",
    currency: "num"
  },
  nuclearbuy: {
    scaleFunction: NBExtra(scaleMultiplier(D(7))),
    costDiv: "divnuclearcost",
    currency: "num"
  },
  alphaacc: {
    scaleFunction: scaleMultiplier(D(1000)),
    costDiv: "divalphaacceleratorcost",
    currency: "num"
  },
  tb: {
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
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divunlockpca",
    currency: "alphaNum"
  },
  upgradepca: {
    scaleFunction: PCAExtra(scaleMultiplier(D(3))),
    costDiv: "divupgradepcacost",
    currency: "alphaNum"
  },
  boosterup: {
    scaleFunction: scaleMultiplier(D(10)),
    costDiv: "divboosterupcost",
    currency: "alphaNum"
  },
  boosteruppercent: {
    scaleFunction: scaleMultiplier(D(10)),
    costDiv: "divboosteruppercentcost",
    currency: "alphaNum"
  },
  nuclearalphabuy: {
    scaleFunction: NABExtra(scaleMultiplier(D(7))),
    costDiv: "divnuclearalphacost",
    currency: "alphaNum"
  },
  gboostdouble: {
    scaleFunction: GBDExtra(scaleMultiplier(D(2))),
    costDiv: "gboostdouble",
    currency: "alphaNum"
  },
  alphamachinedouble: {
    scaleFunction: scaleMultiplier(D(3)),
    costDiv: "alphamachinedouble",
    currency: "alphaNum"
  },
  baunlock: {
    scaleFunction: scaleMultiplier(D(Infinity)),
    costDiv: "divbau",
    currency: "omegaBase"
  },
  upgradeba: {
    scaleFunction: BAExtra(),
    costDiv: "divupgradeba",
    currency: "omegaBase"
  }
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

export function GBTExtra(
  scaler: (upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    player.gbTimeLeftCon = player.gbTimeLeftCon.plus(
      20 * Math.pow(2, getUpgradeTimesBought("gboostdouble"))
    );
    player.gbTimeLeft = new Decimal(0);
    player.gbTimeLeft = player.gbTimeLeftCon;
  };
}
export function GBMExtra(  
  scaler: (
  upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    player.gbTimeLeft = new Decimal(0);
    player.gbTimeLeft = player.gbTimeLeftCon;
  };
}
export function GBDExtra(
scaler: (
  upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    player.gbTimeLeftCon = player.gbTimeLeftCon.times(2);
    player.gbTimeLeft = new Decimal(0);
    player.gbTimeLeft = player.gbTimeLeftCon;
  };
}

export function NBExtra(  
  scaler: (upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    getEl("divnp").textContent =
      "Nuclear Particles: " + formatb(getUpgradeTimesBought("nuclearbuy"));
  };
}
export function NABExtra(  
  scaler: (upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    getEl("divnap").textContent =
      "Nuclear Particles: " + formatb(getUpgradeTimesBought("nuclearalphabuy"));
  };
}
export function PCAExtra(  
  scaler: (upgradeName: UpgradeName) => void
): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    scaler(upgradeName);
    if (getUpgradeTimesBought("upgradepca").lte(4)) {
      player.pcaTime = Math.ceil(player.pcaTime / 2);
    } else {
      player.pcaTime = (D(10).div(getUpgradeTimesBought("upgradepca").minus(3))).ceil()
    }
  };
}

export function BAExtra(): (upgradeName: UpgradeName) => void {
  return function (upgradeName: UpgradeName) {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(1));
    if (getUpgradeTimesBought("upgradeba").lte(4)) {
      player.baTime = Math.ceil(player.baTime / 2);
    } else {
      player.baTime = (D(10).div(getUpgradeTimesBought("upgradeba").minus(3))).ceil()
  };
}

export function scaleSpeed(upgradeName: UpgradeName): void {
  if (getUpgradeTimesBought(upgradeName) % 10 === 0) {
    setUpgradeCost(upgradeName, D(getUpgradeTimesBought(upgradeName) * 5 + 100));
  }
}

export function scaleGen(upgradeName: UpgradeName): void {
  if (getUpgradeCost(upgradeName).eq(0)) {
    setUpgradeCost(upgradeName, D(1000));
  } else {
    scaleMultiplier(D(4))(upgradeName);
  }
}

window.buyUpgrade = function (upgradeName: UpgradeName): void {
  const upgrade = upgrades[upgradeName];
  const oldCost = getUpgradeCost(upgradeName);
  if (player[upgrade.currency].gte(oldCost)) {
    player.upgrades[upgradeName].timesBought = player.upgrades[upgradeName].timesBought.plus(1);
    player[upgrade.currency] = player[upgrade.currency].minus(oldCost);
    upgrade.scaleFunction(upgradeName);
    UpdateCostVal(
      upgrade.costDiv,
      getUpgradeCost(upgradeName),
      upgrade.currency
    );
  }
};
