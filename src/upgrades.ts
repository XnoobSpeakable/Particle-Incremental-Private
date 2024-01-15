import {
    player,
    getUpgradeTimesBought,
    getUpgradeCost,
    setUpgradeCost,
    type UpgradeName
} from "./player";
import { formatBig, getElement, onBought, formatDecimal } from "./util";
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

export function UpdateCostDisplay(
    elementID: string,
    variable: Decimal,
    currency: CurrencyName = "num",
    precision = 0
) {
    if (precision === 0) {
        getElement(elementID).textContent =
            "Cost: " + formatBig(variable) + currencyName[currency];
    } else {
        getElement(elementID).textContent =
            "Cost: " +
            formatDecimal(variable, precision) +
            currencyName[currency];
    }
}

interface Upgrade {
    cost: Decimal;
    currency: CurrencyName;
    costDiv: string;
    costFunction?: ((upgradeAmount: Decimal) => Decimal) | null;
    scaleFunction: (upgradeName: UpgradeName) => void;
    extra?: VoidFunction;
    costRounding?: number;
}

export const upgrades = {
    gen: {
        cost: Decimal.dInf,
        costFunction(upgradeAmount) {
            // 1000 * 4 ^ amount
            return upgradeAmount.pow_base(4).times(1000);
        },
        scaleFunction: scaleGen,
        costDiv: "divgencost",
        currency: "num"
    },
    biggerbatches: {
        cost: Decimal.dInf,
        costFunction(upgradeAmount) {
            // 2000 * 2 ^ amount
            return upgradeAmount.pow_base(Decimal.dTwo).times(2000);
        },
        scaleFunction: scaleMultiplier(Decimal.dTwo),
        costDiv: "divbbcost",
        currency: "num"
    },
    speed: {
        cost: new Decimal(50),
        costFunction(upgradeAmount) {
            /* (amount === 0 ? 50 : 100) + 10 * min(amount, 10) +
			min(max(amount - 10, 0), 1000) * 40 +
			1.1 ^ (max(amount - 1000, 0))*/
            return new Decimal(upgradeAmount.eq(Decimal.dZero) ? 50 : 100)
                .plus(Decimal.dTen.times(upgradeAmount.min(Decimal.dTen)))
                .plus(
                    upgradeAmount
                        .minus(Decimal.dTen)
                        .max(Decimal.dZero)
                        .min(1000)
                        .times(40)
                )
                .plus(
                    upgradeAmount.minus(1000).max(Decimal.dZero).pow_base(1.1)
                );
        },
        scaleFunction: scaleSpeed,
        costDiv: "divspeedcost",
        currency: "num"
    },
    mbup: {
        cost: new Decimal(100),
        costFunction(upgradeAmount) {
            //TODO: finish this; jakub is implementing actual upgrade formulas into the upgrade object instead of what i was donig before
            // 100 * 1.5 ^ amount
            return upgradeAmount.pow_base(1.5).times(100);
        },
        scaleFunction: scaleMultiplier(new Decimal(1.5)),
        costDiv: "divmbupcost",
        currency: "num"
    },
    mbmult: {
        cost: new Decimal(1000),
        costFunction(upgradeAmount) {
            // 1000 * 2 ^ amount
            return Decimal.dTwo.pow(upgradeAmount).times(1000);
        },
        scaleFunction: scaleMultiplier(Decimal.dTwo),
        costDiv: "divmbmultcost",
        currency: "num"
    },
    unlockgenboost: {
        cost: new Decimal(5000),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divgenunlockcost",
        currency: "num"
    },
    genboostuptime: {
        cost: new Decimal(100),
        costFunction(upgradeAmount) {
            // 100 * 5 ^ amount
            return upgradeAmount.pow_base(5).times(100);
        },
        scaleFunction: scaleMultiplier(new Decimal(5)),
        costDiv: "divgbuptcost",
        currency: "num",
        extra: GBTExtra
    },
    genboostupmult: {
        cost: new Decimal(10000),
        costFunction(upgradeAmount) {
            // 1e4 * 5 ^ amount
            return upgradeAmount.pow_base(5).times(1e4);
        },
        scaleFunction: scaleMultiplier(new Decimal(5)),
        costDiv: "divgbupmcost",
        currency: "num",
        extra: GBMExtra
    },
    nuclearbuy: {
        cost: new Decimal(1e8),
        costFunction(upgradeAmount) {
            // 1e8 * 7 ^ amount
            return upgradeAmount.pow_base(7).times(1e8);
        },
        scaleFunction: scaleMultiplier(new Decimal(7)),
        costDiv: "divnuclearcost",
        currency: "num",
        extra: NBExtra
    },
    speedparticle: {
        cost: new Decimal(5e4),
        costFunction(upgradeAmount) {
            // 5e4 * 5 ^ amount
            return upgradeAmount.pow_base(5).times(5e4);
        },
        scaleFunction: scaleMultiplier(new Decimal(5)),
        costDiv: "divspeedparticlecost",
        currency: "num"
    },
    machine: {
        cost: new Decimal(2e4),
        costFunction(upgradeAmount) {
            // 2e4 * 1.5 ^ amount
            return upgradeAmount.pow_base(4).times(2e4);
        },
        scaleFunction: scaleMultiplier(new Decimal(4)),
        costDiv: "divmachinecost",
        currency: "num",
        extra: MachineExtra
    },
    alphaacc: {
        cost: new Decimal(1e10),
        costFunction(upgradeAmount) {
            // 1e10 * 1000 ^ amount
            return upgradeAmount.pow_base(1000).times(1e10);
        },
        scaleFunction: scaleMultiplier(new Decimal(1000)),
        costDiv: "divalphaacceleratorcost",
        currency: "num"
    },
    threeboost: {
        cost: Decimal.dOne,
        costFunction(upgradeAmount) {
            // 4 ^ amount
            return upgradeAmount.pow_base(4);
        },
        scaleFunction: scaleMultiplier(new Decimal(4)),
        costDiv: "divthreeboostcost",
        currency: "alphaNum"
    },
    perbang: {
        cost: new Decimal(4),
        costFunction(upgradeAmount) {
            // 4 ^ (amount + 1)
            return upgradeAmount.add(Decimal.dOne).pow_base(4);
        },
        scaleFunction: scaleMultiplier(new Decimal(4)),
        costDiv: "divperbangcost",
        currency: "alphaNum"
    },
    bangspeed: {
        cost: Decimal.dOne,
        costFunction(upgradeAmount) {
            /* 2 ^ min(amount, 2) +
			5 ^ (max(amount - 2, 0)) +
			2*/
            return upgradeAmount
                .min(Decimal.dTwo)
                .pow_base(Decimal.dTwo)
                .plus(
                    upgradeAmount
                        .sub(Decimal.dTwo)
                        .max(Decimal.dZero)
                        .pow_base(5)
                )
                .plus(Decimal.dTwo);
        },
        scaleFunction: scaleBangSpeed,
        costDiv: "divbangspeedcost",
        currency: "alphaNum"
    },
    unlockpca: {
        cost: new Decimal(20),
        costFunction: null,
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divunlockpca",
        currency: "alphaNum"
    },
    upgradepca: {
        cost: Decimal.dTwo,
        costFunction(upgradeAmount) {
            // 2 * 3 ^ amount
            return upgradeAmount.pow_base(3).times(Decimal.dTwo);
        },
        scaleFunction: scaleMultiplier(new Decimal(3)),
        costDiv: "divupgradepcacost",
        currency: "alphaNum",
        extra: PCAExtra
    },
    boosterup: {
        cost: new Decimal(100),
        costFunction(upgradeAmount) {
            // 10 ^ (amount + 2)
            return upgradeAmount.add(Decimal.dTwo).pow_base(Decimal.dTen);
        },
        scaleFunction: scaleMultiplier(Decimal.dTen),
        costDiv: "divboosterupcost",
        currency: "alphaNum"
    },
    boosteruppercent: {
        cost: new Decimal(100),
        costFunction(upgradeAmount) {
            // 10 ^ (amount + 2)
            return upgradeAmount.add(Decimal.dTwo).pow_base(Decimal.dTen);
        },
        scaleFunction: scaleMultiplier(Decimal.dTen),
        costDiv: "divboosteruppercentcost",
        currency: "alphaNum"
    },
    nuclearalphabuy: {
        cost: new Decimal(1e6),
        costFunction(upgradeAmount) {
            // 1e6 * 7 ^ amount
            return upgradeAmount.pow_base(7).times(1e6);
        },
        scaleFunction: scaleMultiplier(new Decimal(7)),
        costDiv: "divnuclearalphacost",
        currency: "alphaNum",
        extra: NABExtra
    },
    genboostdouble: {
        cost: Decimal.dOne,
        costFunction(upgradeAmount) {
            // 2 ^ amount
            return upgradeAmount.pow_base(Decimal.dTwo);
        },
        scaleFunction: scaleMultiplier(Decimal.dTwo),
        costDiv: "gboostdouble",
        currency: "alphaNum",
        extra: GBDExtra
    },
    alphamachinedouble: {
        cost: new Decimal(1000),
        costFunction(upgradeAmount) {
            // 1000 * 3 ^ amount
            return upgradeAmount.pow_base(3).times(1000);
        },
        scaleFunction: scaleMultiplier(new Decimal(3)),
        costDiv: "alphamachinedouble",
        currency: "alphaNum"
    },
    bangautobuyerunlock: {
        cost: Decimal.dOne,
        costFunction: null,
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divbau",
        currency: "omegaBase"
    },
    upgradebangautobuyer: {
        cost: Decimal.dOne,
        costFunction(upgradeAmount) {
            // 1 + amount / 2
            return upgradeAmount.div(Decimal.dTwo).plus(Decimal.dOne);
        },
        scaleFunction: scaleBA,
        costDiv: "divupgradeba",
        currency: "omegaBase",
        extra: BAExtra,
        costRounding: 1
    },
    boostsacrifice: {
        cost: new Decimal(1e5),
        costFunction(upgradeAmount) {
            // 1e5 * 10 ^ amount
            return upgradeAmount.pow_base(Decimal.dTen).times(1e5);
        },
        scaleFunction: scaleMultiplier(Decimal.dTen),
        costDiv: "divboostsacrificecost",
        currency: "boosterParticles",
        extra: BSExtra
    },
    betaacc: {
        cost: new Decimal(1e10),
        costFunction(upgradeAmount) {
            // 1e10 * 1000 ^ amount
            return upgradeAmount.pow_base(1000).times(1e10);
        },
        scaleFunction: scaleMultiplier(new Decimal(1000)),
        costDiv: "divbetaacceleratorcost",
        currency: "alphaNum"
    },
    unlockabgb: {
        cost: Decimal.dOne,
        costFunction: null,
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divabgbcost",
        currency: "betaNum"
    },
    abgbefficiency: {
        cost: new Decimal(3),
        costFunction(upgradeAmount) {
            // 4 * (amount + 1)
            return upgradeAmount.plus(Decimal.dOne).pow_base(Decimal.dTwo);
        },
        scaleFunction: scaleMultiplier(Decimal.dTwo),
        costDiv: "divabgbefficiencycost",
        currency: "betaNum"
    },
    permerge: {
        cost: new Decimal(4),
        costFunction(upgradeAmount) {
            // 4 ^ (amount + 1)
            return upgradeAmount.plus(Decimal.dOne).pow_base(Decimal.dTen);
        },
        scaleFunction: scaleMultiplier(new Decimal(4)),
        costDiv: "divpermergecost",
        currency: "betaNum"
    },
    mergespeed: {
        cost: Decimal.dOne,
        costFunction(upgradeAmount) {
            /* 2 ^ min(amount, 2) +
			5 ^ (max(amount - 2, 0)) +
			2*/
            return upgradeAmount
                .min(Decimal.dTwo)
                .pow_base(Decimal.dTwo)
                .plus(
                    upgradeAmount
                        .sub(Decimal.dTwo)
                        .max(Decimal.dZero)
                        .pow_base(5)
                )
                .plus(Decimal.dTwo);
        },
        scaleFunction: scaleBangSpeed,
        costDiv: "divmergespeedcost",
        currency: "betaNum"
    },
    GnBBAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded", //TODO: woudlnt it be cool to remove these somehow?
        currency: "omegaAlpha"
    },
    GBUAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded", //TODO: woudlnt it be cool to remove these somehow?
        currency: "omegaAlpha"
    },
    MBUAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded", //TODO: woudlnt it be cool to remove these somehow?
        currency: "omegaAlpha"
    },
    NPAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded", //TODO: costDiv: "usewhencostdisplaynotneeded"
        currency: "omegaAlpha"
    },
    AAccAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded",
        currency: "omegaAlpha"
    },
    SAunlock: {
        cost: new Decimal(0.5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "usewhencostdisplaynotneeded",
        currency: "omegaAlpha"
    },
    unlocknpboost: {
        cost: Decimal.dTwo,
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divnpboostcost",
        currency: "betaNum",
        extra: NBExtra
    },
    upgradenpboost: {
        cost: Decimal.dTwo,
        costFunction(upgradeAmount) {
            // 2 6 amount
            return Decimal.dTwo.pow(upgradeAmount);
        },
        scaleFunction: scaleMultiplier(Decimal.dTwo),
        costDiv: "divnpboostupcost",
        currency: "betaNum",
        extra: NBExtra
    },
    reactorupmult: {
        cost: new Decimal(1500),
        scaleFunction: scaleReactorUpMult,
        costDiv: "divreactorupmultcost",
        currency: "betaNum"
    },
    reactoruptime: {
        cost: new Decimal(1250),
        scaleFunction: scaleReactorUpTime,
        costDiv: "divreactoruptimecost",
        currency: "betaNum"
    },
    unlocknapboost: {
        cost: new Decimal(15),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divnapboostcost",
        currency: "betaNum",
        extra: NABExtra
    },
    upgradenapboost: {
        cost: new Decimal(15),
        scaleFunction: scaleMultiplier(new Decimal(4)),
        costDiv: "divnapboostupcost",
        currency: "betaNum",
        extra: NABExtra
    },
    reactorUnlockNAP: {
        cost: new Decimal(3e4),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divreactorunlockNAPcost",
        currency: "betaNum"
    },
    reactorUnlockBP: {
        cost: new Decimal(8e6),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divreactorunlockBPcost",
        currency: "betaNum"
    },
    reactorUnlockMB: {
        cost: new Decimal(8000),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divreactorunlockMBcost",
        currency: "betaNum"
    },
    reactorUnlockGB: {
        cost: new Decimal(2.5e5),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divreactorunlockGBcost",
        currency: "betaNum"
    },
    reactorupMB: {
        cost: new Decimal(3000),
        scaleFunction: scaleMultiplier(new Decimal(1.75)),
        costDiv: "divreactorupMBcost",
        currency: "betaNum"
    },
    doublebeta: {
        cost: new Decimal(0.2),
        scaleFunction: scaleOmegaAlphaWeak,
        costDiv: "divdoublebetacost",
        currency: "omegaAlpha",
        costRounding: 1
    },
    unlockaga: {
        cost: new Decimal(0.25),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divunlockaga",
        currency: "omegaAlpha",
        costRounding: 2
    },
    upgradeaga: {
        cost: new Decimal(0.25),
        scaleFunction: scaleOmegaAlpha,
        costDiv: "divupgradeagacost",
        currency: "omegaAlpha",
        extra: AGAExtra,
        costRounding: 2
    },
    mergeautobuyerunlock: {
        cost: new Decimal(0.25),
        scaleFunction: scaleMultiplier(Decimal.dInf),
        costDiv: "divmau",
        currency: "omegaAlpha",
        costRounding: 2
    },
    upgrademergeautobuyer: {
        cost: new Decimal(0.25),
        scaleFunction: scaleOmegaAlpha,
        costDiv: "divupgradema",
        currency: "omegaAlpha",
        extra: MAExtra,
        costRounding: 2
    },
    buyreturngenerator: {
        cost: new Decimal(1e5),
        scaleFunction: scaleMultiplier(new Decimal(2)),
        costDiv: "divreturngeneratorcost",
        currency: "betaNum"
    },
    rpup: {
        cost: new Decimal(2.5e5),
        scaleFunction: scaleMultiplier(new Decimal(3)),
        costDiv: "divrpupcost",
        currency: "betaNum"
    },
    rpmult: {
        cost: new Decimal(4e5),
        scaleFunction: scaleMultiplier(new Decimal(20)),
        costDiv: "divrpmultcost",
        currency: "betaNum"
    },
    omegabooster: {
        cost: new Decimal(12),
        scaleFunction: scaleMultiplier(Decimal.dOne),  //TODO: ah yes, scaling by 1. I failed to make scaleFunction and costDiv optional
        costDiv: "usewhencostdisplaynotneeded",
        currency: "omegaBase",
        extra: OBExtra
    }
} as const satisfies Record<string, Upgrade>; // will fix later

export function scaleMultiplier(
    multiplier: Decimal
): (upgradeName: UpgradeName) => void {
    return function (upgradeName: UpgradeName): void {
        setUpgradeCost(
            upgradeName,
            getUpgradeCost(upgradeName).times(multiplier)
        );
    };
}

export function scaleBangSpeed(upgradeName: UpgradeName): void {
    if (getUpgradeTimesBought(upgradeName).lte(Decimal.dTwo)) {
        scaleMultiplier(Decimal.dTwo)(upgradeName);
    } else {
        scaleMultiplier(new Decimal(5))(upgradeName);
    }
}

function scaleSpeed(upgradeName: UpgradeName): void {
    const x = getUpgradeTimesBought(upgradeName);

    if (x.lt(Decimal.dTen)) {
        setUpgradeCost(upgradeName, Decimal.dTen.times(x).plus(100));
    } else if (x.gte(Decimal.dTen) && x.lte(1000)) {
        setUpgradeCost(upgradeName, x.times(40).minus(200));
    } else {
        scaleMultiplier(new Decimal(1.1))(upgradeName);
    }
}

function scaleGen(upgradeName: UpgradeName): void {
    if (getUpgradeCost(upgradeName).eq(Decimal.dZero)) {
        setUpgradeCost(upgradeName, new Decimal(1000));
    } else {
        scaleMultiplier(new Decimal(4))(upgradeName);
    }
}

function scaleBA(upgradeName: UpgradeName): void {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(0.5));
}

function scaleOmegaAlpha(upgradeName: UpgradeName): void {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(0.25));
}

function scaleOmegaAlphaWeak(upgradeName: UpgradeName): void {
    setUpgradeCost(upgradeName, getUpgradeCost(upgradeName).plus(0.2));
}

function scaleReactorUpMult(upgradeName: UpgradeName): void {
    if (getUpgradeTimesBought(upgradeName).lte(4)) {
        scaleMultiplier(new Decimal(4))(upgradeName);
    } else if (getUpgradeTimesBought(upgradeName).lte(8)) {
        scaleMultiplier(new Decimal(8))(upgradeName);
    } else {
        scaleMultiplier(new Decimal(64))(upgradeName);
    }
}

function scaleReactorUpTime(upgradeName: UpgradeName): void {
    if (getUpgradeTimesBought(upgradeName).lte(4)) {
        scaleMultiplier(new Decimal(2.6))(upgradeName);
    } else if (getUpgradeTimesBought(upgradeName).lte(8)) {
        scaleMultiplier(new Decimal(4.3))(upgradeName);
    } else {
        scaleMultiplier(new Decimal(32))(upgradeName);
    }
}

function GBTExtra(): void {
    player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.plus(
        Decimal.dTwo.pow(getUpgradeTimesBought("genboostdouble")).times(20)
    );
    player.genBoostTimeLeft = Decimal.dZero;
    player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

function GBMExtra(): void {
    player.genBoostTimeLeft = Decimal.dZero;
    player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

function GBDExtra(): void {
    player.genBoostTimeLeftCon = player.genBoostTimeLeftCon.times(Decimal.dTwo);
    player.genBoostTimeLeft = Decimal.dZero;
    player.genBoostTimeLeft = player.genBoostTimeLeftCon;
}

function MachineExtra(): void {
    player.machineWear = 10;
}

function NBExtra(): void {
    let nuclearParticles = getUpgradeTimesBought("nuclearbuy");

    if (getUpgradeTimesBought("unlocknpboost").eq(Decimal.dOne)) {
        nuclearParticles = onBought([
            "nuclearbuy",
            "*",
            [
                Decimal.dOne,
                "+",
                ["upgradenpboost", "+", Decimal.dOne, "/", Decimal.dTen]
            ]
        ]);
        getElement("divnp").textContent =
            "Nuclear Particles: " + formatDecimal(nuclearParticles, 1);
    } else {
        getElement("divnp").textContent =
            "Nuclear Particles: " +
            formatBig(getUpgradeTimesBought("nuclearbuy"));
    }
}

function NABExtra(): void {
    let nuclearAlphaParticles = getUpgradeTimesBought("nuclearalphabuy");

    if (getUpgradeTimesBought("unlocknapboost").eq(Decimal.dOne)) {
        nuclearAlphaParticles = onBought([
            "nuclearalphabuy",
            "*",
            [
                Decimal.dOne,
                "+",
                ["upgradenapboost", "+", Decimal.dOne, "/", Decimal.dTen]
            ]
        ]);
        getElement("divnap").textContent =
            "Nuclear Alpha Particles: " +
            formatDecimal(nuclearAlphaParticles, 1);
    } else {
        getElement("divnap").textContent =
            "Nuclear Alpha Particles: " +
            formatBig(getUpgradeTimesBought("nuclearalphabuy"));
    }
}

function PCAExtra(): void {
    if (getUpgradeTimesBought("upgradepca").lte(4)) {
        player.pcaTime = Math.ceil(player.pcaTime / 2);
    } else {
        player.pcaTime = Decimal.dTen
            .div(getUpgradeTimesBought("upgradepca").minus(3))
            .ceil()
            .toNumber();
    }
}

function AGAExtra(): void {
    if (getUpgradeTimesBought("upgradeaga").lte(4)) {
        player.agaTime = Math.ceil(player.agaTime / 2);
    } else {
        player.agaTime = Decimal.dTen
            .div(getUpgradeTimesBought("upgradeaga").minus(3))
            .ceil()
            .toNumber();
    }
}

function BAExtra(): void {
    if (getUpgradeTimesBought("upgradebangautobuyer").lte(4)) {
        player.bangAutobuyerTime = Math.ceil(player.bangAutobuyerTime / 2);
    } else {
        player.bangAutobuyerTime = Decimal.dTen
            .div(getUpgradeTimesBought("upgradebangautobuyer").minus(3))
            .ceil()
            .toNumber();
    }
}

function MAExtra(): void {
    if (getUpgradeTimesBought("upgrademergeautobuyer").lte(4)) {
        player.mergeAutobuyerTime = Math.ceil(player.mergeAutobuyerTime / 2);
    } else {
        player.mergeAutobuyerTime = Decimal.dTen
            .div(getUpgradeTimesBought("upgrademergeautobuyer").minus(3))
            .ceil()
            .toNumber();
    }
}

function BSExtra(): void {
    player.boosterParticles = Decimal.dZero;
}

function OBExtra(): void {
    if (getUpgradeTimesBought("omegabooster").lte(3)) {
        player.omegaAlpha = player.omegaAlpha.plus(2);
        getElement("divomegaboostersbought").textContent =
            `Bought: ${getUpgradeTimesBought("omegabooster").toString()}/3`;
        if (getUpgradeTimesBought("omegabooster").gte(3)) {
            getElement("omegaboosterbutton").style.display = "none"
        }
    }
}

export function buyUpgrade(upgradeName: UpgradeName): void {
    const upgrade = upgrades[upgradeName];
    const oldCost = getUpgradeCost(upgradeName);

    if (player[upgrade.currency].gte(oldCost)) {
        player.upgrades[upgradeName].timesBought = player.upgrades[
            upgradeName
        ].timesBought.plus(Decimal.dOne);
        player[upgrade.currency] = player[upgrade.currency].minus(oldCost);
        upgrade.scaleFunction(upgradeName);
        if ("extra" in upgrade) {
            upgrade.extra();
        }

        if (!("costRounding" in upgrade)) {
            UpdateCostDisplay(
                upgrade.costDiv,
                getUpgradeCost(upgradeName),
                upgrade.currency
            );
        } else {
            UpdateCostDisplay(
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
        if (player.num.lt(getUpgradeCost("speed"))) return;
        buyUpgrade("speed");
    }
};
