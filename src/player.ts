import { getElement, D } from "./util";
import Decimal from "break_eternity.js";

console.log("loading player.ts");

declare global {
    interface Window {
        loadbackup: VoidFunction;
    }
}

export const player = {
    upgrades: {
        gen: { cost: Decimal.dZero, timesBought: Decimal.dZero },
        biggerbatches: { cost: D(2000), timesBought: Decimal.dZero },
        speed: { cost: D(50), timesBought: Decimal.dZero },
        mbup: { cost: D(100), timesBought: Decimal.dZero },
        mbmult: { cost: D(1000), timesBought: Decimal.dZero },
        unlockgenboost: { cost: D(5000), timesBought: Decimal.dZero },
        genboostuptime: { cost: D(100), timesBought: Decimal.dZero },
        genboostupmult: { cost: D(10000), timesBought: Decimal.dZero },
        nuclearbuy: { cost: D(1e8), timesBought: Decimal.dZero },
        speedparticle: { cost: D(5e4), timesBought: Decimal.dZero },
        machine: { cost: D(2e4), timesBought: Decimal.dZero },
        nuclearalphabuy: { cost: D(1e6), timesBought: Decimal.dZero },
        alphaacc: { cost: D(1e10), timesBought: Decimal.dZero },
        threeboost: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        perbang: { cost: D(4), timesBought: Decimal.dZero },
        bangspeed: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        unlockpca: { cost: D(20), timesBought: Decimal.dZero },
        upgradepca: { cost: Decimal.dTwo, timesBought: Decimal.dZero },
        boosterup: { cost: D(100), timesBought: Decimal.dZero },
        boosteruppercent: { cost: D(100), timesBought: Decimal.dZero },
        genboostdouble: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        alphamachinedouble: { cost: D(1000), timesBought: Decimal.dZero },
        bangautobuyerunlock: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        upgradebangautobuyer: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        boostsacrifice: { cost: D(1e5), timesBought: Decimal.dZero },
        betaacc: { cost: D(1e10), timesBought: Decimal.dZero },
        unlockabgb: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        abgbefficiency: { cost: D(3), timesBought: Decimal.dZero },
        permerge: { cost: D(4), timesBought: Decimal.dZero },
        mergespeed: { cost: Decimal.dOne, timesBought: Decimal.dZero },
        GnBBAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        GBUAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        MBUAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        NPAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        AAccAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        SAunlock: { cost: D(0.5), timesBought: Decimal.dZero },
        unlocknpboost: { cost: Decimal.dTwo, timesBought: Decimal.dZero },
        upgradenpboost: { cost: Decimal.dTwo, timesBought: Decimal.dZero },
        reactorupmult: { cost: D(1500), timesBought: Decimal.dZero },
        reactoruptime: { cost: D(1250), timesBought: Decimal.dZero },
        unlocknapboost: { cost: D(15), timesBought: Decimal.dZero },
        upgradenapboost: { cost: D(15), timesBought: Decimal.dZero },
        reactorUnlockNAP: { cost: D(3e4), timesBought: Decimal.dZero },
        reactorUnlockBP: { cost: D(8e6), timesBought: Decimal.dZero },
        reactorUnlockMB: { cost: D(8000), timesBought: Decimal.dZero },
        reactorUnlockGB: { cost: D(2.5e5), timesBought: Decimal.dZero },
        reactorupMB: { cost: D(3000), timesBought: Decimal.dZero },
    },
    num: Decimal.dZero,
    alphaNum: Decimal.dZero,
    betaNum: Decimal.dZero,
    gammaNum: Decimal.dZero,
    deltaNum: Decimal.dZero,
    omegaNum: Decimal.dZero,
    genBoostTimeLeft: Decimal.dZero,
    genBoostTimeLeftCon: Decimal.dTen,
    genBoostMult: Decimal.dOne,
    pChunks: Decimal.dZero,
    bangTime: 300,
    bangTimeLeft: 1e300,
    pcaToggle: true,
    pcaTime: 160,
    chunkAutobuyerTimeLeft: 0,
    boosterParticles: Decimal.dZero,
    untilBoost: 1,
    omegaBase: Decimal.dZero,
    omegaBaseCost: D(1e10),
    omegaAlpha: Decimal.dZero,
    omegaAlphaCost: D(1e12),
    bangAutobuyerToggle: true,
    bangAutobuyerTime: 160,
    bangAutobuyerTimeLeft: 0,
    clickerParticles: Decimal.dZero,
    machineWear: 10,
    aGroups: Decimal.dZero,
    mergeTime: 300,
    mergeTimeLeft: 1e300,
    fuel: Decimal.dZero,
    superfuel: Decimal.dZero,
    hyperfuel: Decimal.dZero,
    instantAutobuyers: {
        genAutobuyerToggle: false,
        bbAutobuyerToggle: false,
        genBoostTimeAutobuyerToggle: false,
        genBoostMultAutobuyerToggle: false,
        manBoost1perClickAutobuyerToggle: false,
        manBoost1xperClickAutobuyerToggle: false,
        nuclearParticlesAutobuyerToggle: false,
        nuclearAlphaParticlesAutobuyerToggle: false,
        AlphaAccAutobuyerToggle: false,
        SpeedAutobuyerToggle: false,
    }
};

export const playerSettings = {
    version: "b2.1.0.0",
    eSetting: 4,
    autoSaveDelay: 50,
    autoSaveMode: 4,
    autoSaveSet: 50,
    themeNumber: 0,
    useExperimental: false,
    devToggled: false,
    cheatMode: 0,
}


function updateGame(): void { //TODO: NEVER forget to change this when updating the game
    if (playerSettings.version !== 'b2.1.0.0') {
        alert('Due to changes to theme settings, your current theme setting may be broken. Make sure to double check your settings.')
    }
    playerSettings.version = 'b2.1.0.0';
}

export function loadSettings(): void {
    const settings = localStorage.getItem(location.pathname + "settings");
    if (settings !== null) {
        deepMerge(playerSettings, JSON.parse(settings));
    }

    updateGame();

    if (playerSettings.useExperimental) {
        getElement('tabopengamma').style.display = 'inline';
        getElement('tabopendelta').style.display = 'inline';
        getElement('tabopenomegaomega').style.display = 'inline';
        getElement('tabopenstats').style.display = 'inline';
        getElement('tabopenachievements').style.display = 'inline';
    }
    else {
        getElement('tabopengamma').style.display = 'none';
        getElement('tabopendelta').style.display = 'none';
        getElement('tabopenomegaomega').style.display = 'none';
        getElement('tabopenstats').style.display = 'inline';
        getElement('tabopenachievements').style.display = 'none';
    }
    getElement('experimentoggle').textContent = playerSettings.useExperimental.toString()
}

Decimal.prototype.toJSON = function (): string {
    return 'D#' + this.toString();
};

function saveRevive(_key: string, value: unknown): unknown {
    if (typeof value === 'string' && value.startsWith('D#')) {
        return new Decimal(value.slice(2))
    }
    return value;
}

export function getSaveString(): string {
    return JSON.stringify(player);
}

function deepMerge<T extends object>(source: T, data: T): void {
    for (const key in data) {
        const value = data[key];
        if (
            typeof value === "object" && 
            value !== null && 
            !(value instanceof Decimal)
        ) {
            const newSource = source[key];
            if (newSource === undefined) {
                // @ts-expect-error uhh how do I convince TS this is fine?
                source[key] = Array.isArray(value) ? [] : {};
            }
            if (typeof newSource === "object" && newSource !== null) {
                deepMerge(newSource, value);
            }
        }
        source[key] = value;
    }
}

export function load(): void {
    const save = localStorage.getItem(location.pathname);
    if (save === null) {
        return;
    }
    deepMerge(player, JSON.parse(save, saveRevive));
}

window.loadbackup = function (): void {
    const backup = localStorage.getItem(location.pathname + "backupsave");
    if (backup === null) {
        return;
    }
    localStorage.setItem(location.pathname, backup);
    location.reload();
};


export type InstantAutobuyerName = keyof typeof player.instantAutobuyers;

export function isAutobuyerName(x: unknown): x is InstantAutobuyerName {
    return typeof x === "string" && x in player.instantAutobuyers;
}

export type UpgradeName = keyof typeof player.upgrades;
export const UpgradeNames = Object.keys(player.upgrades) as UpgradeName[];

export function isUpgradeName(x: unknown): x is UpgradeName {
    return typeof x === "string" && x in player.upgrades;
}

export function getUpgradeCost(upgradeName: UpgradeName): Decimal {
    return player.upgrades[upgradeName].cost;
}

export function setUpgradeCost(upgradeName: UpgradeName, costIn: Decimal): void {
    player.upgrades[upgradeName].cost = costIn;
}

export function getUpgradeTimesBought(upgradeName: UpgradeName): Decimal {
    return player.upgrades[upgradeName].timesBought
}