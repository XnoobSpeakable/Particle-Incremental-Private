import Decimal from 'break_eternity.js';

export let player = {
            version: "b1.22.0",
            upgrades: { 
                'gen': { cost: 0, timesBought: 0 },
                'bb': { cost: 2000, timesBought: 0},
                'speed': { cost: 50, timesBought: 0},
                'mbup': { cost: 50, timesBought: 0},
                'mbmult': { cost: 1000, timesBought: 0},
                'unlockgb': { cost: 5000, timesBought: 0},
                'gbupt': { cost: 100, timesBought: 0},
                'gbupm': { cost: 10000, timesBought: 0},
                'nuclearbuy': { cost: 1e6, timesBought: 0},
                'nuclearalphabuy': { cost: 1e6, timesBought: 0},
                'alphaacc': { cost: 1e10, timesBought: 0},
                'tb': { cost: 1, timesBought: 0},
                'perbang': { cost: 4, timesBought: 0},
                'bangspeed': { cost: 1, timesBought: 0},
                'unlockpca': { cost: 20, timesBought: 0},
                'upgradepca': { cost: 2, timesBought: 0},
                'boosterup': { cost: 100, timesBought: 0},
                'boosteruppercent': { cost: 100, timesBought: 0},
                'gboostdouble': { cost: 1, timesBought: 0},
                'alphamachinedouble': { cost: 1000, timesBought: 0},
                'baunlock': { cost: 1, timesBought: 0},
                'upgradeba': { cost: 1, timesBought: 0},
              },
            num: new Decimal(0),
            gbTimeLeft: new Decimal(0),
            gbTimeLeftCon: new Decimal(10),
            gbMult: new Decimal(1),
            pChunks: new Decimal(0),
            alphaNum: new Decimal(0),
            bangTime: 300, //possibly no b_e
            bangTimeLeft: 1e+300, //possibly no b_e
            alphaAcceleratorsLeft: 0,
            eSetting: 4, //no b_e
            tempBoost: 1, //no b_e
            pcaToggle: true, //no b_e
            pcaTime: 160, //possibly no b_e
            pcaTimeLeft: 0, //possibly no b_e
            autoSaveDelay: 50, //no b_e
            autoSaveMode: 4, //no b_e
            autoSaveSet: 50, //no b_e
            boosterParticles: new Decimal(0),
            untilBoost: 1, //no b_e
            themeNumber: 0, //no b_e
            omegaBase: new Decimal(0),
            omegaBaseCost: new Decimal(1e10),
            omegaAlpha: new Decimal(0),
            omegaAlphaCost: new Decimal(1e12),
            baToggle: true, //no b_e
            baTime: 160, //possibly no b_e
            baTimeLeft: 0,//possibly no b_e
          };

          export type UpgradeName = keyof typeof player.upgrades;
          
export function getUpgradeCost(upgradeName: UpgradeName) { return player.upgrades[upgradeName].cost }
export function setUpgradeCost(upgradeName, costIn) { player.upgrades[upgradeName].cost = (costIn) }
export function getUpgradeTimesBought(upgradeName) { return player.upgrades[upgradeName].timesBought }

export function load() {
    if(localStorage.getItem('savefile') !== null) {
        player = JSON.parse(localStorage.getItem('savefile')!)
    }
    const stage = Number(player.version.substring(1, 2))
    const major = Number(player.version.substring(3, 5))
    //const minor = player.version.substring(6)
    if(stage == 1 && major <= 21) {
        localStorage.removeItem('savefile');
        window.location.reload();
    }
    if(player.version != "b1.22.0") {
        player.version = "b1.22.0";
        alert("This version is incompatible with older saves, so your progress has been wiped.");
    }
}