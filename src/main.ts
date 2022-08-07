import { load, getUpgradeTimesBought, getUpgradeCost, player } from './player'
import { UpdateCostVal, upgrades } from './upgrades'
import { format, getEl } from './util'

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
    getEl('diventirebody').style = "color: " + textColor + "; font-family: 'Times New Roman'"
    document.body.style.backgroundColor = bgColor;
    const className = document.getElementsByClassName('button');
    for (let i = 0; i < className.length; i++) {
        className[i].style.backgroundColor = buttonColor;
    }
    const className2 = document.getElementsByClassName('withtheoutline');
    for (let i = 0; i < className2.length; i++) {
        className2[i].style.border = "0.2em solid " + borderColor;
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
    if(player.num >= 1e9) {
        getEl("tabopenalpha").style.display='inline'
        getEl("tabopenomega").style.display='inline'
    }
    if(player.alphaNum >= 1e9) {
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
    getEl("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
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
    getEl("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
    getEl("divobase").textContent = "You have " + format(player.omegaBase)
    getEl("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
    getEl("divoalpha").textContent = "You have " + format(player.omegaAlpha)
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
    const savefile = getEl('importareaid').value
    localStorage.setItem('savefile', savefile)
    window.location.reload();
}

window.setting1e4 = function () { player.eSetting = 1e+4; loadMisc() }
window.setting1e6 = function () { player.eSetting = 1e+6; loadMisc() }

window.mbman = function () {
    player.num += (getUpgradeTimesBought('mbup') + 1) * (getUpgradeTimesBought('mbmult') + 1) * (getUpgradeTimesBought('nuclearbuy')+1)
    getEl("counter").textContent = format(player.num) + " particles"
}

window.gbboost = function () {
    player.gbTimeLeft = player.gbTimeLeftCon
}

window.makechunk = function () {
    if(player.num >= 1e+9) {
        player.num -= 1e+9
        player.pChunks += 1
        getEl("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
    }
}
const makechunk = window.makechunk

window.bang = function () {
    if(player.pChunks >= 2) {
        if(getUpgradeTimesBought('alphaacc') > 0 && !(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime)) {
            player.pChunks -=2
            player.bangTimeLeft = player.bangTime
            getEl("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
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
    if(player.num >= player.omegaBaseCost) {
        player.num -= player.omegaBaseCost
        player.omegaBase +=1
        player.omegaBaseCost *= 10
        getEl("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
        getEl("divobase").textContent = "You have " + format(player.omegaBase)
    }
}

window.buyomegaalpha = function () {
    if(player.alphaNum >= player.omegaAlphaCost) {
        player.alphaNum -= player.omegaAlphaCost
        player.omegaAlpha += 1
        player.omegaAlphaCost *= 100
        getEl("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
        getEl("divoalpha").textContent = "You have " + format(player.omegaAlpha)
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
        if(player.gbTimeLeft > 0) {
            player.gbMult = (getUpgradeTimesBought('gbupm')*5+5)
        }
        else {
            player.gbMult = 1
        }
        if(getUpgradeTimesBought('unlockgb') == 1) {
            getEl("gbshow").style.display='block'
            getEl("divgenunlockcost").style.display='none'
            getEl("gbunlockbutton").style.display='none'
        }

        player.bangTime = Math.ceil(300/Math.pow(2, getUpgradeTimesBought('bangspeed')))
        if(player.bangTimeLeft == 0) { 
            player.alphaNum += getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
            getEl("bangtimeleft").textContent = ""
        }

        const alphagaindisplay = getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
        const gain = (getUpgradeTimesBought('bb')+1) * getUpgradeTimesBought('gen') * (getUpgradeTimesBought('speed')/10+0.1) * player.gbMult * (getUpgradeTimesBought('nuclearbuy')+1) * (getUpgradeTimesBought('nuclearbuy')+1) * Math.pow(3, getUpgradeTimesBought('tb')) * player.tempBoost * (1 + (((player.boosterParticles / 100) * (getUpgradeTimesBought('boosteruppercent')+1)) / 100))

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
        if(player.gbTimeLeft > 0) {
            player.gbTimeLeft -= 1
        }
        getEl("divgbtl").textContent = "Boost Time Left: " + format(player.gbTimeLeft)
        
        player.untilBoost -= 1
        if(player.untilBoost == 0) {
            player.untilBoost = 10
            player.boosterParticles += player.alphaNum * (getUpgradeTimesBought('boosterup')+1)
            getEl("boostersmaintext").textContent = "You are currently getting " + format((getUpgradeTimesBought('boosterup')+1)) + " booster particles per alpha particle per second, resulting in a +" + format(player.boosterParticles * (getUpgradeTimesBought('boosteruppercent')+1) / 100) + "% boost to base particle production"
        }
        getEl("bpamount").textContent = "You have " + format(player.boosterParticles) + " booster particles" 

        if(player.num > 1e+6 && player.num < 1e+12) {
            player.tempBoost = 1.5
            getEl("tmp").style.display='block'
        }
        else {
            player.tempBoost = 1
            getEl("tmp").style.display='none'
        }

        getEl("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
        getEl("divobase").textContent = "You have " + format(player.omegaBase)
        getEl("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
        getEl("divoalpha").textContent = "You have " + format(player.omegaAlpha)

        player.num += gain
        getEl("particlespersecond").textContent = "You are getting " + format(gain * 10) + " particles/s"

        if(player.num >= 1000000) {
            getEl("nuclearreach").style.display='none'
            getEl("nuclearshow").style.display='block'
        }
        if(player.alphaNum >= 1000000) {
            getEl("nuclearalphareach").style.display='none'
            getEl("nuclearalphashow").style.display='block'
        }
        if(player.num >= 1000000000) {
            getEl("bangreach").style.display='none'
            getEl("bangshow").style.display='block'
        }
        getEl("counter").textContent = format(player.num) + " particles"
        getEl("alphacounter").textContent = format(player.alphaNum) + " Alpha particles"
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
