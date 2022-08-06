import { format } from './util'
import { player, getUpgradeTimesBought, getUpgradeCost, setUpgradeCost } from './player'


export function UpdateCostVal(elementID, variable, currency = "num") {
    const currencyName = {
        'num': '',
        'alphaNum': ' Alpha',
        'omegaBase': ' ',
    }
    document.getElementById(elementID).textContent = "Cost: " + format(variable) + currencyName[currency]
}

export const upgrades = {
    'gen': { multiplier: 4, scaleFunction: scaleGen, costDiv: "divgencost", currency: "num"},
    'bb': {  scaleFunction: scaleMultiplier(2), costDiv: "divbbcost", currency: "num"},
    'speed': {  scaleFunction: scaleSpeed, costDiv: "divspeedcost", currency: "num"},
    'mbup': { scaleFunction: scaleMultiplier(2), costDiv: "divmbupcost", currency: "num"},
    'mbmult': {  scaleFunction: scaleMultiplier(3), costDiv: "divmbmultcost", currency: "num"},
    'unlockgb': {  scaleFunction: scaleMultiplier(Infinity), costDiv: "divgenunlockcost", currency: "num"},
    'gbupt': {  scaleFunction: GBTExtra(scaleMultiplier(5)), costDiv: "divgbuptcost", currency: "num"},
    'gbupm': {  scaleFunction: GBMExtra(scaleMultiplier(5)), costDiv: "divgbupmcost", currency: "num"},
    'nuclearbuy': {  scaleFunction: NBExtra(scaleMultiplier(7)), costDiv: "divnuclearcost", currency: "num"},
    'alphaacc': {  scaleFunction: AAExtra(scaleMultiplier(1000)), costDiv: "divalphaacceleratorcost", currency: "num"},
    'tb': {  scaleFunction: scaleMultiplier(4), costDiv: "divthreeboostcost", currency: "alphaNum"},
    'perbang': {  scaleFunction: scaleMultiplier(4), costDiv: "divperbangcost", currency: "alphaNum"},
    'bangspeed': {  scaleFunction: scaleBangSpeed, costDiv: "divbangspeedcost", currency: "alphaNum"},
    'unlockpca': {  scaleFunction: scaleMultiplier(Infinity), costDiv: "divunlockpca", currency: "alphaNum"},
    'upgradepca': {  scaleFunction: PCAExtra(scaleMultiplier(3)), costDiv: "divupgradepcacost", currency: "alphaNum"},
    'boosterup': {  scaleFunction: scaleMultiplier(10), costDiv: "divboosterupcost", currency: "alphaNum"},
    'boosteruppercent': {  scaleFunction: scaleMultiplier(10), costDiv: "divboosteruppercentcost", currency: "alphaNum"},
    'nuclearalphabuy': {  scaleFunction: NABExtra(scaleMultiplier(7)), costDiv: "divnuclearalphacost", currency: "alphaNum"},
    'gboostdouble': {  scaleFunction: GBDExtra(scaleMultiplier(2)), costDiv: "gboostdouble", currency: "alphaNum"},
    'alphamachinedouble': {  scaleFunction: scaleMultiplier(3), costDiv: "alphamachinedouble", currency: "alphaNum"},
    'baunlock': {  scaleFunction: scaleMultiplier(Infinity), costDiv: "divbau", currency: "omegaBase"},
    'upgradeba': {  scaleFunction: BAExtra(), costDiv: "divupgradeba", currency: "omegaBase"},
}

export function scaleMultiplier(multiplier) {
    return function (upgradeName) {
        setUpgradeCost( upgradeName, getUpgradeCost(upgradeName) * multiplier);
    }
}

export function scaleBangSpeed(upgradeName) {
    if(getUpgradeTimesBought(upgradeName) <= 3) {
        scaleMultiplier(2)(upgradeName)
    }
    else {
        scaleMultiplier(5)(upgradeName)
    }
}

export function GBTExtra(scaler) {
    return function (upgradeName) {
       scaler(upgradeName)
       player.gbTimeLeftCon += 20 * Math.pow(2, getUpgradeTimesBought('gboostdouble'))
       player.gbTimeLeft = 0
       player.gbTimeLeft = player.gbTimeLeftCon
    }
 }
export function GBMExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        player.gbTimeLeft = 0
        player.gbTimeLeft = player.gbTimeLeftCon
    }
}
export function GBDExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        player.gbTimeLeftCon *= 2
        player.gbTimeLeft = 0
        player.gbTimeLeft = player.gbTimeLeftCon
    }
}

export function NBExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        document.getElementById("divnp").textContent = "Nuclear Particles: " + getUpgradeTimesBought('nuclearbuy')
    }
}
export function NABExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        document.getElementById("divnap").textContent = "Nuclear Particles: " + getUpgradeTimesBought('nuclearalphabuy')
    }
}

export function AAExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        if(!(player.bangTimeLeft > 0 && player.bangTimeLeft < player.bangTime)) {
            player.alphaAcceleratorsLeft = getUpgradeTimesBought('alphaacc')
        }
    }
}

export function PCAExtra(scaler) {
    return function (upgradeName) {
        scaler(upgradeName)
        if(getUpgradeTimesBought('upgradepca') <= 4) {
            player.pcaTime = Math.ceil(player.pcaTime / 2)
        }
        else {
            player.pcaTime = Math.ceil(10 / (getUpgradeTimesBought('upgradepca')-3))
        }
    }
}

export function BAExtra() {
    return function (upgradeName) {
        setUpgradeCost( upgradeName, getUpgradeCost(upgradeName)+1)
        if(getUpgradeTimesBought('upgradeba') <= 4) {
            player.baTime = Math.ceil(player.baTime / 2)
        }
        else {
            player.baTime = Math.ceil(10 / (getUpgradeTimesBought('upgradeba')-3))
        }
    }
}

export function scaleSpeed(upgradeName) {
    if(getUpgradeTimesBought(upgradeName) % 10 == 0) {
        setUpgradeCost(upgradeName, (getUpgradeTimesBought(upgradeName) * 5 + 100))
    }
}

export function scaleGen(upgradeName) {
    if(getUpgradeCost(upgradeName) == 0) {
        setUpgradeCost(upgradeName, 1000)
    }
    else {
        scaleMultiplier(4)(upgradeName)
    }
}

window.buyUpgrade = function (upgradeName) {
    const upgrade = upgrades[upgradeName];
    const oldCost = getUpgradeCost(upgradeName);
    if (player[upgrade.currency] >= oldCost) {
        player.upgrades[upgradeName].timesBought++;
        player[upgrade.currency] -= oldCost;
        upgrade.scaleFunction(upgradeName);
        UpdateCostVal(upgrade.costDiv, getUpgradeCost(upgradeName), upgrade.currency);
    }   
}