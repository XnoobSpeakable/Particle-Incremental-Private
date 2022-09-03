import Decimal from 'break_eternity.js';
import { getEl} from './util'

// eslint-disable-next-line @typescript-eslint/ban-types
type jsnumber = number;
function D(n: jsnumber): Decimal {
   return new Decimal(n);
}

export let player = {
    upgrades: { 
        'gen': { cost: D(0), timesBought: D(0) },
        'bb': { cost: D(2000), timesBought: D(0)},
        'speed': { cost: D(50), timesBought: D(0)},
        'mbup': { cost: D(50), timesBought: D(0)},
        'mbmult': { cost: D(1000), timesBought: D(0)},
        'unlockgb': { cost: D(5000), timesBought: D(0)},
        'gbupt': { cost: D(100), timesBought: D(0)},
        'gbupm': { cost: D(10000), timesBought: D(0)},
        'nuclearbuy': { cost: D(1e6), timesBought: D(0)},
        'nuclearalphabuy': { cost: D(1e6), timesBought: D(0)},
        'alphaacc': { cost: D(1e10), timesBought: D(0)},
        'tb': { cost: D(1), timesBought: D(0)},
        'perbang': { cost: D(4), timesBought: D(0)},
        'bangspeed': { cost: D(1), timesBought: D(0)},
        'unlockpca': { cost: D(20), timesBought: D(0)},
        'upgradepca': { cost: D(2), timesBought: D(0)},
        'boosterup': { cost: D(100), timesBought: D(0)},
        'boosteruppercent': { cost: D(100), timesBought: D(0)},
        'gboostdouble': { cost: D(1), timesBought: D(0)},
        'alphamachinedouble': { cost: D(1000), timesBought: D(0)},
        'baunlock': { cost: D(1), timesBought: D(0)},
        'upgradeba': { cost: D(1), timesBought: D(0)},
        },
    num: D(0),
    gbTimeLeft: D(0),
    gbTimeLeftCon: D(10),
    gbMult: D(1),
    pChunks: D(0),
    alphaNum: D(0),
    bangTime: 300, 
    bangTimeLeft: 1e+300,  
    tempBoost: 1, 
    pcaToggle: true, 
    pcaTime: 160, 
    pcaTimeLeft: 0, 
    boosterParticles: D(0),
    untilBoost: 1, 
    omegaBase: D(0),
    omegaBaseCost: D(1e10),
    omegaAlpha: D(0),
    omegaAlphaCost: D(1e12),
    baToggle: true, 
    baTime: 160, 
    baTimeLeft: 0,
};

export let playerSettings = {
    version: "b1.22.0",
    eSetting: 4,
    autoSaveDelay: 50, 
    autoSaveMode: 4, 
    autoSaveSet: 50,
    themeNumber: 0,
    useExperimental: false,
}

export type UpgradeName = keyof typeof player.upgrades;
export const UpgradeNames = Object.keys(player.upgrades) as UpgradeName[];        
export function isUpgradeName(x: unknown) : x  is UpgradeName { return typeof x === 'string' && UpgradeNames.includes(x as UpgradeName) }
export function getUpgradeCost(upgradeName: UpgradeName) { return player.upgrades[upgradeName].cost }
export function setUpgradeCost(upgradeName: UpgradeName, costIn: Decimal) { player.upgrades[upgradeName].cost = (costIn) }
export function getUpgradeTimesBought(upgradeName: UpgradeName) { 
    return player.upgrades[upgradeName].timesBought 
}

export function loadSettings() {
    if(localStorage.getItem(window.location.pathname + "settings") !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        playerSettings = JSON.parse(localStorage.getItem(window.location.pathname + "settings")!);
    }
    const stage = Number(playerSettings.version.substring(1, 2))
    const major = Number(playerSettings.version.substring(3, 5))
    //const minor = player.version.substring(6)
    if(stage === 1 && major <= 21) {
        localStorage.removeItem(window.location.pathname);
        window.location.reload();
    }
    if(playerSettings.version !== "b1.22.0") {
        playerSettings.version = "b1.22.0";
        alert("This version is incompatible with older saves, so your progress has been wiped.");
    }
    if(playerSettings.useExperimental) {
        getEl('nextfeature').style.display = 'block'
        getEl('tabopenfactory').style.display = 'inline';
        getEl('tabopenbeta').style.display = 'inline';
        getEl('tabopengamma').style.display = 'inline';
        getEl('tabopendelta').style.display = 'inline';
        getEl('tabopenachievements').style.display = 'inline';
     }
     else {
        getEl('nextfeature').style.display = 'none'
        getEl('tabopenfactory').style.display = 'none';
        getEl('tabopenbeta').style.display = 'none';
        getEl('tabopengamma').style.display = 'none';
        getEl('tabopendelta').style.display = 'none';
        getEl('tabopenachievements').style.display = 'none';
     }
     getEl('experimentoggle').textContent = playerSettings.useExperimental.toString()
}

Decimal.prototype.toJSON = function () {
    return 'D#' + this.toString();
 };
 
 function saveRevive(_key: string, value: unknown) {
    if (typeof value === 'string' && value.startsWith('D#') ) { return new Decimal(value.slice(2)) }
    return value;
 }
 
 export function getSaveString() {
    return JSON.stringify(player);
 }
 
 export function load() {
    if(localStorage.getItem(window.location.pathname) !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        player = JSON.parse(localStorage.getItem(window.location.pathname)!, saveRevive);
    }
}
