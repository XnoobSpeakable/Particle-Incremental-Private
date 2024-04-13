import { getElement } from "./util";
import Decimal from "break_eternity.js";

declare global {
    interface Window {
        loadbackup: VoidFunction;
        player?: typeof player;
        playerSettings?: typeof playerSettings;
        Decimal?: typeof Decimal;
    }
}

/**
 * The player save data object.
 */
export const player = {
    /**
     * All the upgrades.
     */
    upgrades: {
        gen: {
            cost: Decimal.dZero,
            timesBought: Decimal.dZero
        },
        biggerbatches: {
            cost: new Decimal(2000),
            timesBought: Decimal.dZero
        },
        speed: {
            cost: new Decimal(50),
            timesBought: Decimal.dZero
        },
        mbup: {
            cost: new Decimal(100),
            timesBought: Decimal.dZero
        },
        mbmult: {
            cost: new Decimal(1000),
            timesBought: Decimal.dZero
        },
        unlockgenboost: {
            cost: new Decimal(5000),
            timesBought: Decimal.dZero
        },
        genboostuptime: {
            cost: new Decimal(100),
            timesBought: Decimal.dZero
        },
        genboostupmult: {
            cost: new Decimal(10000),
            timesBought: Decimal.dZero
        },
        nuclearbuy: {
            cost: new Decimal(1e8),
            timesBought: Decimal.dZero
        },
        speedparticle: {
            cost: new Decimal(5e4),
            timesBought: Decimal.dZero
        },
        machine: {
            cost: new Decimal(2e4),
            timesBought: Decimal.dZero
        },
        nuclearalphabuy: {
            cost: new Decimal(1e6),
            timesBought: Decimal.dZero
        },
        alphaacc: {
            cost: new Decimal(1e10),
            timesBought: Decimal.dZero
        },
        threeboost: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        perbang: {
            cost: new Decimal(4),
            timesBought: Decimal.dZero
        },
        bangspeed: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        unlockpca: {
            cost: new Decimal(20),
            timesBought: Decimal.dZero
        },
        upgradepca: {
            cost: Decimal.dTwo,
            timesBought: Decimal.dZero
        },
        boosterup: {
            cost: new Decimal(100),
            timesBought: Decimal.dZero
        },
        boosteruppercent: {
            cost: new Decimal(100),
            timesBought: Decimal.dZero
        },
        genboostdouble: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        alphamachinedouble: {
            cost: new Decimal(1000),
            timesBought: Decimal.dZero
        },
        bangautobuyerunlock: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        upgradebangautobuyer: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        boostsacrifice: {
            cost: new Decimal(1e5),
            timesBought: Decimal.dZero
        },
        betaacc: {
            cost: new Decimal(1e10),
            timesBought: Decimal.dZero
        },
        unlockabgb: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        abgbefficiency: {
            cost: new Decimal(3),
            timesBought: Decimal.dZero
        },
        permerge: {
            cost: new Decimal(4),
            timesBought: Decimal.dZero
        },
        mergespeed: {
            cost: Decimal.dOne,
            timesBought: Decimal.dZero
        },
        GnBBAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        GBUAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        MBUAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        NPAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        AAccAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        SAunlock: {
            cost: new Decimal(0.5),
            timesBought: Decimal.dZero
        },
        unlocknpboost: {
            cost: Decimal.dTwo,
            timesBought: Decimal.dZero
        },
        upgradenpboost: {
            cost: Decimal.dTwo,
            timesBought: Decimal.dZero
        },
        reactorupmult: {
            cost: new Decimal(1500),
            timesBought: Decimal.dZero
        },
        reactoruptime: {
            cost: new Decimal(1250),
            timesBought: Decimal.dZero
        },
        unlocknapboost: {
            cost: new Decimal(15),
            timesBought: Decimal.dZero
        },
        upgradenapboost: {
            cost: new Decimal(15),
            timesBought: Decimal.dZero
        },
        reactorUnlockNAP: {
            cost: new Decimal(3e4),
            timesBought: Decimal.dZero
        },
        reactorUnlockBP: {
            cost: new Decimal(8e6),
            timesBought: Decimal.dZero
        },
        reactorUnlockMB: {
            cost: new Decimal(8000),
            timesBought: Decimal.dZero
        },
        reactorUnlockGB: {
            cost: new Decimal(2.5e5),
            timesBought: Decimal.dZero
        },
        reactorupMB: {
            cost: new Decimal(3000),
            timesBought: Decimal.dZero
        },
        doublebeta: {
            cost: new Decimal(0.2),
            timesBought: Decimal.dZero
        },
        unlockaga: {
            cost: new Decimal(0.25),
            timesBought: Decimal.dZero
        },
        upgradeaga: {
            cost: new Decimal(0.25),
            timesBought: Decimal.dZero
        },
        mergeautobuyerunlock: {
            cost: new Decimal(0.25),
            timesBought: Decimal.dZero
        },
        upgrademergeautobuyer: {
            cost: new Decimal(0.25),
            timesBought: Decimal.dZero
        },
        buyreturngenerator: {
            cost: new Decimal(1e5),
            timesBought: Decimal.dZero
        },
        rpup: {
            cost: new Decimal(2.5e5),
            timesBought: Decimal.dZero
        },
        rpmult: {
            cost: new Decimal(4e5),
            timesBought: Decimal.dZero
        },
        omegabooster: {
            cost: new Decimal(12),
            timesBought: Decimal.dZero
        }
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
    omegaBaseCost: new Decimal(1e10),
    omegaAlpha: Decimal.dZero,
    omegaAlphaCost: new Decimal(1e12),
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
        SpeedAutobuyerToggle: false
    },
    mergeAutobuyerToggle: true,
    mergeAutobuyerTime: 160,
    mergeAutobuyerTimeLeft: 0,
    agaToggle: true,
    agaTime: 160,
    groupAutobuyerTimeLeft: 0,
    returnParticles: Decimal.dZero
};

/**
 * The player settings object.
 */
export const playerSettings = {
    /**
     * Current version of the game.
     */
    version: "b2.3.0.0",
    /**
     * The number of deciseconds/game ticks until the next autosave.
     */
    autoSaveDelay: 50,
    /**
     * Which autosave mode is currently set. Controls if autosaving is enabled/disabled and frequency of autosaves.
     */
    autoSaveMode: 4,
    /**
     * The number of deciseconds/game ticks every which the game gets automatically saved.
     */
    autoSaveSet: 50,
    /**
     * Number of the currently active theme.
     */
    themeNumber: 0,
    useExperimental: false,
    /**
     * Whether or not you're in development mode.
     */
    devToggled: false,
    /**
     * The current cheat mode, changes which resource you will gain from
     * cheating.
     */
    cheatMode: 0,
    /**
     * Whether or not the music is enabled.
     */
    playMusic: false
};

if (import.meta.env.DEV) {
    window.player = player;
    window.playerSettings = playerSettings;
    window.Decimal = Decimal;
}

/**
 * This function is run when the game loads. Use this to perform any
 * save migrations.
 */
function updateGame(): void {
    // TODO: NEVER forget to change this when updating the game
    playerSettings.version = "b2.3.0.0";
    if ("eSetting" in playerSettings) delete playerSettings.eSetting;
}

/**
 * Loads the player settings from localStorage.
 */
export function loadSettings(): void {
    const settings = localStorage.getItem(location.pathname + "settings");
    if (settings !== null) {
        const decodedSettings = settings.startsWith("{")
            ? settings
            : atob(settings);
        deepMerge(playerSettings, JSON.parse(decodedSettings));
    }
    updateGame();

    if (playerSettings.useExperimental) {
        getElement("tabopengamma").style.display = "inline";
        getElement("tabopendelta").style.display = "inline";
        getElement("tabopenomegaomega").style.display = "inline";
        getElement("tabopenstats").style.display = "inline";
        getElement("tabopenachievements").style.display = "inline";
    } else {
        getElement("tabopengamma").style.display = "none";
        getElement("tabopendelta").style.display = "none";
        getElement("tabopenomegaomega").style.display = "none";
        getElement("tabopenstats").style.display = "inline";
        getElement("tabopenachievements").style.display = "none";
    }
    getElement("experimentoggle").textContent =
        playerSettings.useExperimental.toString();
}

Decimal.prototype.toJSON = function (): string {
    return `D#${this.toString()}`;
};

/**
 * A utility function used when deserializing the player object, used to
 * handle Decimal values.
 */
function saveRevive(_key: string, value: unknown): unknown {
    return typeof value === "string" && value.startsWith("D#")
        ? new Decimal(value.slice(2))
        : value;
}

/**
 * Recursively merge two objects.
 * @param source The object to which copy the property values from the
 * other object.
 * @param data The object from which to copy property values.
 */
function deepMerge<T extends object>(source: T, data: T): void {
    for (const key in data) {
        const value = data[key];
        if (
            typeof value === "object" &&
            value !== null &&
            !(value instanceof Decimal)
        ) {
            const newSource = source[key];
            if (!(key in source)) {
                // @ts-expect-error uhh how do I convince TS this is fine?
                source[key] = Array.isArray(value) ? [] : {};
            }
            if (typeof newSource === "object" && newSource !== null) {
                deepMerge(newSource, value);
            }
        } else source[key] = value;
    }
}

/**
 * Loads the player save from localStorage, if one exists.
 */
export function load(): void {
    const save = localStorage.getItem(location.pathname);
    if (save === null) return;
    deepMerge(
        player,
        JSON.parse(save.startsWith("{") ? save : atob(save), saveRevive)
    );
}

/**
 * Loads the backup save from localStorage, if one exists.
 */
window.loadbackup = function (): void {
    const backup = localStorage.getItem(`${location.pathname}backupsave`);
    if (backup === null) return;
    localStorage.setItem(location.pathname, backup);
    location.reload();
};

export type InstantAutobuyerName = keyof typeof player.instantAutobuyers;

/**
 * @returns Whether or not the given value is the name of one of the
 * autobuyers.
 */
export function isAutobuyerName(x: string): x is InstantAutobuyerName {
    return x in player.instantAutobuyers;
}

export type UpgradeName = keyof typeof player.upgrades;
export const UpgradeNames = Object.keys(player.upgrades) as UpgradeName[];

/**
 * @returns Whether or not the given value is the name of one of the
 * upgrades.
 */
export function isUpgradeName(x: unknown): x is UpgradeName {
    return typeof x === "string" && x in player.upgrades;
}

/**
 * A utility function to get the current cost of an upgrade.
 * @param upgradeName The name of the upgrade.
 * @returns The cost of the given upgrade.
 */
export function getUpgradeCost(upgradeName: UpgradeName): Decimal {
    return player.upgrades[upgradeName].cost;
}

/**
 * A utility function to change the cost of an upgade.
 * @param upgradeName The name of the upgrade.
 * @param newCost The new cost of the given upgrade.
 */
export function setUpgradeCost(
    upgradeName: UpgradeName,
    newCost: Decimal
): void {
    player.upgrades[upgradeName].cost = newCost;
}

/**
 * A utility function to get the current level of an upgrade.
 * @param upgradeName The name of the upgrade.
 * @returns The current level of the given upgrade.
 */
export function getUpgradeTimesBought(upgradeName: UpgradeName): Decimal {
    return player.upgrades[upgradeName].timesBought;
}
