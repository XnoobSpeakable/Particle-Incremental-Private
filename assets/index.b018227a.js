const p = function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
};true&&p();

var style = /* #__PURE__ */ (() => "button:hover {\n  color: blue;\n}\nbutton:active {\n  color: #0099FF\n}\n#divgencost {\n  display: inline-block;\n}\n#divbbcost {\n  display: inline-block;\n  text-indent: 2.25em;\n}\n#divspeedcost {\n  display: inline-block;\n  text-indent: 2.25em;\n}\n#counter {\n  font-size: larger;\n}\n#alphacounter {\n  font-size: larger;\n}\n#divmbupcost {\n  display: inline-block;\n  text-indent: 6.5em;\n}\n#divmbmultcost {\n  display: inline-block;\n  text-indent: 5.75em;\n}\n#divalphaacceleratorcost {\n  display: inline-block;\n}\n#pcosttext {\n  display: inline-block;\n  text-indent: 4em;\n}\n#divgenboost {\n  display: inline-block;\n}\n#divgbuptcost {\n  display: inline-block;\n  text-indent: 7.5em;\n}\n#divgbupmcost {\n  display: inline-block;\n  text-indent: 4.75em;\n}\n#divthreeboostcost {\n  display: inline-block;\n}\n#divperbangcost {\n  display: inline-block;\n  text-indent: 7.25em;\n}\n#resetb {\n  color: red\n}\n#resetb:hover {\n  color: #FF00FF\n}\n#resetb:active {\n  color: #0099FF\n}\n#stat {\n  word-break:break-all;\n}\n#divunlockpca {\n  display: inline-block;\n}\n#divupgradepcacost {\n  display: inline-block;\n  text-indent: 10em;\n}\n#divtogglepca {\n  display: inline-block;\n  text-indent: 1.75em;\n}\n#divboosterupcost {\n  display: inline-block;\n}\n#divboosteruppercentcost {\n  display: inline-block;\n  text-indent: 15em;\n}\n#omegabasecost {\n  display: inline-block;\n}\n#omegaalphacost {\n  display: inline-block;\n  text-indent: 3.5em;\n}\n#omegabetacost {\n  display: inline-block;\n  text-indent: 6em;\n}\n#omegagammacost {\n  display: inline-block;\n  text-indent: 4em;\n}\n#omegadeltacost {\n  display: inline-block;\n  text-indent: 4em;\n}\n#divobase {\n  display: inline-block;\n}\n#divoalpha {\n  display: inline-block;\n  text-indent: 4.5em;\n}\n#divobeta {\n  display: inline-block;\n  text-indent: 7em;\n}\n#divogamma {\n  display: inline-block;\n  text-indent: 7em;\n}\n#divodelta {\n  display: inline-block;\n  text-indent: 7em;\n}\n#boostsection {\n  flex: space-evenly;\n  flex-direction: row;\n  gap: 2.375em\n}\n#nbnb {\n  flex: space-evenly;\n  flex-direction: row;\n  gap: 1.5em\n}\n#divbau {\n  display: inline-block\n}\n#divupgradeba {\n  display: inline-block;\n  text-indent: 5.25em;\n}\n#divtoggleba {\n  display: inline-block;\n  text-indent: 6em;\n}\n#bnbn {\n  display: flex;\n  flex: space-evenly;\n  flex-direction: row;\n  gap: 1.5em\n}\n#gboostdouble {\n  display: inline-block;\n}\n#alphamachinedouble {\n  display: inline-block;\n  text-indent: 7.4em;\n}")();

let player;
function getUpgradeCost(upgradeName) { return player.upgrades[upgradeName].cost }
function setUpgradeCost(upgradeName, costIn) { player.upgrades[upgradeName].cost = (costIn); }
function getUpgradeTimesBought(upgradeName) { return player.upgrades[upgradeName].timesBought }

function load() {
    if(localStorage.getItem('savefile') == null) {
        player = {
            version: "b1.21.0",
            upgrades: { 
                'gen': { cost: 0, timesBought: 0 },
                'bb': { cost: 2000, timesBought: 0},
                'speed': { cost: 50, timesBought: 0},
                'mbup': { cost: 50, timesBought: 0},
                'mbmult': { cost: 1000, timesBought: 0},
                'unlockgb': { cost: 5000, timesBought: 0},
                'gbupt': { cost: 100, timesBought: 0},
                'gbupm': { cost: 10000, timesBought: 0},
              },
            num: 0,
            gbTimeLeft: 0,
            gbTimeLeftCon: 10,
            gbMult: 1,
            nuclearCost: 1e+6,
            npOff: 1,
            alphaAccCost: 1e+10,
            alphaAccelerators: 0,
            pChunks: 0,
            alphaNum: 0,
            bangTime: 300,
            bangTimeLeft: 1e+300,
            alphaAcceleratorsLeft: 0,
            alphaInc: 1,
            tbCost: 1,
            tbMultiplier: 1,
            perBangMult: 1,
            pbCost: 4,
            eSetting: 1e+4,
            tempBoost: 1,
            bangSpeedCost: 1,
            bangSpeedBought: 0,
            pcaUnlocked: false,
            pcaToggle: true,
            pcaUpCost: 2,
            pcaTime: 160,
            pcaTimeLeft: 0,
            pcaUpBought: 0,
            pcaFracMult: 2,
            autoSaveDelay: 300,
            autoSaveMode: 1,
            autoSaveSet: 300,
            boosterParticles: 0,
            bpPercent: 1,
            bpGainMult: 1,
            untilBoost: 1,
            bpUpCost: 100,
            bpPercentCost: 100,
            themeNumber: 0,
            omegaBase: 0,
            omegaBaseCost: 1e+10,
            omegaAlpha: 0,
            omegaAlphaCost: 1e+12,
            bangAutobuyerUnlocked: false,
            baToggle: true,
            baUpCost: 1,
            baTime: 160,
            baTimeLeft: 0,
            baUpBought: 0,
            baFracMult: 2,
            nuclearAlphaCost: 1e+6,
            napOff: 1,
            gBoostDoubleCost: 1,
            gBoostSquare: 0,
            alphaMachineDoubleCost: 1000,
            alphaMachineMulti: 0,
          };
    }
    else {
        player = JSON.parse(localStorage.getItem('savefile'));
    }
    if(player.version != "b1.21.0") {
        player.version = "b1.21.0";
        alert("This specific version completely breaks compatibility with older saves. Sorry for the inconvenience.");
    }
}

function format(n) {
    if(n >= player.eSetting) {
        const e = Math.floor(Math.log10(n));
        const m = n / Math.pow(10, e);
        return `${m.toFixed(2)}e${e}`;
    }
    else {
        if(n % 1 != 0) {
            return n.toFixed(2) 
        }
        else {
            return n
        }
    }
} 
//tysm Diamboy for the complicated part of this function.

function UpdateCostVal(elementID, variable, currency = "Base") {
    if(currency == "Base") {
    document.getElementById(elementID).textContent = "Cost: " + format(variable);
    }
    else {
        document.getElementById(elementID).textContent = "Cost: " + format(variable) + currency;
    }
}

const upgrades = {
    'gen': { multiplier: 4, scaleFunction: scaleGen, costDiv: "divgencost", currency: "Base"},
    'bb': {  multiplier: 2, scaleFunction: scaleMultiplier, costDiv: "divbbcost", currency: "Base"},
    'speed': {  multiplier: NaN, scaleFunction: scaleSpeed, costDiv: "divspeedcost", currency: "Base"},
    'mbup': {  multiplier: 2, scaleFunction: scaleMultiplier, costDiv: "divmbupcost", currency: "Base"},
    'mbmult': {  multiplier: 3, scaleFunction: scaleMultiplier, costDiv: "divmbmultcost", currency: "Base"},
    'unlockgb': {  multiplier: Infinity, scaleFunction: scaleMultiplier, costDiv: "divgenunlockcost", currency: "Base"},
    'gbupt': {  multiplier: 5, scaleFunction: GBExtraExecT, costDiv: "divgbuptcost", currency: "Base"},
    'gbupm': {  multiplier: 5, scaleFunction: GBExtraExecM, costDiv: "divgbupmcost", currency: "Base"},
};

function scaleMultiplier(upgradeName) {
    const upgrade = upgrades[upgradeName];
    setUpgradeCost(upgradeName, (getUpgradeCost(upgradeName) * upgrade.multiplier));
}
function GBExtraExecT(upgradeName) {
    scaleMultiplier(upgradeName);
    player.gbTimeLeftCon += 20 * Math.pow(2, player.gBoostSquare);
    player.gbTimeLeft = 0;
    player.gbTimeLeft = player.gbTimeLeftCon;
}
function GBExtraExecM(upgradeName) {
    scaleMultiplier(upgradeName);
    player.gbMultCon += 5;
    player.gbTimeLeft = 0;
    player.gbTimeLeft = player.gbTimeLeftCon;
}

function scaleSpeed(upgradeName) {
    if(getUpgradeTimesBought(upgradeName) % 10 == 0) {
        setUpgradeCost(upgradeName, (getUpgradeTimesBought(upgradeName) * 5 + 100));
    }
}

function scaleGen(upgradeName) {
    const upgrade = upgrades[upgradeName];
    if(getUpgradeCost(upgradeName) == 0) {
        setUpgradeCost(upgradeName, 1000);
    }
    else {
        setUpgradeCost(upgradeName, (getUpgradeCost(upgradeName) * upgrade.multiplier));
    }
}

window.buyUpgrade = function (upgradeName) {
    const upgrade = upgrades[upgradeName];
    const oldCost = getUpgradeCost(upgradeName);
    if (player.num >= oldCost) {
        player.upgrades[upgradeName].timesBought++;
        player.num -= oldCost;
        upgrade.scaleFunction(upgradeName);
        UpdateCostVal(upgrade.costDiv, getUpgradeCost(upgradeName), upgrade.currency);
    }   
};

const themes = [
    { textColor: "black", bgColor: "#EEEEEE", buttonColor: "#DFDFDF", borderColor: "#333333", themeName: "Light" },
    { textColor: "#EBEBEB", bgColor: "#696969", buttonColor: "#999999", borderColor: "black", themeName: "Dark" },
    { textColor: "black", bgColor: "#EEEEEE", buttonColor: "#DFDFDF", borderColor: "#F33333", themeName: "Red Borders" },
    { textColor: "#CCCCCC", bgColor: "#000000", buttonColor: "#CCCCCC", borderColor: "#CCCCCC", themeName: "Black" },
    { textColor: "#EEEEEE", bgColor: "#000000", buttonColor: "#EEEEEE", borderColor: "#EEEEEE", themeName: "High contrast black" },
];
function themeExec() {
    const { textColor, bgColor, buttonColor, borderColor, themeName } = themes[player.themeNumber];
    document.getElementById('diventirebody').style = "color: " + textColor;
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
};
function prePUD() {
    document.getElementById("tabopenalpha").style.display='none';
    document.getElementById("tabopenbeta").style.display='none';
    document.getElementById("tabopengamma").style.display='none';
    document.getElementById("tabopendelta").style.display='none';
    document.getElementById("tabopenomega").style.display='none';
}
function passiveUnlockDisplay() {
    if(player.num >= 1e9) {
        document.getElementById("tabopenalpha").style.display='inline';
        document.getElementById("tabopenomega").style.display='inline';
    }
    if(player.alphaNum >= 1e9) {
        document.getElementById("tabopenbeta").style.display='inline';
    }
}

const autosaveElement = document.getElementById("autosaving"); 

function loadMisc() {
    themeExec();
    prePUD();
    passiveUnlockDisplay();
    autosavetextanddelayupdate();
    for (const upgradeName in upgrades) {
        const upgrade = upgrades[upgradeName];
        UpdateCostVal(upgrade.costDiv, getUpgradeCost(upgradeName), upgrade.currency);
    }
    if(getUpgradeTimesBought('gen') == 0) {
        document.getElementById("divgencost").textContent = "Cost: Free";
    }
    else {
        UpdateCostVal("divgencost", getUpgradeCost('gen'));
    }
    if(getUpgradeTimesBought('unlockgb') == 1) {
        document.getElementById("gbshow").style.display='block';
        document.getElementById("divgenunlockcost").style.display='none';
        document.getElementById("gbunlockbutton").style.display='none';
    }
    UpdateCostVal("divalphaacceleratorcost", player.alphaAccCost);
    document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks);
    UpdateCostVal("divthreeboostcost", player.tbCost, "Alpha");
    UpdateCostVal("divperbangcost", player.pbCost, "Alpha");
    UpdateCostVal("divnuclearcost", player.nuclearCost);
    document.getElementById("divnp").textContent = "Nuclear Particles: " + format(player.npOff - 1);
    document.getElementById("divbangspeedcost").textContent = "Cost: " + format(player.bangSpeedCost) + " Alpha";
    document.getElementById("divupgradepcacost").textContent = "Cost: " + format(player.pcaUpCost) + " Alpha";
    if(player.pcaUnlocked) {
        document.getElementById("divunlockpca").textContent = "Unlocked";
        document.getElementById("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy";
        document.getElementById("divtogglepca").style.display='inline-block';
        if(player.pcaToggle) {
            document.getElementById("divtogglepca").textContent = "On";
        }
        else {
            document.getElementById("divtogglepca").textContent = "Off";
        }
    }
    document.getElementById("divupgradepcacost").textContent = "Cost: " + format(player.pcaUpCost) + " Alpha";
    document.getElementById("divboosterupcost").textContent = format(player.bpUpCost) + " Alpha particles";
    document.getElementById("divboosteruppercentcost").textContent = format(player.bpPercentCost) + " Alpha particles";
    document.getElementById("omegabasecost").textContent = "Cost: " + format(player.omegaBaseCost);
    document.getElementById("divobase").textContent = "You have " + format(player.omegaBase);
    document.getElementById("omegaalphacost").textContent = "Cost: " + format(player.omegaAlphaCost);
    document.getElementById("divoalpha").textContent = "You have " + format(player.omegaAlpha);
    if(player.bangAutobuyerUnlocked) {
        document.getElementById("divbau").textContent = "Unlocked";
        document.getElementById("untilba").textContent = player.pcaTimeLeft + " left until next autobuy";
        document.getElementById("divtoggleba").style.display='inline-block';
        if(player.baToggle) {
            document.getElementById("divtoggleba").textContent = "On";
        }
        else {
            document.getElementById("divtoggleba").textContent = "Off";
        }
    }
    document.getElementById("gboostdouble").textContent = "Cost: " + format(player.gBoostDoubleCost) + " Alpha";
    document.getElementById("alphamachinedouble").textContent = "Cost: " + format(player.alphaMachineDoubleCost) + " Alpha";
}

function makeElementMap(...names) {
    const entries = names.map(function (x) { return [x, document.getElementById(x)]; });
    return Object.fromEntries(entries);
}
const tabElements = makeElementMap('Base', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Stats', 'Settings', 'Tutorial');
const tabOmegaElements = makeElementMap('oBase', 'oAlpha', 'oBeta', 'oGamma', 'oDelta', 'oOmega');
function hideElements(elements) {
    for (const name in elements) { elements[name].style.display = 'none'; }
}
window.openTab = function (tab) {
    if(tab in tabOmegaElements) { hideElements(tabOmegaElements); }
    else { hideElements(tabElements); }
    document.getElementById(tab).style.display = 'block';
};

load();
loadMisc();

window.setting1e4 = function () { player.eSetting = 1e+4; loadMisc(); };
window.setting1e6 = function () { player.eSetting = 1e+6; loadMisc(); };

window.mbman = function () {
    player.num += (getUpgradeTimesBought('mbup') + 1) * (getUpgradeTimesBought('mbmult') + 1);
    document.getElementById("counter").textContent = format(player.num) + " particles";
};

window.gbboost = function () {
    player.gbTimeLeft = player.gbTimeLeftCon;
};

function makechunk() {
if(player.num >= 1e+9) {
    player.num -= 1e+9;
    player.pChunks += 1;
    document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks);
}
}

function bang() {
if(player.pChunks >= 2) {
    if(player.alphaAcceleratorsLeft > 0) {
        player.alphaAcceleratorsLeft -= player.alphaAccelerators;
        player.pChunks -=2;
        player.bangTimeLeft = player.bangTime;
        document.getElementById("chunkamount").textContent = "Particle Chunks: " + format(player.pChunks);
        document.getElementById("boostersmaintext").style.display='block';
    }
}
}

function autosavetextanddelayupdate() {
    switch(player.autoSaveMode) {
        case 0:
            player.autoSaveSet = 600;
            autosaveElement.textContent = "On, delay: 60s";
            player.autoSaveDelay = 600;
            break;
        case 1:
            player.autoSaveSet = 300;
            autosaveElement.textContent = "On, delay: 30s";
            player.autoSaveDelay = 300;
            break;
        case 2:
            player.autoSaveSet = 150;
            autosaveElement.textContent = "On, delay: 15s";
            player.autoSaveDelay = 150;
            break;
        case 3:
            player.autoSaveSet = 100;
            autosaveElement.textContent = "On, delay: 10s";
            player.autoSaveDelay = 100;
            break;
        case 4:
            player.autoSaveSet = 50;
            autosaveElement.textContent = "On, delay: 5s";
            player.autoSaveDelay = 50;
            break;
        case 5:
            player.autoSaveSet = 1e+300;
            autosaveElement.textContent = "Off";
            player.autoSaveDelay = 1e+300;
            break;
    }
}

window.autosavesettings = function () {
    if(player.autoSaveMode == 5) {
        player.autoSaveMode = 0;
    }
    else {
    player.autoSaveMode++;
    }
    autosavetextanddelayupdate();
};

function fgbtest() {
    if(getUpgradeTimesBought('gen') > 0) {
        document.getElementById("boostsection").style.display='flex';
        document.getElementById("bigboosttext").style.display='block';
        document.getElementById("veryouterboost").style.display='block';
        if(player.gbTimeLeft > 0) {
            player.gbMult = (getUpgradeTimesBought('gbupm')*5+5);
        }
        else {
            player.gbMult = 1;
        }
        if(getUpgradeTimesBought('unlockgb') == 1) {
            document.getElementById("gbshow").style.display='block';
            document.getElementById("divgenunlockcost").style.display='none';
            document.getElementById("gbunlockbutton").style.display='none';
        }
        
        if(player.bangTimeLeft == 0) {
            player.alphaAcceleratorsLeft += player.alphaAccelerators;
            player.alphaNum += player.alphaInc * player.alphaAcceleratorsLeft * player.perBangMult * player.napOff * Math.pow(2, player.alphaMachineMulti);
            document.getElementById("bangtimeleft").textContent = "";
        }

        const alphagaindisplay = player.alphaInc * player.alphaAccelerators * player.perBangMult * player.napOff * Math.pow(2, player.alphaMachineMulti);
        const gain = (getUpgradeTimesBought('bb')+1) * getUpgradeTimesBought('gen') * (getUpgradeTimesBought('speed')/10+0.1) * player.gbMult * player.npOff * player.npOff * player.tbMultiplier * player.tempBoost * (1 + (((player.boosterParticles / 100) * player.bpPercent) / 100));

        document.getElementById("alphapb").textContent = "You are getting " + format(alphagaindisplay) + " Alpha/bang";
        player.bangTimeLeft -= 1;
        if(player.bangTimeLeft > 0 && player.bangTimeLeft < player.bangTime) {
            document.getElementById("bangtimeleft").textContent = "Bang time left: " + player.bangTimeLeft;
        }
        if(player.gbTimeLeft > 0) {
            player.gbTimeLeft -= 1;
        }
        document.getElementById("divgbtl").textContent = "Boost Time Left: " + format(player.gbTimeLeft);
        
        player.untilBoost -= 1;
        if(player.untilBoost == 0) {
            player.untilBoost = 10;
            player.boosterParticles += player.alphaNum * player.bpGainMult;
            document.getElementById("boostersmaintext").textContent = "You are currently getting " + format(player.bpGainMult) + " booster particles per alpha particle per second, resulting in a +" + format(player.boosterParticles * player.bpPercent / 100) + "% boost to base particle production";
        }
        document.getElementById("bpamount").textContent = "You have " + format(player.boosterParticles) + " booster particles"; 

        if(player.num > 1e+6 && player.num < 1e+12) {
            player.tempBoost = 1.5;
            document.getElementById("tmp").style.display='block';
        }
        else {
            player.tempBoost = 1;
            document.getElementById("tmp").style.display='none';
        }

        player.num += gain;
        document.getElementById("particlespersecond").textContent = "You are getting " + format(gain * 10) + " particles/s";

        if(player.num >= 1000000) {
            document.getElementById("nuclearreach").style.display='none';
            document.getElementById("nuclearshow").style.display='block';
        }
        if(player.alphaNum >= 1000000) {
            document.getElementById("nuclearalphareach").style.display='none';
            document.getElementById("nuclearalphashow").style.display='block';
        }
        if(player.num >= 1000000000) {
            document.getElementById("bangreach").style.display='none';
            document.getElementById("bangshow").style.display='block';
        }
        document.getElementById("counter").textContent = format(player.num) + " particles";
        document.getElementById("alphacounter").textContent = format(player.alphaNum) + " Alpha particles";
        }
    }

function pcatest() {
    if(player.pcaUnlocked == true) {
        if(player.pcaToggle == true) {
            if(player.pcaTimeLeft == 0) {
                player.pcaTimeLeft = player.pcaTime;
                makechunk();
            }
            player.pcaTimeLeft -= 1;
            document.getElementById("untilpca").textContent = player.pcaTimeLeft + " left until next autobuy";
        }
    }
}

function batest() {
    if(player.bangAutobuyerUnlocked == true) {
        if(player.baToggle == true) {
            if(player.baTimeLeft == 0) {
                player.baTimeLeft = player.baTime;
                bang();
            }
            player.baTimeLeft -= 1;
            document.getElementById("untilba").textContent = player.baTimeLeft + " left until next autobuy";
        }
    }
}

function savinginloop() {
	player.autoSaveDelay -= 1;
    if(player.autoSaveDelay == 0) {
        player.autoSaveDelay = player.autoSaveSet;
        save();
	}
}

//game loop
setInterval(() => {
    passiveUnlockDisplay();
    pcatest();
    batest();
    fgbtest();
    document.getElementById("stat").textContent = JSON.stringify(player);
	savinginloop();
    }, 100);

window.save = function () {
    const savefile = JSON.stringify(player);
    localStorage.setItem('savefile', savefile);
};
const save = window.save;

window.reset = function () {
    localStorage.removeItem('savefile');
};
//# sourceMappingURL=index.b018227a.js.map
