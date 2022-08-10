import { load, getUpgradeTimesBought, getUpgradeCost, player } from './player'
import { UpdateCostVal, upgrades } from './upgrades'
import { format, formatb, getEl } from './util'
import Decimal from 'break_eternity.js';

// treat window as anything, so tsc doesn't complain when we modify it
declare var window: any;

const themes = [
    { textColor: "#EBEBEB", bgColor: "#696969", buttonColor: "#999999", borderColor: "black", themeName: "Dark" },
    { textColor: "#EFEFEF", bgColor: "#333333", buttonColor: "#ADADAD", borderColor: "black", themeName: "Darker" },
    { textColor: "black", bgColor: "#EEEEEE", buttonColor: "#DFDFDF", borderColor: "#333333", themeName: "Light" },
    { textColor: "black", bgColor: "#EEEEEE", buttonColor: "#DFDFDF", borderColor: "#F33333", themeName: "Red Borders" },
    { textColor: "#CCCCCC", bgColor: "#000000", buttonColor: "#CCCCCC", borderColor: "#CCCCCC", themeName: "Black" },
    { textColor: "#EEEEEE", bgColor: "#000000", buttonColor: "#EEEEEE", borderColor: "#EEEEEE", themeName: "High contrast black" },
    { textColor: "#black", bgColor: "#FF91AF", buttonColor: "#FFA1BF", borderColor: "#FFD1FF", themeName: "Pink" },
];
function themeExec() {
    const { textColor, bgColor, buttonColor, borderColor, themeName } = themes[player.themeNumber];
    //@ts-expect-error
    getEl('diventirebody').style = "color: " + textColor + "; font-family: 'Times New Roman'"
    document.body.style.backgroundColor = bgColor;
    const className = document.getElementsByClassName('button');
    for (let i = 0; i < className.length; i++) {
    //@ts-expect-error
        className[i].style.backgroundColor = buttonColor;
    }
    const className2 = document.getElementsByClassName('withtheoutline');
    for (let i = 0; i < className2.length; i++) {
       //@ts-expect-error
       className2[i].style.border = '0.2em solid ' + borderColor;
    }
    getEl("whattheme").textContent = "Theme: " + themeName;
}
window.theme = function () {
    player.themeNumber = (player.themeNumber + 1) % themes.length;
    themeExec();
}
function prePUD() {
    getEl("tabopenalpha").style.display='none'
    getEl("tabopenbeta").style.display='none'
    getEl("tabopengamma").style.display='none'
    getEl("tabopendelta").style.display='none'
    getEl("tabopenomega").style.display='none'
}
function passiveUnlockDisplay() {
    if(player.num.gte(1e9)) {
        getEl("tabopenalpha").style.display='inline'
        getEl("tabopenomega").style.display='inline'
    }
    if(player.alphaNum.gte(1e9)) {
        getEl("tabopenbeta").style.display='inline'
    }
}

const autosaveElement = getEl("autosaving") 
const delayArray = [600, 300, 150, 100, 50, 20, 10, undefined]

function autoSaveSet() {
    const delay = delayArray[player.autoSaveMode];
    player.autoSaveSet = player.autoSaveDelay = delay ?? 1e308
    autosaveElement.textContent = delay ? "On, delay: " + (delay/10) + "s" : "Off";
}

window.autosavesettings = function () {
    player.autoSaveMode = (player.autoSaveMode+1) % delayArray.length
    autoSaveSet()
}


function loadMisc() {
    themeExec()
    prePUD()
    passiveUnlockDisplay()
    autoSaveSet()
    for (const upgradeName in upgrades) {
        const upgrade = upgrades[upgradeName];
        UpdateCostVal(upgrade.costDiv, getUpgradeCost(upgradeName), upgrade.currency)
    }
    if(getUpgradeTimesBought('gen') == 0) {
        getEl("divgencost").textContent = "Cost: Free"
    }
    else {
        UpdateCostVal("divgencost", getUpgradeCost('gen'))
    }
    if(getUpgradeTimesBought('unlockgb') == 1) {
        getEl("gbshow").style.display='block'
        getEl("divgenunlockcost").style.display='none'
        getEl("gbunlockbutton").style.display='none'
    }
    getEl("divnp").textContent = "Nuclear Particles: " + getUpgradeTimesBought('nuclearbuy')
    getEl("divnap").textContent = "Nuclear Alpha Particles: " + getUpgradeTimesBought('nuclearalphabuy')
    getEl("chunkamount").textContent = "Particle Chunks: " + formatb(player.pChunks)
    if(getUpgradeTimesBought('unlockpca') == 1) {
        getEl("pcashow").style.display='block'
        getEl("divunlockpca").style.display='none'
        getEl("divunlockpcabutton").style.display='none'
        getEl("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy"
        getEl("divtogglepca").style.display='inline-block'
        if(player.pcaToggle) { getEl("divtogglepca").textContent = "On" }
        else { getEl("divtogglepca").textContent = "Off" }
    }
    if(getUpgradeTimesBought('baunlock') == 1) {
        getEl("bashow").style.display='block'
        getEl("divbau").style.display='none'
        getEl("divbauextra").style.display='none'
        getEl("baunlockbutton").style.display='none'
        getEl("untilba").textContent = player.baTimeLeft + " left until next autobuy"
        getEl("divtoggleba").style.display='inline-block'
        if(player.baToggle) {
            getEl("divtoggleba").textContent = "On"
        }
        else {
            getEl("divtoggleba").textContent = "Off"
        }
    }
    getEl("omegabasecost").textContent = "Cost: " + formatb(player.omegaBaseCost)
    getEl("divobase").textContent = "You have " + formatb(player.omegaBase)
    getEl("omegaalphacost").textContent = "Cost: " + formatb(player.omegaAlphaCost)
    getEl("divoalpha").textContent = "You have " + formatb(player.omegaAlpha)
}

function makeElementMap(...names) {
    const entries = names.map(function (x) { return [x, getEl(x)]; });
    return Object.fromEntries(entries);
}
const tabElements = makeElementMap('Base', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Stats', 'Settings', 'Tutorial');
const tabOmegaElements = makeElementMap('oBase', 'oAlpha', 'oBeta', 'oGamma', 'oDelta', 'oOmega');
function hideElements(elements) {
    for (const name in elements) { elements[name].style.display = 'none' }
}
window.openTab = function (tab) {
    if(tab in tabOmegaElements) { hideElements(tabOmegaElements) }
    else { hideElements(tabElements) }
    getEl(tab).style.display = 'block';
}

load()
loadMisc()

window.saveExport = function () {
    const savefile = JSON.stringify(player)
    localStorage.setItem('savefile', savefile)
    navigator.clipboard.writeText(savefile)
}

window.saveImport = function () {
    getEl("importareaid").style.display = "block"
    getEl("saveimportconfirm").style.display = "block"
}

window.saveImportConfirm = function () {
    const savefile = getEl('importareaid')['value']; // really should check for an empty value here
    localStorage.setItem('savefile', savefile)
    window.location.reload();
}

window.setting1e4 = function () { player.eSetting = 1e+4; loadMisc() }
window.setting1e6 = function () { player.eSetting = 1e+6; loadMisc() }

window.mbman = function () {
    const gain : Decimal = new Decimal(
        (getUpgradeTimesBought('mbup') + 1) * (getUpgradeTimesBought('mbmult') + 1) * (getUpgradeTimesBought('nuclearbuy')+1)
    )
    player.num.plus(gain)
    getEl("counter").textContent = formatb(player.num) + " particles"
}

window.gbboost = function () {
    player.gbTimeLeft = player.gbTimeLeftCon
}

window.makechunk = function () {
    if(player.num.gte(1e9)) {
        player.num.minus(1e9)
        player.pChunks.plus(1)
        getEl("chunkamount").textContent = "Particle Chunks: " + formatb(player.pChunks)
    }
}
const makechunk = window.makechunk

window.bang = function () {
    if(player.pChunks.gte(2)) {
        if(getUpgradeTimesBought('alphaacc') > 0 && !(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime)) {
            player.pChunks.minus(2)
            player.bangTimeLeft = player.bangTime
            getEl("chunkamount").textContent = "Particle Chunks: " + formatb(player.pChunks)
            getEl("boostersmaintext").style.display='block'
        }
    }
}
const bang = window.bang

window.togglepca = function () {
    if(getUpgradeTimesBought('unlockpca') == 1) {
        player.pcaToggle = !player.pcaToggle
        getEl("divtogglepca").style.display='inline-block'
        if(player.pcaToggle) { getEl("divtogglepca").textContent = "On" }
        else { getEl("divtogglepca").textContent = "Off" }
    }
}

window.buyomegabase = function () {
    if(player.num.gte(player.omegaBaseCost)) {
        player.num.minus(player.omegaBaseCost)
        player.omegaBase.plus(1)
        player.omegaBaseCost.times(10)
        getEl("omegabasecost").textContent = "Cost: " + formatb(player.omegaBaseCost)
        getEl("divobase").textContent = "You have " + formatb(player.omegaBase)
    }
}

window.buyomegaalpha = function () {
    if(player.alphaNum.gte(player.omegaAlphaCost)) {
        player.alphaNum.minus(player.omegaAlphaCost)
        player.omegaAlpha.plus(1)
        player.omegaAlphaCost.times(100)
        getEl("omegaalphacost").textContent = "Cost: " + formatb(player.omegaAlphaCost)
        getEl("divoalpha").textContent = "You have " + formatb(player.omegaAlpha)
    }
}
window.buyomegabeta = function () {}
window.buyomegagamma = function () {}
window.buyomegadelta = function () {}

window.toggleba = function () {
    if(getUpgradeTimesBought('baunlock') == 1) {
        player.baToggle = !player.baToggle
        getEl("divtoggleba").style.display='inline-block'
        if(player.baToggle) {
            getEl("divtoggleba").textContent = "On"
        }
        else {
            getEl("divtoggleba").textContent = "Off"
        }
    }
}

function fgbtest() {
    if(getUpgradeTimesBought('gen') > 0) {
        getEl("boostsection").style.display='flex'
        getEl("bigboosttext").style.display='block'
        getEl("veryouterboost").style.display='block'
        if(player.gbTimeLeft.greaterThan(0)) {
            
            player.gbMult = new Decimal(getUpgradeTimesBought('gbupm')*5+5)
        }
        else {
            player.gbMult = new Decimal(1)
        }
        if(getUpgradeTimesBought('unlockgb') == 1) {
            getEl("gbshow").style.display='block'
            getEl("divgenunlockcost").style.display='none'
            getEl("gbunlockbutton").style.display='none'
        }

        player.bangTime = Math.ceil(300/Math.pow(2, getUpgradeTimesBought('bangspeed')))
        if(player.bangTimeLeft == 0) { 
            const alphaGain : Decimal = new Decimal( 
                getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
            )
            player.alphaNum.plus(alphaGain)
            getEl("bangtimeleft").textContent = ""
        }

        const alphagaindisplay = getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
        const gain : Decimal = new Decimal( 
            (getUpgradeTimesBought('bb')+1) * getUpgradeTimesBought('gen') * (getUpgradeTimesBought('speed')/10+0.1) * player.gbMult.toNumber() * (getUpgradeTimesBought('nuclearbuy')+1) * (getUpgradeTimesBought('nuclearbuy')+1) * Math.pow(3, getUpgradeTimesBought('tb')) * player.tempBoost * (1 + (((player.boosterParticles.toNumber() / 100) * (getUpgradeTimesBought('boosteruppercent')+1)) / 100)) 
            )
        getEl("particlesperclick").textContent = "You are getting " + (getUpgradeTimesBought('mbup') + 1) * (getUpgradeTimesBought('mbmult') + 1) * (getUpgradeTimesBought('nuclearbuy')+1) + " particles per click"

        getEl("alphapb").textContent = "You are getting " + format(alphagaindisplay) + " Alpha/bang"
        player.bangTimeLeft -= 1
        if(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime) {
            getEl("bangtimeleft").textContent = "Bang time left: " + player.bangTimeLeft
            getEl("bangbutton").style.display='none'
        }
        else {
            getEl("bangbutton").style.display='block'
        }
        if(player.gbTimeLeft.greaterThan(0)) {
            player.gbTimeLeft.minus(1)
        }
        getEl("divgbtl").textContent = "Boost Time Left: " + formatb(player.gbTimeLeft)
        
        player.untilBoost -= 1
        if(player.untilBoost == 0) {
            player.untilBoost = 10
            const totalGain : Decimal = new Decimal(player.alphaNum.times((getUpgradeTimesBought('boosterup')+1)))
            player.boosterParticles.add(totalGain)
            const percentBoostDisplay : Decimal = new Decimal(formatb(player.boosterParticles.times((getUpgradeTimesBought('boosteruppercent')+1) / 100)))
            getEl("boostersmaintext").textContent = "You are currently getting " + format((getUpgradeTimesBought('boosterup')+1)) + " booster particles per alpha particle per second, resulting in a +" + percentBoostDisplay + "% boost to base particle production"
        }
        getEl("bpamount").textContent = "You have " + formatb(player.boosterParticles) + " booster particles" 

        if(player.num.gte(1e6) && player.num.lessThan(1e12)) {
            player.tempBoost = 1.5
            getEl("tmp").style.display='block'
        }
        else {
            player.tempBoost = 1
            getEl("tmp").style.display='none'
        }

        getEl("omegabasecost").textContent = "Cost: " + formatb(player.omegaBaseCost)
        getEl("divobase").textContent = "You have " + formatb(player.omegaBase)
        getEl("omegaalphacost").textContent = "Cost: " + formatb(player.omegaAlphaCost)
        getEl("divoalpha").textContent = "You have " + formatb(player.omegaAlpha)

        player.num.plus(gain)
        getEl("particlespersecond").textContent = "You are getting " + formatb(gain.times(10)) + " particles/s"

        if(player.num.gte(1e6)) {
            getEl("nuclearreach").style.display='none'
            getEl("nuclearshow").style.display='block'
        }
        if(player.alphaNum.gte(1e6)) {
            getEl("nuclearalphareach").style.display='none'
            getEl("nuclearalphashow").style.display='block'
        }
        if(player.num.gte(1e12)) {
            getEl("bangreach").style.display='none'
            getEl("bangshow").style.display='block'
        }
        getEl("counter").textContent = formatb(player.num) + " particles"
        getEl("alphacounter").textContent = formatb(player.alphaNum) + " Alpha particles"
        }
    }

function pcatest() {
    if(getUpgradeTimesBought('unlockpca') == 1) {
        getEl("pcashow").style.display='block'
        getEl("divunlockpca").style.display='none'
        getEl("divunlockpcabutton").style.display='none'
        if(player.pcaToggle == true) {
            if(player.pcaTimeLeft == 0) {
                player.pcaTimeLeft = player.pcaTime
                makechunk()
            }
            player.pcaTimeLeft -= 1
            getEl("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy"
        }
    }
}

function batest() {
    if(getUpgradeTimesBought('baunlock') == 1) {
        getEl("bashow").style.display='block'
        getEl("divbau").style.display='none'
        getEl("divbauextra").style.display='none'
        getEl("baunlockbutton").style.display='none'
        if(player.baToggle == true) {
            if(player.baTimeLeft == 0) {
                player.baTimeLeft = player.baTime
                bang()
            }
            player.baTimeLeft -= 1
            getEl("untilba").textContent = player.baTimeLeft + " left until next autobuy"
        }
    }
}

function savinginloop() {
	player.autoSaveDelay -= 1
    if(player.autoSaveDelay == 0) {
        player.autoSaveDelay = player.autoSaveSet
        save()
	}
}

//game loop
setInterval(() => {
    passiveUnlockDisplay()
    pcatest()
    batest()
    fgbtest()
    getEl("stat").textContent = JSON.stringify(player)
	savinginloop()
    }, 100)

window.save = function () {
    const savefile = JSON.stringify(player)
    localStorage.setItem('savefile', savefile)
}
const save = window.save

window.reset = function () {
    localStorage.removeItem('savefile');
}
