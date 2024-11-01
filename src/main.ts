/* eslint-disable @typescript-eslint/restrict-template-expressions */
import "./style.css";
import "./music";
import {
    load,
    loadSettings,
    getUpgradeTimesBought,
    getUpgradeCost,
    player,
    playerSettings,
    UpgradeNames,
    type InstantAutobuyerName,
    isAutobuyerName,
    type UpgradeName,
    setUpgradeCost,
    setUpgradeTimesBought
} from "./player";
import {
    format,
    formatBig,
    getElement,
    onBought,
    onBoughtInc,
    formatBigSpecific,
    formatDecimal
} from "./util";
import { UpdateCostDisplay, upgrades, buyUpgrade } from "./upgrades";
import { createAchievementHTML } from "./achievements";
import { nextFeatureHandler } from "./features";
import Decimal from "break_eternity.js";

declare global {
    interface Window {
        theme: VoidFunction;
        autosavesettings: VoidFunction;
        openTab: (tab: string) => void;
        saveExport: () => Promise<void>;
        saveImport: VoidFunction;
        saveImportConfirm: VoidFunction;
        experimentalToggle: VoidFunction;
        devToggle: VoidFunction;
        mbman: VoidFunction;
        gbboost: VoidFunction;
        makechunk: VoidFunction;
        bang: VoidFunction;
        togglepca: VoidFunction;
        toggleaga: VoidFunction;
        buyomegabase: VoidFunction;
        buyomegaalpha: VoidFunction;
        buyomegabeta: VoidFunction;
        buyomegagamma: VoidFunction;
        buyomegadelta: VoidFunction;
        toggleba: VoidFunction;
        makegroup: VoidFunction;
        merge: VoidFunction;
        togglema: VoidFunction;
        instantAutobuyerToggle: (
            autobuyerVar: InstantAutobuyerName,
            autobuyerDiv: string
        ) => void;
        buyFuel: (fuelType: Fuels) => void;
        unlockSelfcell: (cell: string, n: number) => void;
        respecSelfcell: (cell: string) => void;
        transformPrimgens: VoidFunction;
        saveSettings: VoidFunction;
        save: VoidFunction;
        reset: VoidFunction;
        Decimal?: typeof Decimal;
    }
}

if (import.meta.env.DEV) window.Decimal = Decimal;

loadSettings();
load();

const divEntireBody = getElement("diventirebody");
const whatTheme = getElement("whattheme");
const tabOpenFactory = getElement("tabopenfactory");
const tabOpenAlpha = getElement("tabopenalpha");
const tabOpenBeta = getElement("tabopenbeta");
const tabOpenGamma = getElement("tabopengamma");
const tabOpenDelta = getElement("tabopendelta");
const tabOpenOmega = getElement("tabopenomega");
const tabOpenOmegaOmega = getElement("tabopenomegaomega");
const tabOpenReactor = getElement("tabopenreactor");
const tabOpenStats = getElement("tabopenstats");
const tabOpenAchievements = getElement("tabopenachievements");
const tabOpenDev = getElement("tabopendev");
const devToggle = getElement("devtoggle");
const autosaveElement = getElement("autosaving");
const divTogglePcaElement = getElement("divtogglepca");
const untilPcaElement = getElement("untilpca");
const divToggleAgaElement = getElement("divtoggleaga");
const untilAgaElement = getElement("untilaga");

/**
 * Array, listing the amount of time in deciseconds/game ticks before the next autosave, for each autosave mode.
 */
const delayArray = [600, 300, 150, 100, 50, 20, 10];

/**
 * Array, listing the properties of each game theme.
 */
const themes = [
    {
        textColor: "#EBEBEB",
        bgColor: "#0e0e0e",
        buttonColor: "",
        borderColor: "",
        gradientColor: "",
        themeName: "Dark Rework v2",
        disableGradient: true
    },
    {
        textColor: "#EBEBEB",
        bgColor: "#222422",
        buttonColor: "",
        borderColor: "#BABABA",
        gradientColor: "black",
        themeName: "Dark Rework",
        disableGradient: false
    },
    {
        textColor: "#D4D4D4",
        bgColor: "rgb(14, 16, 14)",
        buttonColor: "",
        borderColor: "#000000",
        gradientColor: "black",
        themeName: "Darker Rework",
        disableGradient: false
    },
    {
        textColor: "#000000",
        bgColor: "#CCCCCC",
        buttonColor: "",
        borderColor: "#333333",
        gradientColor: "white",
        buttonGradientOverride: true,
        themeName: "Light Rework",
        disableGradient: false
    },
    {
        textColor: "#000000",
        bgColor: "#CCCCCC",
        buttonColor: "",
        borderColor: "#DD1111",
        gradientColor: "white",
        buttonGradientOverride: true,
        themeName: "Red Borders",
        disableGradient: false
    },
    {
        textColor: "#CCCCCC",
        bgColor: "#000000",
        buttonColor: "#444444",
        borderColor: "#CCCCCC",
        gradientColor: "#444444",
        themeName: "Black",
        disableGradient: false
    },
    {
        textColor: "#000000",
        bgColor: "#FF91AF",
        buttonColor: "#FFA1BF",
        borderColor: "#FFD1FF",
        gradientColor: "#FFA1BF",
        themeName: "Pink",
        disableGradient: false
    },
    {
        textColor: "#3DD7DE",
        bgColor: "#191970",
        buttonColor: "#3DD7DE",
        borderColor: "#23A6D0",
        gradientColor: "#7090FF",
        buttonGradientOverride: true,
        themeName: "Blue",
        disableGradient: false
    },
    {
        textColor: "#000000",
        bgColor: "#DEB2EF",
        buttonColor: "#8A7AED",
        borderColor: "#6A5ACD",
        gradientColor: "#5A1C61",
        buttonGradientOverride: true,
        themeName: "Purple",
        disableGradient: false
    },
    {
        textColor: "#EBEBEB",
        bgColor: "#696969",
        buttonColor: "#999999",
        borderColor: "#000000",
        gradientColor: "transparent",
        themeName: "Classic",
        disableGradient: false
    },
    {
        textColor: "#EBEBEB",
        bgColor: "#696969",
        buttonColor: "#999999",
        borderColor: "#000000",
        gradientColor: "transparent",
        themeName: "Classic Colors",
        disableGradient: false,
    }
];

/**
 * Executes the changing of game theme.
 */
function themeExec(): void {
    const theme = themes[playerSettings.themeNumber];
    if (theme === undefined) {
        throw new Error("theme dosen't exist!");
    }
    const {
        textColor,
        bgColor,
        buttonColor,
        borderColor,
        gradientColor,
        buttonGradientOverride,
        themeName,
        disableGradient,
    } = theme;

    divEntireBody.style.opacity = "1";
    divEntireBody.style.color = textColor;
    getElement("Settings").style.color = textColor;
    getElement("Tutorial").style.color = textColor;
    getElement("Omega").style.color = textColor;
    document.body.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    const className = document.getElementsByClassName("button");
    for (const element of className) {
        if (!(element instanceof HTMLElement)) {
            throw new Error(`element is not an HTMLElement`);
        }
        element.style.backgroundColor = buttonColor;

        if (themeName === "Classic") {
            element.style.border = "1px solid black";
            element.style.borderRadius = "2px";
            element.style.background = buttonColor;
            element.style.color = "black";
            element.style.fontWeight = "400";
        } else if (themeName === "Classic Colors") {
            element.style.border = "";
            element.style.borderRadius = "8px";
            element.style.color = "black";
            element.style.fontWeight = "500";
        } else {
            element.style.border = "";
            element.style.borderRadius = "8px";
            element.style.color = "snow";
            element.style.fontWeight = "500";

            if (buttonGradientOverride === undefined && disableGradient) {
                element.style.background = `linear-gradient(45deg, ${gradientColor}, transparent)`;
            } else if (disableGradient) {
                element.style.background = `linear-gradient(45deg, black, transparent)`;
            } else {
                element.style.background = buttonColor;
            }
        }
    }

    const className2 = document.getElementsByClassName("withtheoutline");
    for (const element of className2) {
        if (!(element instanceof HTMLElement)) {
            throw new Error(`element is not an HTMLElement`);
        }
        element.style.border = `0.2em solid ${borderColor}`;
    }

    const className3 = document.getElementsByClassName("redb");
    for (const element of className3) {
        if (!(element instanceof HTMLElement)) {
            throw new Error(`element is not an HTMLElement`);
        }
        element.style.backgroundColor = buttonColor;
    }

    whatTheme.textContent = `Theme: ${themeName}`;
}

themeExec();

/**
 * Switches over to the next game theme
 */
window.theme = function (): void {
    playerSettings.themeNumber =
        (playerSettings.themeNumber + 1) % themes.length;
    themeExec();
    arbitraryHighlight("manualboost");
    arbitraryHighlight("generatorboost");
    saveSettings();
};

/**
 * Hides the buttons for accessing all tabs that are not unlocked by default.
 */
function prePUD(): void {
    tabOpenFactory.style.display = "none";
    tabOpenAlpha.style.display = "none";
    tabOpenBeta.style.display = "none";
    tabOpenReactor.style.display = "none";
    tabOpenGamma.style.display = "none";
    tabOpenDelta.style.display = "none";
    tabOpenOmega.style.display = "none";
    tabOpenStats.style.display = "none";
    tabOpenOmegaOmega.style.display = "none";
}

/**
 * Shows a new feature when the player has progressed enough to unlock a feature that unlocks passively.
 */
function passiveUnlockDisplay(): void {
    if (player.num.gte(1e5)) {
        tabOpenFactory.style.display = "inline";
    }
    if (player.num.gte(1e9) || player.alphaNum.gt(Decimal.dZero)) {
        tabOpenAlpha.style.display = "inline";
        tabOpenOmega.style.display = "inline";
    }
    if (player.alphaNum.gte(1e9) || player.betaNum.gt(Decimal.dZero)) {
        tabOpenBeta.style.display = "inline";
    }
    if (player.betaNum.gte(300)) {
        tabOpenReactor.style.display = "inline";
    }
    if (playerSettings.useExperimental) {
        // TODO: remove exprimental when you want
        tabOpenGamma.style.display = "inline";
        tabOpenDelta.style.display = "inline";
        tabOpenOmegaOmega.style.display = "inline";
        tabOpenStats.style.display = "inline";
        tabOpenAchievements.style.display = "inline";
    }
}

/**
 * Displays Dev tab when the setting to display it is turned on. Does opposite when said setting is turned off.
 */
function devToolsVisibilityUpdate(): void {
    tabOpenDev.style.display = playerSettings.devToggled ? "inline" : "none";
    devToggle.textContent = playerSettings.devToggled.toString();
}

/**
 * Changes the delay between autosaves.
 */
function autoSaveSet(): void {
    const delay = delayArray[playerSettings.autoSaveMode];
    playerSettings.autoSaveSet = playerSettings.autoSaveDelay = delay ?? 1e308;
    autosaveElement.textContent =
        delay !== undefined ? `On, delay: ${format(delay / 10)}s` : "Off";
}

/**
 * Changes autosave delay setting.
 */
window.autosavesettings = function (): void {
    playerSettings.autoSaveMode =
        (playerSettings.autoSaveMode + 1) % delayArray.length;
    autoSaveSet();
    saveSettings();
};

function pcaTestSingle(): void {
    if (getUpgradeTimesBought("unlockpca").eq(Decimal.dOne)) {
        untilPcaElement.textContent =
            format(player.chunkAutobuyerTimeLeft) + " left until next autobuy";
        getElement("divtogglepca").style.display = "inline-block";

        divTogglePcaElement.textContent = player.pcaToggle ? "on" : "off";
    }
}

function agaTestSingle(): void {
    if (getUpgradeTimesBought("unlockaga").eq(Decimal.dOne)) {
        untilAgaElement.textContent =
            format(player.chunkAutobuyerTimeLeft) + " left until next autobuy";
        getElement("divtoggleaga").style.display = "inline-block";

        divToggleAgaElement.textContent = player.agaToggle ? "On" : "Off";
    }
}

function baTestSingle() {
    if (getUpgradeTimesBought("bangautobuyerunlock").eq(Decimal.dOne)) {
        getElement("untilba").textContent =
            format(player.bangAutobuyerTimeLeft) + " left until next autobuy";
        getElement("divtoggleba").style.display = "inline-block";

        getElement("divtoggleba").textContent = player.bangAutobuyerToggle
            ? "On"
            : "Off";
    }
}

function maTestSingle() {
    if (getUpgradeTimesBought("mergeautobuyerunlock").eq(Decimal.dOne)) {
        getElement("untilma").textContent =
            format(player.mergeAutobuyerTimeLeft) + " left until next autobuy";
        getElement("divtogglema").style.display = "inline-block";

        getElement("divtogglema").textContent = player.mergeAutobuyerToggle
            ? "On"
            : "Off";
    }
}

function fgbTestSingle() {
    if (getUpgradeTimesBought("gen").eq(Decimal.dZero)) {
        getElement("divgencost").textContent = "Cost: Free";
    } else {
        UpdateCostDisplay("divgencost", getUpgradeCost("gen"));
    }
    if(player.selfcells === 1) {
        getElement("rotators").style.display = "none"
        getElement("generators").style.display = "none"
        getElement("movers").style.display = "none"
        getElement("selfcelltexts").style.display = "none"
        getElement("choosetext").style.display = "none"   
        getElement("br1").style.display = "none"
        getElement("br2").style.display = "none"    
    }
    if(player.unlockedSelfRotators) {
        getElement("rotatorsWindow").style.display = "block";
    }
    if(player.unlockedSelfGenerators) {
        getElement("generatorsWindow").style.display = "block";
    }
    if(player.unlockedSelfMovers) {
        getElement("moversWindow").style.display = "block";
    }
}

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
}
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
}

function instantAutobuyerState(
    autobuyerVar: InstantAutobuyerName,
    autobuyerDiv: string
): void {
    getElement(autobuyerDiv).textContent = player.instantAutobuyers[
        autobuyerVar
    ]
        ? "On"
        : "Off";
}

function amountUpdate() {
    if (getUpgradeTimesBought("unlocknpboost").eq(Decimal.dOne)) {
        getElement("divnp").textContent =
            "Nuclear Particles: " + formatDecimal(nuclearParticles, 1);
    } else {
        getElement("divnp").textContent =
            "Nuclear Particles: " +
            formatBig(getUpgradeTimesBought("nuclearbuy"));
    }
    if (getUpgradeTimesBought("unlocknapboost").eq(Decimal.dOne)) {
        getElement("divnap").textContent =
            "Nuclear Alpha Particles: " +
            formatDecimal(nuclearAlphaParticles, 1);
    } else {
        getElement("divnap").textContent =
            "Nuclear Alpha Particles: " +
            formatBig(getUpgradeTimesBought("nuclearalphabuy"));
    }

    getElement("chunkamount").textContent =
        "Particle Chunks: " + formatBig(player.pChunks);
    getElement("groupamount").textContent =
        "Particle Chunks: " + formatBig(player.aGroups);

    getElement("omegabasecost").textContent =
        "Cost: " + formatBig(player.omegaBaseCost);
    getElement("divobase").textContent =
        "You have " + formatBig(player.omegaBase);
    getElement("omegaalphacost").textContent =
        "Cost: " + formatBig(player.omegaAlphaCost);
    getElement("divoalpha").textContent =
        "You have " + formatBig(player.omegaAlpha);

    if (getUpgradeTimesBought("omegabooster").lte(3)) {
        getElement("divomegaboostersbought").textContent =
            `Bought: ${getUpgradeTimesBought("omegabooster").toString()}/3`;
        if (getUpgradeTimesBought("omegabooster").gte(3)) {
            getElement("omegaboosterbutton").style.display = "none"
        }
    }

    for (const autobuyerName in player.instantAutobuyers) {
        const autobuyerDiv = `div${autobuyerName}`;

        if (!isAutobuyerName(autobuyerName)) {
            throw new Error(
                "autoBuyerName dosen't match InstantAutobuyerName type"
            );
        }
        instantAutobuyerState(autobuyerName, autobuyerDiv);
    }
}

function loadMisc(): void {
    for (const upgradeName of UpgradeNames) {
        const upgrade = upgrades[upgradeName];
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

    themeExec();

    prePUD();
    passiveUnlockDisplay();

    autoSaveSet();

    devToolsVisibilityUpdate();

    pcaTestSingle();
    agaTestSingle();
    baTestSingle();
    maTestSingle();
    fgbTestSingle();

    getElement("counter").innerHTML =
        "<span style='color: #64ed93;'>" +
        formatBig(player.num) +
        "</span> particles";
    getElement("particlespersecond").innerHTML =
        "You are getting <span style='color: #ed6464;'> 0 </span> particles/s";

    amountUpdate();
}

function makeElementMap(...names: string[]): Record<string, HTMLElement> {
    return Object.fromEntries(names.map(x => [x, getElement(x)] as const));
}

const tabElements = makeElementMap(
    "Base",
    "Factory",
    "Alpha",
    "Beta",
    "Reactor",
    "Gamma",
    "Delta",
    "Omega",
    "OmegaOmega",
    "Achievements",
    "Stats",
    "Settings",
    "Tutorial",
    "Dev"
);
const tabOmegaElements = makeElementMap(
    "oBase",
    "oAlpha",
    "oBeta",
    "oGamma",
    "oDelta"
);

function hideElements(elements: Record<string, HTMLElement>) {
    for (const name in elements) {
        const element = elements[name];
        if (element === undefined) {
            throw new Error("element dosen't exist");
        }
        element.style.display = "none";
    }
}

window.openTab = function (tab: string): void {
    if (tab in tabOmegaElements) {
        hideElements(tabOmegaElements);
    } else {
        hideElements(tabElements);
    }
    getElement(tab).style.display = "block";
};

loadMisc();

window.saveExport = async function (): Promise<void> {
    await navigator.clipboard.writeText(save());
    alert("Copied to clipboard!");
};

window.saveImport = function (): void {
    getElement("importareaid").style.display = "block";
    getElement("saveimportconfirm").style.display = "block";
};

window.saveImportConfirm = function (): void {
    const saveEl = getElement("importareaid", "textarea");
    const savefile = saveEl.value; // really should check for an empty value here
    localStorage.setItem(location.pathname, savefile);
    location.reload();
};

window.experimentalToggle = function () {
    playerSettings.useExperimental = !playerSettings.useExperimental;

    if (playerSettings.useExperimental) {
        getElement("tabopengamma").style.display = "inline";
        getElement("tabopendelta").style.display = "inline";
        getElement("tabopenomegaomega").style.display = "inline";
        getElement("tabopenachievements").style.display = "inline";
    } else {
        getElement("tabopengamma").style.display = "none";
        getElement("tabopendelta").style.display = "none";
        getElement("tabopenomegaomega").style.display = "none";
        getElement("tabopenachievements").style.display = "none";
    }
    getElement("experimentoggle").textContent =
        playerSettings.useExperimental.toString();
    saveSettings();
};

window.devToggle = function () {
    playerSettings.devToggled = !playerSettings.devToggled;

    if (playerSettings.devToggled) {
        getElement("tabopendev").style.display = "inline";
    } else {
        getElement("tabopendev").style.display = "none";
    }
    getElement("devtoggle").textContent = playerSettings.devToggled.toString();
    saveSettings();
};

createAchievementHTML();

let machineProd = 10;
let clickerParticleMult = player.clickerParticles
    .div(100)
    .plus(Decimal.dOne)
    .times(machineProd);

const reactor = {
    isActive: false,
    fuelTime: new Decimal(300),
    boost: Decimal.dOne,
    fuelMult: Decimal.dOne
};
//did a bunch of work here
let NAPfactor = Decimal.dOne;
let BPfactor = Decimal.dOne;
let MBfactor = Decimal.dOne;
let GBfactor = Decimal.dOne;

let totalBoostFromNP = nuclearParticles.times(reactor.boost);
let totalBoostFromNAP = nuclearAlphaParticles.times(NAPfactor);
let totalMBBoost = MBfactor.times(
    Decimal.dTwo.pow(getUpgradeTimesBought("reactorupMB"))
);

/**
 * The function responsible for updating everything about the Reactor feature
 */
function reactorHandler() {
    reactor.fuelTime = onBought([
        new Decimal(300),
        "*",
        [new Decimal(1.25), "^", "reactoruptime"],
        "/",
        [Decimal.dTwo, "^", "reactorupmult"]
    ]);

    if (player.hyperfuel.lte(Decimal.dZero)) {
        player.hyperfuel = Decimal.dZero;

        if (player.superfuel.lte(Decimal.dZero)) {
            player.superfuel = Decimal.dZero;

            if (player.fuel.lte(Decimal.dZero)) {
                player.fuel = Decimal.dZero;

                reactor.isActive = false;
            } else {
                reactor.fuelMult = Decimal.dOne;
                reactor.isActive = true;
                player.fuel = player.fuel.minus(
                    Decimal.dOne.div(reactor.fuelTime)
                );
            }
        } else {
            reactor.fuelMult = new Decimal(3);
            reactor.isActive = true;
            player.superfuel = player.superfuel.minus(
                Decimal.dOne.div(reactor.fuelTime)
            );
        }
    } else {
        reactor.fuelMult = new Decimal(6561);
        reactor.isActive = true;
        player.hyperfuel = player.hyperfuel.minus(
            Decimal.dOne.div(reactor.fuelTime)
        );
    }

    if (reactor.isActive) {
        reactor.boost = onBoughtInc([
            [new Decimal(1.25), "^", "reactorupmult"],
            "*",
            reactor.fuelMult
        ]);
        getElement(
            "divreactorstatus"
        ).textContent = `Reactor status: Running (${formatDecimal(
            player.fuel,
            2
        )} Fuel)`;
    } else {
        reactor.boost = Decimal.dOne;
        getElement("divreactorstatus").textContent =
            "Reactor status: Out of fuel";
    }
    getElement(
        "divreactorfuelusage"
    ).textContent = `When active, your reactor is using up 1 fuel every ${formatBig(
        reactor.fuelTime.div(Decimal.dTen)
    )} seconds`;

    let NAPtoggle = false;
    let BPtoggle = false;
    let MBtoggle = false;
    let GBtoggle = false;

    if (getUpgradeTimesBought("reactorUnlockNAP").eq(Decimal.dOne)) {
        NAPtoggle = true;
        getElement("divreactorunlockNAPcost").textContent = "Unlocked";
        getElement("divreactornap").style.display = "block";
        getElement("reactorUnlockNAP").setAttribute("disabled", "true")
    }
    if (getUpgradeTimesBought("reactorUnlockBP").eq(Decimal.dOne)) {
        BPtoggle = true;
        getElement("divreactorunlockBPcost").textContent = "Unlocked";
        getElement("divreactorbp").style.display = "block";
        getElement("reactorUnlockBP").setAttribute("disabled", "true")
    }
    if (getUpgradeTimesBought("reactorUnlockMB").eq(Decimal.dOne)) {
        MBtoggle = true;
        getElement("divreactorunlockMBcost").textContent = "Unlocked";
        getElement("divreactormb").style.display = "block";
        getElement("reactorUnlockMB").setAttribute("disabled", "true")
    }
    if (getUpgradeTimesBought("reactorUnlockGB").eq(Decimal.dOne)) {
        GBtoggle = true;
        getElement("divreactorunlockGBcost").textContent = "Unlocked";
        getElement("divreactorgb").style.display = "block";
        getElement("reactorUnlockGB").setAttribute("disabled", "true")
    }

    NAPfactor = NAPtoggle
        ? reactor.boost.plus(Decimal.dOne).div(Decimal.dTwo)
        : Decimal.dOne;
    BPfactor = BPtoggle ? reactor.boost.plus(3).div(4) : Decimal.dOne;
    MBfactor = MBtoggle ? reactor.boost.pow(Decimal.dTwo) : Decimal.dOne;
    GBfactor = GBtoggle
        ? reactor.boost.plus(Decimal.dTwo).div(3)
        : Decimal.dOne;

    if (!reactor.isActive) {
        //just to make sure boosts are definitely inactive when reactor is out of fuel
        NAPfactor = Decimal.dOne;
        BPfactor = Decimal.dOne;
        GBfactor = Decimal.dOne;
        MBfactor = Decimal.dOne;
        totalMBBoost = Decimal.dOne;
    } else {
        totalMBBoost = MBfactor.times(
            Decimal.dTwo.pow(getUpgradeTimesBought("reactorupMB"))
        );
    }

    totalBoostFromNP = nuclearParticles.times(reactor.boost);
    totalBoostFromNAP = nuclearAlphaParticles.times(NAPfactor);

    getElement("divreactormain").textContent = `Current Reactor effects:`;
    getElement(
        "divreactornp"
    ).textContent = `Nuclear Particles ${formatBigSpecific(
        reactor.boost
    )}x as strong`;
    getElement("divreactormb").textContent = `Manual Boost ${formatBigSpecific(
        totalMBBoost
    )}x as strong`;
    getElement(
        "divreactornap"
    ).textContent = `Nuclear Alpha Particles ${formatBigSpecific(
        NAPfactor
    )}x as strong`;
    getElement(
        "divreactorgb"
    ).textContent = `Generator Boost ${formatBigSpecific(GBfactor)}x as strong`;
    getElement(
        "divreactorbp"
    ).textContent = `Booster Particle gain increase by ${formatBigSpecific(
        BPfactor
    )}x`;
}

/**
 * Executes when manual boost button is clicked. Calcuates and adds a gain to the num variable / particle amount
 */
window.mbman = function (): void {
    const gain = onBoughtInc(
        "mbup",
        "*",
        "mbmult",
        "*",
        clickerParticleMult,
        "*",
        totalBoostFromNP.plus(Decimal.dOne),
        "*",
        totalMBBoost
    );

    player.num = player.num.plus(gain);
    getElement("counter").textContent = formatBig(player.num) + " particles";
};

/**
 * Executes when generator boost button is pressed. Sets the genBoostTimeLeft to the correct value.
 */
window.gbboost = function (): void {
    player.genBoostTimeLeft = player.genBoostTimeLeftCon;
};

/**
 * Function responsible for buying a particle chunk when clicking on said button.
 */
function makechunk(): void {
    if (player.num.gte(1e9)) {
        player.num = player.num.minus(1e9);
        player.pChunks = player.pChunks.plus(Decimal.dOne);
        getElement("chunkamount").textContent =
            "Particle Chunks: " + formatBig(player.pChunks);
    }
}
window.makechunk = makechunk;

/**
 * Function responsible for executing Bang when clicking on said button.
 */
function bang(): void {
    if (player.pChunks.gte(Decimal.dTwo)) {
        if (
            getUpgradeTimesBought("alphaacc").gt(Decimal.dZero) &&
            !(
                player.bangTimeLeft >= 0 &&
                player.bangTimeLeft <= player.bangTime
            )
        ) {
            player.pChunks = player.pChunks.minus(Decimal.dTwo);
            player.bangTimeLeft = player.bangTime;
            getElement("chunkamount").textContent =
                "Particle Chunks: " + formatBig(player.pChunks);
            getElement("boostersmaintext").style.display = "block";
        }
    }
}
window.bang = bang;

/**
 * Toggles particle chunk autobuyer when toggle button is clicked.
 */
window.togglepca = function (): void {
    if (getUpgradeTimesBought("unlockpca").eq(Decimal.dOne)) {
        player.pcaToggle = !player.pcaToggle;
        getElement("divtogglepca").style.display = "inline-block";

        getElement("divtogglepca").textContent = player.pcaToggle
            ? "On"
            : "Off";
    }
};

/**
 * Toggles alpha group autobuyer when toggle button is clicked.
 */
window.toggleaga = function (): void {
    if (getUpgradeTimesBought("unlockaga").eq(Decimal.dOne)) {
        player.agaToggle = !player.agaToggle;
        getElement("divtoggleaga").style.display = "inline-block";

        getElement("divtoggleaga").textContent = player.agaToggle
            ? "On"
            : "Off";
    }
};

/**
 * Function responsible for buying Omega_Base perticles when said button is clicked.
 */
window.buyomegabase = function (): void {
    if (player.num.gte(player.omegaBaseCost)) {
        player.num = player.num.minus(player.omegaBaseCost);
        player.omegaBase = player.omegaBase.plus(Decimal.dOne);
        player.omegaBaseCost = player.omegaBaseCost.times(Decimal.dTen);
        getElement("omegabasecost").textContent =
            "Cost: " + formatBig(player.omegaBaseCost);
        getElement("divobase").textContent =
            "You have " + formatBig(player.omegaBase);
    }
};

/**
 * Function responsible for buying Omega_Alpha perticles when said button is clicked.
 */
window.buyomegaalpha = function (): void {
    if (player.alphaNum.gte(player.omegaAlphaCost)) {
        player.alphaNum = player.alphaNum.minus(player.omegaAlphaCost);
        player.omegaAlpha = player.omegaAlpha.plus(Decimal.dOne);
        player.omegaAlphaCost = player.omegaAlphaCost.times(100);
        getElement("omegaalphacost").textContent =
            "Cost: " + formatBig(player.omegaAlphaCost);
        getElement("divoalpha").textContent =
            "You have " + formatBigSpecific(player.omegaAlpha);
    }
};

window.buyomegabeta = function (): void {
    /* TODO: implement this */
};
window.buyomegagamma = function (): void {
    /* TODO: implement this */
};
window.buyomegadelta = function (): void {
    /* TODO: implement this */
};

/**
 * Toggles bang autobuyer when toggle button is clicked.
 */
window.toggleba = function (): void {
    if (getUpgradeTimesBought("bangautobuyerunlock").eq(Decimal.dOne)) {
        player.bangAutobuyerToggle = !player.bangAutobuyerToggle;
        getElement("divtoggleba").style.display = "inline-block";

        if (player.bangAutobuyerToggle) {
            getElement("divtoggleba").textContent = "On";
        } else {
            getElement("divtoggleba").textContent = "Off";
        }
    }
};

/**
 * Toggles merge autobuyer when toggle button is clicked.
 */
window.togglema = function (): void {
    if (getUpgradeTimesBought("mergeautobuyerunlock").eq(Decimal.dOne)) {
        player.mergeAutobuyerToggle = !player.mergeAutobuyerToggle;
        getElement("divtogglema").style.display = "inline-block";

        if (player.mergeAutobuyerToggle) {
            getElement("divtogglema").textContent = "On";
        } else {
            getElement("divtogglema").textContent = "Off";
        }
    }
};

function makegroup(): void {
    if (player.alphaNum.gte(1e9)) {
        player.alphaNum = player.alphaNum.minus(1e9);
        player.aGroups = player.aGroups.plus(Decimal.dOne);
        getElement("groupamount").textContent =
            "Alpha Groups: " + formatBig(player.aGroups);
    }
}
window.makegroup = makegroup;

function merge(): void {
    if (player.aGroups.gte(Decimal.dTwo)) {
        if (
            getUpgradeTimesBought("betaacc").gt(Decimal.dZero) &&
            !(
                player.mergeTimeLeft >= 0 &&
                player.mergeTimeLeft <= player.mergeTime
            )
        ) {
            player.aGroups = player.aGroups.minus(Decimal.dTwo);
            player.mergeTimeLeft = player.mergeTime;
            getElement("groupamount").textContent =
                "Alpha Groups: " + formatBig(player.aGroups);
        }
    }
}
window.merge = merge;

window.instantAutobuyerToggle = function (
    autobuyerVar: InstantAutobuyerName,
    autobuyerDiv: string
): void {
    player.instantAutobuyers[autobuyerVar] =
        !player.instantAutobuyers[autobuyerVar];
    getElement(autobuyerDiv).textContent = player.instantAutobuyers[
        autobuyerVar
    ]
        ? "On"
        : "Off";
};

type Fuels = "player.fuel" | "player.superfuel" | "player.hyperfuel";

window.buyFuel = function (fuelType: Fuels, bulk = Decimal.dOne) {
    if (fuelType === "player.fuel") {
        if (
            player.num.gte(bulk.times(1e42)) &&
            player.alphaNum.gte(bulk.times(1e14)) &&
            player.betaNum.gte(bulk.times(50))
        ) {
            player.num = player.num.minus(bulk.times(1e42));
            player.alphaNum = player.alphaNum.minus(bulk.times(1e14));
            player.betaNum = player.betaNum.minus(bulk.times(50));
            player.fuel = player.fuel.plus(bulk);
        }
    } else {
        //do this later TODO: add superfuel and hyperfuel buying
    }
};

let alphaFromReturn = Decimal.dZero;

function returnParticleHandler(): void {
    if (getUpgradeTimesBought("buyreturngenerator").gt(Decimal.dZero)) {
        const gain = onBought([
            new Decimal(0.1),
            "*",
            "buyreturngenerator",
            "*",
            player.betaNum,
            "*",
            ["rpup", "+", Decimal.dOne]
        ]);
        player.returnParticles = player.returnParticles.plus(gain);

        alphaFromReturn = onBought([
            new Decimal(0.1),
            "*",
            player.returnParticles,
            "*",
            [Decimal.dTwo, "^", "rpmult"],
            [totalBoostFromNAP, "+", Decimal.dOne],
            [Decimal.dTwo, "^", "alphamachinedouble"],
            "*",
            alphaMultFromRotators,
            "*",
            alphaMultFromGenerators
        ]);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        getElement("returnboosttext").textContent = `Your ${formatBig(
            player.returnParticles
        )} Return particles (+${formatBig(
            gain.times(10)
        )}/s) are returning ${formatBig(
            alphaFromReturn.times(10)
        )} Alpha particles per second`;
    }
}

function unlockSelfcell(cell: string, n: number) {
    if(player.betaNum.gte(1e7) && n === 1) {
        player.betaNum = player.betaNum.minus(1e7)
        player.selfcells = 1
        getElement("rotators").style.display = "none"
        getElement("generators").style.display = "none"
        getElement("movers").style.display = "none"
        getElement("selfcelltexts").style.display = "none"
        getElement("choosetext").style.display = "none"
        getElement("br1").style.display = "none"
        getElement("br2").style.display = "none"
        switch(cell) {
            case 'rotators':
                player.unlockedSelfRotators = true
                getElement("rotatorsWindow").style.display = "block";
                break;
            case 'generators':
                player.unlockedSelfGenerators = true
                getElement("generatorsWindow").style.display = "block";
                break;
            case 'movers':
                player.unlockedSelfMovers = true
                getElement("moversWindow").style.display = "block";
                break;
        }
    }
}
window.unlockSelfcell = unlockSelfcell

let generatorsRespecFlag = false

function respecSelfcell(cell: string) {
    getElement("rotators").style.display = "block"
    getElement("generators").style.display = "block"
    getElement("movers").style.display = "block"
    getElement("selfcelltexts").style.display = "block"
    getElement("choosetext").style.display = "block"
    getElement("br1").style.display = "block"
    getElement("br2").style.display = "block"
    switch(cell) {
        case 'rotators':
            player.unlockedSelfRotators = false
            player.selfcells -= 1
            getElement("rotatorsWindow").style.display = "none"
            setUpgradeCost("selfrotator", new Decimal(1e6))
            setUpgradeTimesBought("selfrotator", Decimal.dZero)
            setUpgradeCost("doublerotate", new Decimal(1e8))
            setUpgradeTimesBought("doublerotate", Decimal.dZero)
            setUpgradeCost("doublefreerotators", new Decimal(50))
            setUpgradeTimesBought("doublefreerotators", Decimal.dZero)

            player.degrees = Decimal.dZero
            player.freeRotators = Decimal.dZero
            tickRotators()

            break;
        case 'generators':
            player.unlockedSelfGenerators = false
            player.selfcells -= 1
            getElement("generatorsWindow").style.display = "none";
            setUpgradeCost("primgen", new Decimal(1e6))
            setUpgradeTimesBought("primgen", Decimal.dOne) //yes, one
            setUpgradeCost("supergentime", new Decimal(1e6))
            setUpgradeTimesBought("supergentime", Decimal.dZero)
            setUpgradeCost("supergenpower", new Decimal(1e7))
            setUpgradeTimesBought("supergenpower", Decimal.dZero)
            setUpgradeCost("genpower", new Decimal(50))
            setUpgradeTimesBought("genpower", Decimal.dZero)
            player.generators = Decimal.dZero
            generatorsRespecFlag = true
            tickGenerators()
            break;
        case 'movers':
            player.unlockedSelfMovers = false
            player.selfcells -= 1
            getElement("moversWindow").style.display = "none";
            break;
    }
}
window.respecSelfcell = respecSelfcell

let baseMultFromRotators = Decimal.dOne
let alphaMultFromRotators = Decimal.dOne
let betaMultFromRotators = Decimal.dOne

function tickRotators() {
    const rotators = getUpgradeTimesBought("selfrotator").plus(player.freeRotators)
    player.degrees = player.degrees.plus(rotators.times(1.2).times(Decimal.pow(2, getUpgradeTimesBought("doublerotate"))))
    const z = (player.degrees.times(player.degrees)).div(36000).plus(player.degrees) // adjusted degree value for boosts

    if (z.gt(10)) { // don't wanna cause instability or undefined values when z is small 
        baseMultFromRotators = z.sqrt()
        alphaMultFromRotators = z.cbrt()
        if (z.gt(23)) { // making sure "boost" multiplier isn't less than 1
            betaMultFromRotators = Decimal.log(z, 2).sqr().div(20)
        }
        player.freeRotators = Decimal.floor(Decimal.log(player.degrees, 60)).times(Decimal.pow(2, getUpgradeTimesBought("doublefreerotators")))
    }
    else {
        baseMultFromRotators = Decimal.dOne
        alphaMultFromRotators = Decimal.dOne
        betaMultFromRotators = Decimal.dOne
    }  

    getElement("rotatorAmountText").textContent = `You have ${formatBig(getUpgradeTimesBought("selfrotator"))} self-rotators, ${formatBig(player.freeRotators)} free self-rotators`
    getElement("rotatorSpeedText").textContent = `They are rotating at a combined speed of ${formatBig(rotators.times(12))}°/s`
    getElement("rotatorDegreeText").textContent = `You have ${formatBig(player.degrees)} degrees`
    getElement("rotatorBoostText").textContent = `Which are providing these gain multipliers: ${formatBig(baseMultFromRotators)}x to Base, ${formatBig(alphaMultFromRotators)}x to Alpha, ${formatBig(betaMultFromRotators)}x to Beta`
}

//terminology: primgen = primary generators; gen = generators
function transformPrimgens() {
    player.supergenTimeLeft = player.supergenTimeLeftCon
}
window.transformPrimgens = transformPrimgens

let baseMultFromGenerators = Decimal.dOne
let alphaMultFromGenerators = Decimal.dOne
let betaMultFromGenerators = Decimal.dOne
 
function tickGenerators() {
    getElement("primgenAmountText").textContent = `You have ${formatBig(getUpgradeTimesBought("primgen"))} primary generators`
    player.supergenTimeLeftCon = Decimal.add(10, (getUpgradeTimesBought("supergentime").times(20)) )

    if (getUpgradeTimesBought("primgen").gt(1) || generatorsRespecFlag) {
        let gain = Decimal.sqrt(10).pow(getUpgradeTimesBought("primgen")).div(10)
        let supergenpower = Decimal.dTen

        if(getUpgradeTimesBought("supergenpower").gt(0)) {
            supergenpower = Decimal.pow(10, (getUpgradeTimesBought("supergenpower").times(0.2).plus(1)) )
        }

        if(player.supergenTimeLeft.gt(0)) {
            player.supergenTimeLeft = player.supergenTimeLeft.minus(1)
            getElement("primgenAmountText").textContent = `You have ${formatBig(getUpgradeTimesBought("primgen"))} super generators`
            gain = gain.times(supergenpower)
        }
        player.generators = player.generators.plus(gain)

        baseMultFromGenerators = player.generators.cbrt().times(getUpgradeTimesBought("genpower").pow_base(2))
        alphaMultFromGenerators = player.generators.root(6).times(getUpgradeTimesBought("genpower").pow_base(2))
        betaMultFromGenerators = player.generators.log10().times(getUpgradeTimesBought("genpower").pow_base(2)) //TODO: make this weaker!!

        if(generatorsRespecFlag) {
            gain = Decimal.dZero
            supergenpower = Decimal.dTen
            player.generators = Decimal.dZero
            baseMultFromGenerators = Decimal.dOne
            alphaMultFromGenerators = Decimal.dOne
            betaMultFromGenerators = Decimal.dOne
        }

        getElement("primgenSpeedText").textContent = `They are generating each other at a rate of ${formatBig(gain.times(10))}gens/s`
        getElement("genAmountText").textContent = `You have ${formatBig(player.generators)} generators`
        getElement("genBoostText").textContent = `Which are providing these gain multipliers: ${formatBig(baseMultFromGenerators)}x to Base, ${formatBig(alphaMultFromGenerators)}x to Alpha, ${formatBig(betaMultFromGenerators)}x to Beta`
        getElement("divtransformstats").textContent = `${formatBig(supergenpower)}x generator gain for ${formatBig(player.supergenTimeLeftCon.div(10))} seconds`

    }
}

function selfcellHandler() {
    if (player.unlockedSelfRotators) {
        tickRotators()
    }
    if (player.unlockedSelfGenerators) {
        tickGenerators()
    }  
    if (player.unlockedSelfMovers) {
        //tickMovers()
    }
}

function fgbTestConst(): void {
    if (getUpgradeTimesBought("gen").gt(Decimal.dZero)) {
        getElement("boostsection").style.display = "flex";
        getElement("bigboosttext").style.display = "block";
        getElement("veryouterboost").style.display = "block";

        if (getUpgradeTimesBought("unlocknpboost").eq(Decimal.dOne)) {
            nuclearParticles = onBought([
                "nuclearbuy",
                "*",
                [
                    Decimal.dOne,
                    "+",
                    ["upgradenpboost", "+", Decimal.dOne, "/", new Decimal(10)]
                ]
            ]);
            getElement("npboostshow").style.display = "block";
            getElement("unlocknpboost").style.display = "none";
            getElement("divnpboostcost").style.display = "none";
        } else {
            nuclearParticles = getUpgradeTimesBought("nuclearbuy");
            getElement("npboostshow").style.display = "none";
        }
        if (getUpgradeTimesBought("unlocknapboost").eq(Decimal.dOne)) {
            nuclearAlphaParticles = onBought([
                "nuclearalphabuy",
                "*",
                [
                    Decimal.dOne,
                    "+",
                    ["upgradenapboost", "+", Decimal.dOne, "/", new Decimal(10)]
                ]
            ]);
            getElement("napboostshow").style.display = "block";
            getElement("unlocknapboost").style.display = "none";
            getElement("divnapboostcost").style.display = "none";
        } else {
            nuclearAlphaParticles = getUpgradeTimesBought("nuclearalphabuy");
            getElement("napboostshow").style.display = "none";
        }

        if (getUpgradeTimesBought("gen").eq(Decimal.dZero)) {
            getElement("divgencost").textContent = "Cost: Free";
        } else {
            UpdateCostDisplay("divgencost", getUpgradeCost("gen"));
        }

        reactorHandler();
        returnParticleHandler();
        player.alphaNum = player.alphaNum.plus(alphaFromReturn);

        getElement(
            "nptext"
        ).textContent = `Nuclear particles add a +${formatDecimal(
            reactor.boost,
            2
        )}x multiplier to generators, generator boost, and manual boost`;
        getElement(
            "naptext"
        ).textContent = `Nuclear particles add a +${formatDecimal(
            NAPfactor,
            2
        )}x multiplier to alpha gain`;

        const boostsacmult = new Decimal(1.5).pow(
            getUpgradeTimesBought("boostsacrifice")
        );

        getElement(
            "boostsactext"
        ).textContent = `Reset your Booster Particles, but increase Booster Particle and Alpha Particle gain from bangs. Currently ${formatDecimal(
            boostsacmult,
            1
        )}x.`;

        if (player.genBoostTimeLeft.greaterThan(Decimal.dZero)) {
            player.genBoostMult = getUpgradeTimesBought("genboostupmult")
                .times(1.5)
                .plus(Decimal.dTwo)
                .times(GBfactor);
        } else {
            player.genBoostMult = Decimal.dOne;
        }

        if (getUpgradeTimesBought("unlockgenboost").eq(Decimal.dOne)) {
            getElement("gbshow").style.display = "block";
            getElement("divgenunlockcost").style.display = "none";
            getElement("unlockgenboost").style.display = "none";
        }

        if (getUpgradeTimesBought("unlockabgb").eq(Decimal.dOne)) {
            getElement("abgbshow").style.display = "block";
            getElement("divabgbcost").style.display = "none";
            getElement("unlockabgb").style.display = "none";
        }

        player.bangTime = Math.ceil(
            300 / 2 ** getUpgradeTimesBought("bangspeed").toNumber()
        );

        const alphaGain = onBought(
            "alphaacc",
            ["perbang", "+", Decimal.dOne],
            [totalBoostFromNAP, "+", Decimal.dOne],
            [Decimal.dTwo, "^", "alphamachinedouble"],
            [alphaMultFromRotators],
            [alphaMultFromGenerators]
        ).times(boostsacmult);

        player.mergeTime = Math.ceil(
            300 / 2 ** getUpgradeTimesBought("mergespeed").toNumber()
        );

        const betaGain = onBought(
            "betaacc",
            ["permerge", "+", Decimal.dOne],
            [Decimal.dTwo, "^", "doublebeta"],
            [betaMultFromRotators],
            [betaMultFromGenerators]
        );

        if (player.bangTimeLeft === 0) {
            player.alphaNum = player.alphaNum
                .plus(alphaGain)
            getElement("bangtimeleft").textContent = "​";
        }

        if (player.mergeTimeLeft === 0) {
            player.betaNum = player.betaNum.plus(betaGain);
            getElement("mergetimeleft").textContent = "​";
        }

        if (getUpgradeTimesBought("machine").gte(Decimal.dOne)) {
            machineProd = 9 / Math.log10(player.machineWear) + 1;
            player.machineWear += 1;
        }

        clickerParticleMult = player.clickerParticles
            .div(50)
            .plus(Decimal.dOne);

        let abgbBoost = Decimal.dOne;

        if (getUpgradeTimesBought("unlockabgb").gt(Decimal.dZero)) {
            abgbBoost = onBoughtInc(
                player.alphaNum.cbrt(),
                "/",
                new Decimal(100),
                "*",
                "abgbefficiency",
                "+",
                Decimal.dOne
            );
        }

        getElement(
            "abgbtext"
        ).textContent = `Your alpha-based generator boost is multiplying your generators by ${formatBig(
            abgbBoost
        )}x ( (cbrt(alpha)/100)*${formatBig(
            getUpgradeTimesBought("abgbefficiency").plus(Decimal.dOne)
        )} )`;

        const gain: Decimal = onBought(
            ["biggerbatches", "+", Decimal.dOne],
            "*",
            "gen",
            "*",
            ["speed", "/", Decimal.dTen, "+", new Decimal(0.1)],
            "*",
            player.genBoostMult,
            "*",
            [[totalBoostFromNP, "+", Decimal.dOne], "^", Decimal.dTwo],
            "*",
            [new Decimal(3), "^", "threeboost"],
            "*",
            [
                Decimal.dOne,
                "+",
                [
                    [player.boosterParticles, "+", Decimal.dOne],
                    "/",
                    new Decimal(100),
                    "*",
                    [
                        ["boosteruppercent", "+", Decimal.dOne],
                        "/",
                        new Decimal(100)
                    ]
                ]
            ],
            "*",
            abgbBoost,
            "*",
            GBfactor,
            "*",
            baseMultFromRotators,
            "*",
            baseMultFromGenerators
        );

        getElement("particlesperclick").textContent =
            "You are getting " +
            formatBig(
                onBought(
                    ["mbup", "+", Decimal.dOne],
                    "*",
                    ["mbmult", "+", Decimal.dOne],
                    "*",
                    [totalBoostFromNP, "+", Decimal.dOne]
                )
                    .times(clickerParticleMult)
                    .times(totalMBBoost)
            ) +
            " particles per click";

        getElement("alphapb").textContent =
            "You are getting " + formatBig(alphaGain) + " Alpha/bang";
        getElement("bangtimeconst").textContent =
            "Currently, bangs take " +
            format(player.bangTime / 10) +
            " seconds.";
        player.bangTimeLeft -= 1;

        if (
            player.bangTimeLeft >= 0 &&
            player.bangTimeLeft <= player.bangTime
        ) {
            getElement("bangtimeleft").textContent =
                "Bang time left: " + format(player.bangTimeLeft / 10);
            getElement("bangbutton").setAttribute("disabled", "true")
            getElement("bangbutton").style.setProperty('cursor', 'not-allowed')

        } else {
            getElement("bangbutton").removeAttribute("disabled")
            getElement("bangbutton").style.setProperty('cursor', 'pointer')
        }

        getElement("betapb").textContent =
            "You are getting " + formatBig(betaGain) + " Beta/merge";
        getElement("mergetimeconst").textContent =
            "Currently, merges take " +
            format(player.mergeTime / 10) +
            " seconds.";
        player.mergeTimeLeft -= 1;

        if (
            player.mergeTimeLeft >= 0 &&
            player.mergeTimeLeft <= player.mergeTime
        ) {
            getElement("mergetimeleft").textContent =
                "Merge time left: " + format(player.mergeTimeLeft / 10);
            getElement("mergebutton").setAttribute("disabled", "true")
            getElement("mergebutton").style.setProperty('cursor', 'not-allowed')
        } else {
            getElement("mergebutton").removeAttribute("disabled")
            getElement("mergebutton").style.setProperty('cursor', 'pointer')
        }

        if (player.genBoostTimeLeft.gt(Decimal.dZero)) {
            player.genBoostTimeLeft = player.genBoostTimeLeft.minus(
                Decimal.dOne
            );
        }
        getElement("divgbtl").textContent =
            "Boost Time Left: " +
            formatBig(player.genBoostTimeLeft.div(Decimal.dTen));

        const bpGain = player.alphaNum
            .times(getUpgradeTimesBought("boosterup").plus(Decimal.dOne))
            .times(Decimal.dTwo)
            .div(Decimal.dTen)
            .times(BPfactor);

        player.boosterParticles = player.boosterParticles.plus(bpGain);

        const percentBoostDisplay = player.boosterParticles.times(
            getUpgradeTimesBought("boosteruppercent")
                .plus(Decimal.dOne)
                .div(100)
        );

        if (player.boosterParticles.eq(Decimal.dZero)) {
            getElement(
                "boostersmaintext"
            ).textContent = `You are currently getting 0 booster particles per alpha particle per second,
               resulting in a +0% boost to base particle production`; //just added this special case
            // trying to fix - usavictor
        } else if (percentBoostDisplay.lt(100)) {
            getElement(
                "boostersmaintext"
            ).textContent = `You are currently getting ${formatBig(
                bpGain
                    .times(Decimal.dTen)
                    .div(player.alphaNum.max(Decimal.dOne))
            )} booster particles per alpha particle per second,
               resulting in a +${formatBigSpecific(
                   percentBoostDisplay
               )}% boost to base particle production`;
        } else {
            getElement(
                "boostersmaintext"
            ).textContent = `You are currently getting ${formatBig(
                bpGain.times(Decimal.dTen).div(player.alphaNum)
            )} booster particles per alpha particle per second,
               resulting in a ${formatBigSpecific(
                   percentBoostDisplay.div(100).plus(Decimal.dOne)
               )}x boost to base particle production`;
        }

        getElement("bpamount").textContent =
            "You have " +
            formatBig(player.boosterParticles) +
            " booster particles";

        const clickerParticleGain = onBought([
            ["machine", "*", [new Decimal(1.5), "^", "speedparticle"]],
            "/",
            Decimal.dTen
        ]).times(machineProd);
        player.clickerParticles =
            player.clickerParticles.plus(clickerParticleGain);

        selfcellHandler()

        nextFeatureHandler();

        getElement("omegabasecost").textContent =
            "Cost: " + formatBig(player.omegaBaseCost);
        getElement("divobase").textContent =
            "You have " + formatDecimal(player.omegaBase, 1);
        getElement("omegaalphacost").textContent =
            "Cost: " + formatBig(player.omegaAlphaCost);
        getElement("divoalpha").textContent =
            "You have " + formatDecimal(player.omegaAlpha, 2);

        player.num = player.num.plus(gain);

        getElement("particlespersecond").innerHTML =
            "You are getting <span style='color: #ed6464;'>" +
            formatBig(gain.times(10)) +
            "</span> particles/s";

        if (player.num.gte(1e8) || nuclearParticles.gt(Decimal.dZero)) {
            getElement("nuclearreach").style.display = "none";
            getElement("nuclearshow").style.display = "block";
        }

        if (
            player.alphaNum.gte(1e6) ||
            nuclearAlphaParticles.gt(Decimal.dZero)
        ) {
            getElement("nuclearalphareach").style.display = "none";
            getElement("nuclearalphashow").style.display = "block";
        }

        if (player.num.gte(1e9) || player.pChunks.gt(Decimal.dZero)) {
            getElement("bangshow").style.display = "block";
        }

        if (player.alphaNum.gte(1e9) || player.aGroups.gt(Decimal.dZero)) {
            getElement("mergeshow").style.display = "block";

            getElement("oAlphauupre").style.display = "none";
            getElement("oAlphauupost").style.display = "block";
        }

        if (
            player.boosterParticles.gte(1e5) ||
            getUpgradeTimesBought("boostsacrifice").gt(Decimal.dZero)
        ) {
            getElement("bpsacshow").style.display = "block";
        }

        if (
            player.betaNum.gte(1e5) ||
            getUpgradeTimesBought("buyreturngenerator").gt(Decimal.dZero)
        ) {
            getElement("returnbox").style.display = "block";
        }

        
        if (
            player.betaNum.gte(1e7) || player.selfcells > 0
        ) {
            getElement("selfcells").style.display = "block";
        }

        const freeNuclearParticles = nuclearParticles.minus(
            getUpgradeTimesBought("nuclearbuy")
        );
        getElement(
            "npboosttext"
        ).textContent = `Your Nuclear Particles Boost is giving you 
          ${formatDecimal(freeNuclearParticles, 1)} 
          free Nuclear Particles`;
        const freeNuclearAlphaParticles = nuclearAlphaParticles.minus(
            getUpgradeTimesBought("nuclearalphabuy")
        );
        getElement(
            "napboosttext"
        ).textContent = `Your Nuclear Alpha Particles Boost is giving you 
          ${formatDecimal(freeNuclearAlphaParticles, 1)} 
          free Nuclear Alpha Particles`;

        getElement("counter").innerHTML = `<span style="color: #64ed93">
          ${formatBig(player.num)}
          </span> particles`;
        getElement("clickercounter").textContent = `You have 
          ${formatBig(player.clickerParticles)} 
          Clicker Particles 
          (${formatBig(clickerParticleGain.times(Decimal.dTen))}
          /s), which are making Manual Boost 
          ${formatBigSpecific(clickerParticleMult)}
          x stronger.`;
        getElement("alphacounter").textContent =
            formatBig(player.alphaNum) + " Alpha particles";
        getElement("betacounter").textContent =
            formatBig(player.betaNum) + " Beta particles";

        if (getUpgradeTimesBought("alphaacc").eq(Decimal.dZero)) {
            getElement("bangwarn").style.display = "block";
        } else {
            getElement("bangwarn").style.display = "none";
        }
    }
}

function pcaTestConst(): void {
    if (getUpgradeTimesBought("unlockpca").eq(Decimal.dOne)) {
        getElement("pcashow").style.display = "block";
        getElement("divunlockpca").style.display = "none";
        getElement("unlockpca").style.display = "none";

        if (player.pcaToggle === true) {
            if (player.chunkAutobuyerTimeLeft === 0) {
                player.chunkAutobuyerTimeLeft = player.pcaTime;
                makechunk();
            }

            player.chunkAutobuyerTimeLeft--;
            getElement("untilpca").textContent =
                format(player.chunkAutobuyerTimeLeft / 10) +
                " left until next autobuy";
        }
    }
}

function agaTestConst(): void {
    if (getUpgradeTimesBought("unlockaga").eq(Decimal.dOne)) {
        getElement("agashow").style.display = "block";
        getElement("divunlockaga").style.display = "none";
        getElement("unlockaga").style.display = "none";

        if (player.agaToggle === true) {
            if (player.groupAutobuyerTimeLeft === 0) {
                player.groupAutobuyerTimeLeft = player.agaTime;
                makegroup();
            }

            player.groupAutobuyerTimeLeft--;
            getElement("untilaga").textContent =
                format(player.groupAutobuyerTimeLeft / 10) +
                " left until next autobuy";
        }
    }
}

function baTestConst(): void {
    if (getUpgradeTimesBought("bangautobuyerunlock").eq(Decimal.dOne)) {
        getElement("bashow").style.display = "block";
        getElement("divbau").style.display = "none";
        getElement("divbauextra").style.display = "none";
        getElement("bangautobuyerunlock").style.display = "none";

        if (player.bangAutobuyerToggle === true) {
            if (player.bangAutobuyerTimeLeft === 0) {
                player.bangAutobuyerTimeLeft = player.bangAutobuyerTime;
                bang();
            }

            player.bangAutobuyerTimeLeft--;
            getElement("untilba").textContent =
                format(player.bangAutobuyerTimeLeft) +
                " left until next autobuy";
        }
    }
}

function maTestConst(): void {
    if (getUpgradeTimesBought("mergeautobuyerunlock").eq(Decimal.dOne)) {
        getElement("mashow").style.display = "block";
        getElement("divmau").style.display = "none";
        getElement("divmauextra").style.display = "none";
        getElement("mergeautobuyerunlock").style.display = "none";

        if (player.mergeAutobuyerToggle === true) {
            if (player.mergeAutobuyerTimeLeft === 0) {
                player.mergeAutobuyerTimeLeft = player.mergeAutobuyerTime;
                merge();
            }

            player.mergeAutobuyerTimeLeft--;
            getElement("untilma").textContent =
                format(player.mergeAutobuyerTimeLeft) +
                " left until next autobuy";
        }
    }
}


function instantAutobuyers() {
    //TODO: make this function not look like absolute garbage
    if (getUpgradeTimesBought("GnBBAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.genAutobuyerToggle) {
            buyUpgrade("gen");
        }
        if (player.instantAutobuyers.bbAutobuyerToggle) {
            buyUpgrade("biggerbatches");
        }
        getElement("divGnBBA").style.display = "none";
        getElement("divGnBBAhide").style.display = "block";
    }
    if (getUpgradeTimesBought("GBUAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.genBoostTimeAutobuyerToggle) {
            buyUpgrade("genboostuptime");
        }
        if (player.instantAutobuyers.genBoostMultAutobuyerToggle) {
            buyUpgrade("genboostupmult");
        }
        getElement("divGBUA").style.display = "none";
        getElement("divGBUAhide").style.display = "block";
    }
    if (getUpgradeTimesBought("MBUAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.manBoost1perClickAutobuyerToggle) {
            buyUpgrade("mbup");
        }
        if (player.instantAutobuyers.manBoost1xperClickAutobuyerToggle) {
            buyUpgrade("mbmult");
        }
        getElement("divMBUA").style.display = "none";
        getElement("divMBUAhide").style.display = "block";
    }
    if (getUpgradeTimesBought("NPAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.nuclearParticlesAutobuyerToggle) {
            buyUpgrade("nuclearbuy");
        }
        if (player.instantAutobuyers.nuclearAlphaParticlesAutobuyerToggle) {
            buyUpgrade("nuclearalphabuy");
        }
        getElement("divNPA").style.display = "none";
        getElement("divNPAhide").style.display = "block";
    }
    if (getUpgradeTimesBought("AAccAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.AlphaAccAutobuyerToggle) {
            buyUpgrade("alphaacc");
        }
        getElement("divAAccA").style.display = "none";
        getElement("divAAccAhide").style.display = "block";
    }
    if (getUpgradeTimesBought("SAunlock").eq(Decimal.dOne)) {
        if (player.instantAutobuyers.SpeedAutobuyerToggle) {
            buyUpgrade("speed");
        }
        getElement("divSA").style.display = "none";
        getElement("divSAhide").style.display = "block";
    }
}

/**
 * Function responsible for keeping track of time left before next autosave and autosaving when needed.
 */
function savinginloop(): void {
    playerSettings.autoSaveDelay--;

    if (playerSettings.autoSaveDelay === 0) {
        playerSettings.autoSaveDelay = playerSettings.autoSaveSet;
        save();
    }
}


function arbitraryHighlight(h: string) {
    if(playerSettings.themeNumber > 2 && playerSettings.themeNumber < 5) {
        getElement(h).style.setProperty('border', '1px solid #00FF00')
        getElement(h).style.setProperty('box-shadow', 'inset 0 0 5px #00FF00')
    }
    else if(playerSettings.themeNumber === 7) {
        getElement(h).style.setProperty('border', '1px solid #FFFFFF')
        getElement(h).style.setProperty('box-shadow', 'inset 0 0 7px #FFFFFF')
    }
    else if(playerSettings.themeNumber > 5) {
        getElement(h).style.setProperty('border', '1px solid #000000')
        getElement(h).style.setProperty('box-shadow', 'inset 0 0 5px #000000')
    }
    else {
        getElement(h).style.setProperty('border', '1px solid #999999')
        getElement(h).style.setProperty('box-shadow', 'inset 0 0 6px #999999')
    }
    getElement(h).style.setProperty('cursor', 'pointer')
}

function arbitraryUnhighlight(h: string) {
    getElement(h).style.setProperty('border', '1px solid #333333')
    getElement(h).style.setProperty('box-shadow', 'none')
    getElement(h).style.setProperty('cursor', 'not-allowed')
}

function costHighlightHandle(upgradeName: UpgradeName): void {
    const upgrade = upgrades[upgradeName];
    const cost = getUpgradeCost(upgradeName);
    const disabled = getElement(upgrade.buttonDiv, "button").disabled

    if (player[upgrade.currency].gte(cost) && !disabled) {
        arbitraryHighlight(upgrade.buttonDiv)
    }
    else {
        arbitraryUnhighlight(upgrade.buttonDiv)
    }
}

function costHighlighting(): void {
    let key: UpgradeName

    for(key in upgrades) {
       costHighlightHandle(key)
    }

    player.num.gte(getUpgradeCost("speed")) ? arbitraryHighlight("fiftyspeed") : arbitraryUnhighlight("fiftyspeed");

    player.num.gte(1e9) ? arbitraryHighlight("particlechunk") : arbitraryUnhighlight("particlechunk");
    const bangDisabled = (getElement("bangbutton") as HTMLButtonElement).disabled
    getUpgradeTimesBought("alphaacc").gt(0) && player.pChunks.gt(1) && !bangDisabled ? arbitraryHighlight("bangbutton") : arbitraryUnhighlight("bangbutton");

    const mergeDisabled = (getElement("mergebutton") as HTMLButtonElement).disabled
    player.alphaNum.gte(1e9) ? arbitraryHighlight("alphagroup") : arbitraryUnhighlight("alphagroup");
    getUpgradeTimesBought("betaacc").gt(0) && player.aGroups.gt(1) && !mergeDisabled ? arbitraryHighlight("mergebutton") : arbitraryUnhighlight("mergebutton");
}

arbitraryHighlight("manualboost");
arbitraryHighlight("generatorboost");

function statsUpdate() {
    getElement("stat").textContent = 
    `Raw values:\n
    Particles: ${player.num}\n
    Alpha Particles: ${player.alphaNum}\n
    Beta Particles: ${player.betaNum}\n
    `
}

//Game loop, repeatedly run every 100ms.
setInterval(() => {
    passiveUnlockDisplay();
    pcaTestConst();
    agaTestConst();
    baTestConst();
    maTestConst();
    fgbTestConst();
    instantAutobuyers();
    costHighlighting();
    statsUpdate()
    savinginloop();
}, 100);

if(!player.floatBugfix) {
    player.omegaBase = player.omegaBase.plus(0.000001)
    player.omegaAlpha = player.omegaAlpha.plus(0.000001)
    player.floatBugfix = true
}

/**
 * Adds a D# to Decimal type numbers in the savefile so they can be differentiated from regular numbers when loading.
 */
function saveReplace(_key: string, value: unknown): unknown {
    if (value instanceof Decimal) return "D#" + value.toString();
    return value;
}

/**
 * Saves the game settings and writes them into localStorage.
 */
function saveSettings(): void {
    const settingfile = JSON.stringify(playerSettings);
    localStorage.setItem(location.pathname + "settings", settingfile);
}

window.saveSettings = saveSettings;

/**
 * Saves the game and writes savefile into localStorage.
 */
function save(): string {
    const savefile = btoa(JSON.stringify(player, saveReplace));
    localStorage.setItem(location.pathname, savefile);
    saveSettings();
    return savefile;
}

window.save = save;

/**
 * Resets player's savefile and makes a backup of it.
 */
window.reset = function (): void {
    saveSettings();
    localStorage.removeItem(location.pathname);

    //make backup save
    const savefile = JSON.stringify(player, saveReplace);
    localStorage.setItem(location.pathname + "backupsave", savefile);
    location.reload();
};