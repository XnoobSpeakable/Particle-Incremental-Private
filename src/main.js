import { load, getUpgradeTimesBought, getUpgradeCost, player } from './player'
import { UpdateCostVal, upgrades } from './upgrades'
import { format } from './util'

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
    document.getElementById('diventirebody').style = "color: " + textColor + "; font-family: 'Times New Roman'"
    document.body.style.backgroundColor = bgColor;
    const className = document.getElementsByClassName('button');
    for (let i = 0; i < className.length; i++) {
        className[i].style.backgroundColor = buttonColor;
    }
    const className2 = document.getElementsByClassName('withtheoutline');
    for (let i = 0; i < className2.length; i++) {
        className2[i].style.border = "0.2em solid " + borderColor;
    }
    document.getElementById("whattheme").textContent = "Theme: " + themeName;
}
window.theme = function () {
    player.themeNumber = (player.themeNumber + 1) % themes.length;
    themeExec();
}
function prePUD() {
    document.getElementById("tabopenalpha").style.display='none'
    document.getElementById("tabopenbeta").style.display='none'
    document.getElementById("tabopengamma").style.display='none'
    document.getElementById("tabopendelta").style.display='none'
    document.getElementById("tabopenomega").style.display='none'
}
function passiveUnlockDisplay() {
    if(player.num >= 1e9) {
        document.getElementById("tabopenalpha").style.display='inline'
        document.getElementById("tabopenomega").style.display='inline'
    }
    if(player.alphaNum >= 1e9) {
        document.getElementById("tabopenbeta").style.display='inline'
    }
}

const autosaveElement = document.getElementById("autosaving") 
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
        document.getElementById("divgencost").textContent = "Cost: Free"
    }
    else {
        UpdateCostVal("divgencost", getUpgradeCost('gen'))
    }
    if(getUpgradeTimesBought('unlockgb') == 1) {
        document.getElementById("gbshow").style.display='block'
        document.getElementById("divgenunlockcost").style.display='none'
        document.getElementById("gbunlockbutton").style.display='none'
    }
    document.getElementById("divnp").textContent = "Nuclear Particles: " + getUpgradeTimesBought('nuclearbuy')
    document.getElementById("divnap").textContent = "Nuclear Alpha Particles: " + getUpgradeTimesBought('nuclearalphabuy')
    document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
    if(getUpgradeTimesBought('unlockpca') == 1) {
        document.getElementById("pcashow").style.display='block'
        document.getElementById("divunlockpca").style.display='none'
        document.getElementById("divunlockpcabutton").style.display='none'
        document.getElementById("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy"
        document.getElementById("divtogglepca").style.display='inline-block'
        if(player.pcaToggle) { document.getElementById("divtogglepca").textContent = "On" }
        else { document.getElementById("divtogglepca").textContent = "Off" }
    }
    if(getUpgradeTimesBought('baunlock') == 1) {
        document.getElementById("bashow").style.display='block'
        document.getElementById("divbau").style.display='none'
        document.getElementById("divbauextra").style.display='none'
        document.getElementById("baunlockbutton").style.display='none'
        document.getElementById("untilba").textContent = player.baTimeLeft + " left until next autobuy"
        document.getElementById("divtoggleba").style.display='inline-block'
        if(player.baToggle) {
            document.getElementById("divtoggleba").textContent = "On"
        }
        else {
            document.getElementById("divtoggleba").textContent = "Off"
        }
    }
    document.getElementById("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
    document.getElementById("divobase").textContent = "You have " + format(player.omegaBase)
    document.getElementById("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
    document.getElementById("divoalpha").textContent = "You have " + format(player.omegaAlpha)
}

function makeElementMap(...names) {
    const entries = names.map(function (x) { return [x, document.getElementById(x)]; });
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
    document.getElementById(tab).style.display = 'block';
}

load()
loadMisc()

window.setting1e4 = function () { player.eSetting = 1e+4; loadMisc() }
window.setting1e6 = function () { player.eSetting = 1e+6; loadMisc() }

window.mbman = function () {
    player.num += (getUpgradeTimesBought('mbup') + 1) * (getUpgradeTimesBought('mbmult') + 1)
    document.getElementById("counter").textContent = format(player.num) + " particles"
}

window.gbboost = function () {
    player.gbTimeLeft = player.gbTimeLeftCon
}

window.makechunk = function () {
    if(player.num >= 1e+9) {
        player.num -= 1e+9
        player.pChunks += 1
        document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
    }
}
const makechunk = window.makechunk

window.bang = function () {
    if(player.pChunks >= 2) {
        if(getUpgradeTimesBought('alphaacc') > 0 && !(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime)) {
            player.pChunks -=2
            player.bangTimeLeft = player.bangTime
            document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks)
            document.getElementById("boostersmaintext").style.display='block'
        }
    }
}
const bang = window.bang

window.togglepca = function () {
    if(getUpgradeTimesBought('unlockpca') == 1) {
        player.pcaToggle = !player.pcaToggle
        document.getElementById("divtogglepca").style.display='inline-block'
        if(player.pcaToggle) { document.getElementById("divtogglepca").textContent = "On" }
        else { document.getElementById("divtogglepca").textContent = "Off" }
    }
}

window.buyomegabase = function () {
    if(player.num >= player.omegaBaseCost) {
        player.num -= player.omegaBaseCost
        player.omegaBase +=1
        player.omegaBaseCost *= 10
        document.getElementById("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
        document.getElementById("divobase").textContent = "You have " + format(player.omegaBase)
    }
}

window.buyomegaalpha = function () {
    if(player.alphaNum >= player.omegaAlphaCost) {
        player.alphaNum -= player.omegaAlphaCost
        player.omegaAlpha += 1
        player.omegaAlphaCost *= 100
        document.getElementById("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
        document.getElementById("divoalpha").textContent = "You have " + format(player.omegaAlpha)
    }
}
window.buyomegabeta = function () {}
window.buyomegagamma = function () {}
window.buyomegadelta = function () {}

window.toggleba = function () {
    if(getUpgradeTimesBought('baunlock') == 1) {
        player.baToggle = !player.baToggle
        document.getElementById("divtoggleba").style.display='inline-block'
        if(player.baToggle) {
            document.getElementById("divtoggleba").textContent = "On"
        }
        else {
            document.getElementById("divtoggleba").textContent = "Off"
        }
    }
}

function fgbtest() {
    if(getUpgradeTimesBought('gen') > 0) {
        document.getElementById("boostsection").style.display='flex'
        document.getElementById("bigboosttext").style.display='block'
        document.getElementById("veryouterboost").style.display='block'
        if(player.gbTimeLeft > 0) {
            player.gbMult = (getUpgradeTimesBought('gbupm')*5+5)
        }
        else {
            player.gbMult = 1
        }
        if(getUpgradeTimesBought('unlockgb') == 1) {
            document.getElementById("gbshow").style.display='block'
            document.getElementById("divgenunlockcost").style.display='none'
            document.getElementById("gbunlockbutton").style.display='none'
        }

        player.bangTime = Math.ceil(300/Math.pow(2, getUpgradeTimesBought('bangspeed')))
        if(player.bangTimeLeft == 0) { 
            player.alphaNum += getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
            document.getElementById("bangtimeleft").textContent = ""
        }

        const alphagaindisplay = getUpgradeTimesBought('alphaacc') * (getUpgradeTimesBought('perbang')+1) * (getUpgradeTimesBought('nuclearalphabuy')+1) * Math.pow(2, getUpgradeTimesBought('alphamachinedouble'))
        const gain = (getUpgradeTimesBought('bb')+1) * getUpgradeTimesBought('gen') * (getUpgradeTimesBought('speed')/10+0.1) * player.gbMult * (getUpgradeTimesBought('nuclearbuy')+1) * (getUpgradeTimesBought('nuclearbuy')+1) * Math.pow(3, getUpgradeTimesBought('tb')) * player.tempBoost * (1 + (((player.boosterParticles / 100) * (getUpgradeTimesBought('boosteruppercent')+1)) / 100))

        document.getElementById("alphapb").textContent = "You are getting " + format(alphagaindisplay) + " Alpha/bang"
        player.bangTimeLeft -= 1
        if(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime) {
            document.getElementById("bangtimeleft").textContent = "Bang time left: " + player.bangTimeLeft
            document.getElementById("bangbutton").style.display='none'
        }
        else {
            document.getElementById("bangbutton").style.display='block'
        }
        if(player.gbTimeLeft > 0) {
            player.gbTimeLeft -= 1
        }
        document.getElementById("divgbtl").textContent = "Boost Time Left: " + format(player.gbTimeLeft)
        
        player.untilBoost -= 1
        if(player.untilBoost == 0) {
            player.untilBoost = 10
            player.boosterParticles += player.alphaNum * (getUpgradeTimesBought('boosterup')+1)
            document.getElementById("boostersmaintext").textContent = "You are currently getting " + format((getUpgradeTimesBought('boosterup')+1)) + " booster particles per alpha particle per second, resulting in a +" + format(player.boosterParticles * (getUpgradeTimesBought('boosteruppercent')+1) / 100) + "% boost to base particle production"
        }
        document.getElementById("bpamount").textContent = "You have " + format(player.boosterParticles) + " booster particles" 

        if(player.num > 1e+6 && player.num < 1e+12) {
            player.tempBoost = 1.5
            document.getElementById("tmp").style.display='block'
        }
        else {
            player.tempBoost = 1
            document.getElementById("tmp").style.display='none'
        }

        document.getElementById("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost)
        document.getElementById("divobase").textContent = "You have " + format(player.omegaBase)
        document.getElementById("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost)
        document.getElementById("divoalpha").textContent = "You have " + format(player.omegaAlpha)

        player.num += gain
        document.getElementById("particlespersecond").textContent = "You are getting " + format(gain * 10) + " particles/s"

        if(player.num >= 1000000) {
            document.getElementById("nuclearreach").style.display='none'
            document.getElementById("nuclearshow").style.display='block'
        }
        if(player.alphaNum >= 1000000) {
            document.getElementById("nuclearalphareach").style.display='none'
            document.getElementById("nuclearalphashow").style.display='block'
        }
        if(player.num >= 1000000000) {
            document.getElementById("bangreach").style.display='none'
            document.getElementById("bangshow").style.display='block'
        }
        document.getElementById("counter").textContent = format(player.num) + " particles"
        document.getElementById("alphacounter").textContent = format(player.alphaNum) + " Alpha particles"
        }
    }

function pcatest() {
    if(getUpgradeTimesBought('unlockpca') == 1) {
        document.getElementById("pcashow").style.display='block'
        document.getElementById("divunlockpca").style.display='none'
        document.getElementById("divunlockpcabutton").style.display='none'
        if(player.pcaToggle == true) {
            if(player.pcaTimeLeft == 0) {
                player.pcaTimeLeft = player.pcaTime
                makechunk()
            }
            player.pcaTimeLeft -= 1
            document.getElementById("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy"
        }
    }
}

function batest() {
    if(getUpgradeTimesBought('baunlock') == 1) {
        document.getElementById("bashow").style.display='block'
        document.getElementById("divbau").style.display='none'
        document.getElementById("divbauextra").style.display='none'
        document.getElementById("baunlockbutton").style.display='none'
        if(player.baToggle == true) {
            if(player.baTimeLeft == 0) {
                player.baTimeLeft = player.baTime
                bang()
            }
            player.baTimeLeft -= 1
            document.getElementById("untilba").textContent = player.baTimeLeft + " left until next autobuy"
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
    document.getElementById("stat").textContent = JSON.stringify(player)
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
