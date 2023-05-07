import "./style.css";
import "./music"
import {
   load,
   loadSettings,
   getUpgradeTimesBought,
   getUpgradeCost,
   player,
   playerSettings,
   UpgradeNames,
   getSaveString,
   type InstantAutobuyerName,
   isAutobuyerName
} from "./player";
import {
   format,
   formatb,
   getElement,
   D,
   onBought,
   onBoughtInc,
   formatbSpecific,
   formatD
} from "./util";
import { UpdateCostVal, upgrades, buyUpgrade } from "./upgrades";
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
      buyomegabase: VoidFunction;
      buyomegaalpha: VoidFunction;
      buyomegabeta: VoidFunction;
      buyomegagamma: VoidFunction;
      buyomegadelta: VoidFunction;
      toggleba: VoidFunction;
      makegroup: VoidFunction;
      merge: VoidFunction;
      instantAutobuyerToggle: (
         autobuyerVar: InstantAutobuyerName, 
         autobuyerDiv: string
      ) => void;
      buyFuel: (fuelType: Fuels) => void;
      saveSettings: VoidFunction;
      save: VoidFunction;
      reset: VoidFunction;
   }
}

loadSettings();
load();

const divEntireBody = getElement("diventirebody");
const html = getElement("html");
const tabOpeners = getElement("tabopeners");
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

const delayArray = [600, 300, 150, 100, 50, 20, 10, undefined];

const themes = [
   {
      textColor: "#EBEBEB",
      bgColor: "rgb(34, 36, 34)",
      buttonColor: "",
      borderColor: "#BABABA",
      gradientColor: "black",
      themeName: "Dark Rework",
   },
   {
      textColor: "#D4D4D4",
      bgColor: "rgb(14, 16, 14)",
      buttonColor: "",
      borderColor: "#000000",
      gradientColor: "black",
      themeName: "Darker Rework"
   },
   {
      textColor: "#000000",
      bgColor: "#CCCCCC",
      buttonColor: "",
      borderColor: "#333333",
      gradientColor: "white",
      buttonGradientOverride: true,
      themeName: "Light Rework",
   },
   {
      textColor: "#000000",
      bgColor: "#CCCCCC",
      buttonColor: "",
      borderColor: "#DD1111",
      gradientColor: "white",
      buttonGradientOverride: true,
      themeName: "Red Borders",
   },
   {
      textColor: "#CCCCCC",
      bgColor: "#000000",
      buttonColor: "#CCCCCC",
      borderColor: "#CCCCCC",
      gradientColor: "#444444",
      themeName: "Black",
   },
   {
      textColor: "#000000",
      bgColor: "#FF91AF",
      buttonColor: "#FFA1BF",
      borderColor: "#FFD1FF",
      gradientColor: "#FFA1BF",
      themeName: "Pink",
   },
   {
      textColor: "#3DD7DE",
      bgColor: "#191970",
      buttonColor: "#3DD7DE",
      borderColor: "#3DD7DE",
      gradientColor: "#7090FF",
      buttonGradientOverride: true,
      themeName: "Blue",
   },
   {
      textColor: "#000000",
      bgColor: "#DEB2EF",
      buttonColor: "#8A7AED",
      borderColor: "#6A5ACD",
      gradientColor: "#5A1C61",
      buttonGradientOverride: true,
      themeName: "Purple",
   },
   {
      textColor: "#EBEBEB",
      bgColor: "#696969",
      buttonColor: "#999999",
      borderColor: "#000000",
      gradientColor: "transparent",
      themeName: "Classic",
   },
   {
      textColor: "#EBEBEB",
      bgColor: "#696969",
      buttonColor: "#999999",
      borderColor: "#000000",
      gradientColor: "transparent",
      themeName: "Classic Colors",
   }
];

function themeExec(): void {
   const { 
      textColor, 
      bgColor, 
      buttonColor, 
      borderColor, 
      gradientColor, 
      buttonGradientOverride, 
      themeName 
   } = themes[playerSettings.themeNumber];

   divEntireBody.style.opacity = "1";
   divEntireBody.style.color = textColor;
   divEntireBody.style.fontFamily = "Arial"
   document.body.style.backgroundColor = bgColor;
   html.style.backgroundColor = bgColor;

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
      }
      else {
         element.style.border = "2px solid black";
         element.style.borderRadius = "8px";
         element.style.color = "snow";
         element.style.fontWeight = "500";

         if (buttonGradientOverride === undefined) {
            element.style.background = `linear-gradient(45deg, ${gradientColor}, transparent)`;
         }
         else {
            element.style.background = "linear-gradient(45deg, black, transparent)";
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

   tabOpeners.style.background = `linear-gradient(${gradientColor}, transparent)`;
   whatTheme.textContent = `Theme: ${themeName}`;
}

themeExec();

window.theme = function (): void {
   playerSettings.themeNumber = (playerSettings.themeNumber + 1) % themes.length;
   themeExec();
   saveSettings();
};

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

function passiveUnlockDisplay(): void {
   if (player.num.gte(1e5)) {
      tabOpenFactory.style.display = "inline";
   }
   if (player.num.gte(1e9)) {
      tabOpenAlpha.style.display = "inline";
      tabOpenOmega.style.display = "inline";
   }
   if (player.alphaNum.gte(1e9)) {
      tabOpenBeta.style.display = "inline";
   }
   if (player.betaNum.gte(300)) {
      tabOpenReactor.style.display = "inline";
   }
   if (playerSettings.useExperimental) { //TODO: remove exprimental when you want
      tabOpenGamma.style.display = "inline";
      tabOpenDelta.style.display = "inline";
      tabOpenOmegaOmega.style.display = "inline";
      tabOpenStats.style.display = "inline";
      tabOpenAchievements.style.display = "inline";
   }
}

function devToolsVisibilityUpdate() {
   tabOpenDev.style.display = playerSettings.devToggled ? "inline" : "none";
   devToggle.textContent = playerSettings.devToggled.toString();
}

function autoSaveSet(): void {
   const delay = delayArray[playerSettings.autoSaveMode];
   playerSettings.autoSaveSet = playerSettings.autoSaveDelay = delay ?? 1e308;
   autosaveElement.textContent = delay
      ? `On, delay: ${format(delay / 10)}s`
      : "Off";
}

window.autosavesettings = function (): void {
   playerSettings.autoSaveMode = (playerSettings.autoSaveMode + 1) % delayArray.length;
   autoSaveSet();
   saveSettings();
};

function pcaTestSingle() {
   if (getUpgradeTimesBought('unlockpca').eq(Decimal.dOne)) {
      getElement('untilpca').textContent =
         format(player.chunkAutobuyerTimeLeft) + ' left until next autobuy';
      getElement('divtogglepca').style.display = 'inline-block';

      if (player.pcaToggle) {
         getElement('divtogglepca').textContent = 'On';
      } else {
         getElement('divtogglepca').textContent = 'Off';
      }
   }
}

function baTestSingle() {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(Decimal.dOne)) {
      getElement('untilba').textContent =
         format(player.bangAutobuyerTimeLeft) + ' left until next autobuy';
      getElement('divtoggleba').style.display = 'inline-block';

      if (player.bangAutobuyerToggle) {
         getElement('divtoggleba').textContent = 'On';
      } else {
         getElement('divtoggleba').textContent = 'Off';
      }
   }
}

function fgbTestSingle() {
   if (getUpgradeTimesBought('gen').eq(Decimal.dZero)) {
      getElement('divgencost').textContent = 'Cost: Free';
   } else {
      UpdateCostVal('divgencost', getUpgradeCost('gen'));
   }
}

let nuclearParticles = getUpgradeTimesBought('nuclearbuy')
if (getUpgradeTimesBought('unlocknpboost').eq(Decimal.dOne)) {
   nuclearParticles = onBought(
      [
         'nuclearbuy',
         '*',
         [
            Decimal.dOne, '+',
            [
               'upgradenpboost',
               '+',
               Decimal.dOne,
               '/', Decimal.dTen
            ]
         ]
      ]
   )
}
let nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')
if (getUpgradeTimesBought('unlocknapboost').eq(Decimal.dOne)) {
   nuclearAlphaParticles = onBought(
      [
         'nuclearalphabuy',
         '*',
         [
            Decimal.dOne,
            '+',
            [
               'upgradenapboost',
               '+',
               Decimal.dOne,
               '/',
               Decimal.dTen
            ]
         ]
      ]
   )
}

function instantAutobuyerState(autobuyerVar: InstantAutobuyerName, autobuyerDiv: string): void {
   getElement(autobuyerDiv).textContent = player.instantAutobuyers[autobuyerVar] ? "On" : "Off";
}

function amountUpdate() {
   if (getUpgradeTimesBought('unlocknpboost').eq(Decimal.dOne)) {
      getElement('divnp').textContent =
         'Nuclear Particles: ' + formatD(nuclearParticles, 1);
   }
   else {
      getElement('divnp').textContent =
         'Nuclear Particles: ' + formatb(getUpgradeTimesBought('nuclearbuy'));
   }
   if (getUpgradeTimesBought('unlocknapboost').eq(Decimal.dOne)) {
      getElement('divnap').textContent =
         'Nuclear Alpha Particles: ' + formatD(nuclearAlphaParticles, 1);
   }
   else {
      getElement('divnap').textContent =
         'Nuclear Alpha Particles: ' + formatb(getUpgradeTimesBought('nuclearalphabuy'));
   }

   getElement('chunkamount').textContent =
      'Particle Chunks: ' + formatb(player.pChunks);
   getElement('groupamount').textContent =
      'Particle Chunks: ' + formatb(player.aGroups);

   getElement('omegabasecost').textContent =
      'Cost: ' + formatb(player.omegaBaseCost);
   getElement('divobase').textContent = 'You have ' + formatb(player.omegaBase);
   getElement('omegaalphacost').textContent =
      'Cost: ' + formatb(player.omegaAlphaCost);
   getElement('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);

   for (const autobuyerName in player.instantAutobuyers) {
      const autobuyerDiv = `div${autobuyerName}`;

      if (!isAutobuyerName(autobuyerName)) {
         throw new Error("autoBuyerName dosen't match InstantAutobuyerName type")
      }
      instantAutobuyerState(autobuyerName, autobuyerDiv);
   }
}

function loadMisc(): void {
   for (const upgradeName of UpgradeNames) {
      const upgrade = upgrades[upgradeName];
      if (!("costRounding" in upgrade)) {
         UpdateCostVal(
            upgrade.costDiv,
            getUpgradeCost(upgradeName),
            upgrade.currency
         );
      }
      else {
         UpdateCostVal(
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
   baTestSingle();
   fgbTestSingle();

   getElement("counter").innerHTML = "<span style='color: #64ed93;'>" + formatb(player.num) + "</span> particles";
   getElement("particlespersecond").innerHTML =
      "You are getting <span style='color: #ed6464;'> 0 </span> particles/s";

   amountUpdate();
}

function makeElementMap(...names: string[]): Record<string, HTMLElement> {
   const entries = names.map(x => [x, getElement(x)] as const);
   return Object.fromEntries(entries);
}

const tabElements = makeElementMap(
   'Base',
   'Factory',
   'Alpha',
   'Beta',
   'Reactor',
   'Gamma',
   'Delta',
   'Omega',
   'OmegaOmega',
   'Achievements',
   'Stats',
   'Settings',
   'Tutorial',
   'Dev'
);
const tabOmegaElements = makeElementMap(
   'oBase',
   'oAlpha',
   'oBeta',
   'oGamma',
   'oDelta'
);

function hideElements(elements: Record<string, HTMLElement>) {
   for (const name in elements) {
      elements[name].style.display = 'none';
   }
}

window.openTab = function (tab: string): void {
   if (tab in tabOmegaElements) {
      hideElements(tabOmegaElements);
   } else {
      hideElements(tabElements);
   }
   getElement(tab).style.display = 'block';
};

loadMisc();

window.saveExport = async function (): Promise<void> {
   await navigator.clipboard.writeText(save());
   alert('Copied to clipboard!')
};

window.saveImport = function (): void {
   getElement('importareaid').style.display = 'block';
   getElement('saveimportconfirm').style.display = 'block';
};

window.saveImportConfirm = function (): void {
   const saveEl = getElement('importareaid', 'textarea');
   const savefile = saveEl.value; // really should check for an empty value here
   localStorage.setItem(location.pathname, savefile);
   location.reload();
};

window.experimentalToggle = function () {
   playerSettings.useExperimental = !playerSettings.useExperimental;

   if (playerSettings.useExperimental) {
      getElement('tabopengamma').style.display = 'inline';
      getElement('tabopendelta').style.display = 'inline';
      getElement('tabopenomegaomega').style.display = 'inline';
      getElement('tabopenachievements').style.display = 'inline';
   }
   else {
      getElement('tabopengamma').style.display = 'none';
      getElement('tabopendelta').style.display = 'none';
      getElement('tabopenomegaomega').style.display = 'none';
      getElement('tabopenachievements').style.display = 'none';
   }
   getElement('experimentoggle').textContent = playerSettings.useExperimental.toString();
   saveSettings();
}

window.devToggle = function () {
   playerSettings.devToggled = !playerSettings.devToggled;

   if (playerSettings.devToggled) {
      getElement('tabopendev').style.display = 'inline';
   }
   else {
      getElement('tabopendev').style.display = 'none';
   }
   getElement('devtoggle').textContent = playerSettings.devToggled.toString();
   saveSettings();
}

createAchievementHTML();

//early var init
let machineProd = 10
let clickerParticleMult = player.
    clickerParticles
    .div(100)
    .plus(Decimal.dOne)
    .times(machineProd);

const reactor = {
   isActive: false,
   fuelTime: D(300),
   boost: Decimal.dOne,
   fuelMult: Decimal.dOne,
}

function reactorHandler() {
   reactor.fuelTime = onBought(
      [D(300), '*', [D(1.25), '^', 'reactoruptime'], '/', [Decimal.dTwo, '^', 'reactorupmult']]
   )

   if (player.hyperfuel.lte(Decimal.dZero)) {
      player.hyperfuel = Decimal.dZero;

      if (player.superfuel.lte(Decimal.dZero)) {
         player.superfuel = Decimal.dZero;

         if (player.fuel.lte(Decimal.dZero)) {
            player.fuel = Decimal.dZero;

            reactor.isActive = false;
         }
         else {
            reactor.fuelMult = Decimal.dOne;
            reactor.isActive = true;
            player.fuel = player.fuel.minus(
               Decimal.dOne.div(reactor.fuelTime)
            )
         }
      }
      else {
         reactor.fuelMult = D(3);
         reactor.isActive = true;
         player.superfuel = player.superfuel.minus(
            Decimal.dOne.div(reactor.fuelTime)
         )
      }
   }
   else {
      reactor.fuelMult = D(6561);
      reactor.isActive = true;
      player.hyperfuel = player.hyperfuel.minus(
         Decimal.dOne.div(reactor.fuelTime)
      )
   }

   if (reactor.isActive) {
      reactor.boost = onBoughtInc(
         [[D(1.25), '^', 'reactorupmult'], '*', reactor.fuelMult]
      )
      getElement('divreactorstatus').textContent = `Reactor status: Running (${formatD(player.fuel, 2)} Fuel)`
   }
   else {
      reactor.boost = Decimal.dOne;
      getElement('divreactorstatus').textContent = "Reactor status: Out of fuel"
   }
   getElement('divreactorfuelusage').textContent = `When active, your reactor is using up 1 fuel every ${formatb(reactor.fuelTime.div(10))} seconds`

   //im doing weird stuff here and ill try to clean it up later ok, pay no attention to reactorHandler()


   const NAPfactor: Decimal = reactor.boost.plus(Decimal.dOne).div(Decimal.dTwo);
   const BPfactor: Decimal = reactor.boost.plus(3).div(4);
   const MBfactor: Decimal = reactor.boost.sqr();
   const GBfactor: Decimal = reactor.boost.plus(Decimal.dTwo).div(3);

   let NAPtoggle = false;
   let BPtoggle = false;
   let MBtoggle = false;
   let GBtoggle = false;

   if (getUpgradeTimesBought('reactorUnlockNAP').eq(1)) NAPtoggle = true;
   if (getUpgradeTimesBought('reactorUnlockBP').eq(1)) BPtoggle = true;
   if (getUpgradeTimesBought('reactorUnlockNAP').eq(1)) MBtoggle = true;
   if (getUpgradeTimesBought('reactorUnlockBP').eq(1)) GBtoggle = true; 




   getElement('divreactormain').textContent = 
       `Currently, your reactor is making Nuclear particles 
       ${formatbSpecific(reactor.boost)}x, 
       Nuclear Alpha Particles ${formatbSpecific(NAPfactor)}x, 
       Manual Boost ${formatbSpecific(MBfactor)}x, 
       Generator Boost ${formatbSpecific(GBfactor)}x as strong, 
       and increasing Booster Particle gain by 
       ${formatbSpecific(BPfactor)}x`
   //getElement('divreactormain').textContent = `Currently, your reactor is making Nuclear particles ${formatbSpecific(reactor.boost)}x as strong`
}

let totalBoostFromNP = nuclearParticles.times(reactor.boost)

const NAPfactor: Decimal = reactor.boost.plus(Decimal.dOne).div(Decimal.dTwo)
const totalBoostFromNAP: Decimal = nuclearAlphaParticles.times(NAPfactor)

window.mbman = function (): void {
   const gain: Decimal = onBoughtInc(
      "mbup",
      "*",
      "mbmult"
   ).times(clickerParticleMult).times(totalBoostFromNP.plus(Decimal.dOne));

   player.num = player.num.plus(gain);
   getElement("counter").innerHTML =
      `<span style="color: #64ed93"> 
      ${formatb(player.num)} 
      "</span> particles`;
};

window.gbboost = function (): void {
   player.genBoostTimeLeft = player.genBoostTimeLeftCon;
};

function makechunk(): void {
   if (player.num.gte(1e9)) {
      player.num = player.num.minus(1e9);
      player.pChunks = player.pChunks.plus(Decimal.dOne);
      getElement('chunkamount').textContent =
         'Particle Chunks: ' + formatb(player.pChunks);
   }
}
window.makechunk = makechunk;

function bang(): void {
   if (player.pChunks.gte(Decimal.dTwo)) {
      if (
         getUpgradeTimesBought('alphaacc').gt(Decimal.dZero) &&
         !(player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime)
      ) {
         player.pChunks = player.pChunks.minus(Decimal.dTwo);
         player.bangTimeLeft = player.bangTime;
         getElement('chunkamount').textContent =
            'Particle Chunks: ' + formatb(player.pChunks);
         getElement('boostersmaintext').style.display = 'block';
      }
   }
}
window.bang = bang;

window.togglepca = function (): void {
   if (getUpgradeTimesBought('unlockpca').eq(Decimal.dOne)) {
      player.pcaToggle = !player.pcaToggle;
      getElement('divtogglepca').style.display = 'inline-block';

      getElement('divtogglepca').textContent = 
          player.pcaToggle ? "On" :"Off";
   }
};

window.buyomegabase = function (): void {
   if (player.num.gte(player.omegaBaseCost)) {
      player.num = player.num.minus(player.omegaBaseCost);
      player.omegaBase = player.omegaBase.plus(Decimal.dOne);
      player.omegaBaseCost = player.omegaBaseCost.times(Decimal.dTen);
      getElement('omegabasecost').textContent =
         'Cost: ' + formatb(player.omegaBaseCost);
      getElement('divobase').textContent = 'You have ' + formatb(player.omegaBase);
   }
};

window.buyomegaalpha = function (): void {
   if (player.alphaNum.gte(player.omegaAlphaCost)) {
      player.alphaNum = player.alphaNum.minus(player.omegaAlphaCost);
      player.omegaAlpha = player.omegaAlpha.plus(Decimal.dOne);
      player.omegaAlphaCost = player.omegaAlphaCost.times(100);
      getElement('omegaalphacost').textContent =
         'Cost: ' + formatb(player.omegaAlphaCost);
      getElement('divoalpha').textContent = 'You have ' + formatb(player.omegaAlpha);
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

window.toggleba = function (): void {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(Decimal.dOne)) {
      player.bangAutobuyerToggle = !player.bangAutobuyerToggle;
      getElement('divtoggleba').style.display = 'inline-block';

      if (player.bangAutobuyerToggle) {
         getElement('divtoggleba').textContent = 'On';
      } else {
         getElement('divtoggleba').textContent = 'Off';
      }
   }
};

function makegroup(): void {
   if (player.alphaNum.gte(1e9)) {
      player.alphaNum = player.alphaNum.minus(1e9);
      player.aGroups = player.aGroups.plus(Decimal.dOne);
      getElement('groupamount').textContent =
         'Alpha Groups: ' + formatb(player.aGroups);
   }
}
window.makegroup = makegroup;

window.merge = function (): void {
   if (player.aGroups.gte(Decimal.dTwo)) {
      if (
         getUpgradeTimesBought('betaacc').gt(Decimal.dZero) &&
         !(player.mergeTimeLeft >= 0 && player.mergeTimeLeft <= player.mergeTime)
      ) {
         player.aGroups = player.aGroups.minus(Decimal.dTwo);
         player.mergeTimeLeft = player.mergeTime;
         getElement('groupamount').textContent =
            'Alpha Groups: ' + formatb(player.aGroups);
      }
   }
}

window.instantAutobuyerToggle = function (autobuyerVar: InstantAutobuyerName, autobuyerDiv: string): void {
   player.instantAutobuyers[autobuyerVar] = !player.instantAutobuyers[autobuyerVar]
   getElement(autobuyerDiv).textContent = player.instantAutobuyers[autobuyerVar] ? "On" : "Off"
}

type Fuels = 
  | 'player.fuel' 
  | 'player.superfuel' 
  | 'player.hyperfuel';

window.buyFuel = function (fuelType: Fuels) {
   if (fuelType === 'player.fuel') {
      if (player.num.gte(1e27) && player.alphaNum.gte(1e10) && player.betaNum.gte(50)) {
         player.num = player.num.minus(1e27)
         player.alphaNum = player.alphaNum.minus(1e10)
         player.betaNum = player.betaNum.minus(50)
         player.fuel = player.fuel.plus(Decimal.dOne)
      }
   }
   else {
      //do this later TODO:
   }
}

function fgbTestConst(): void {
   if (getUpgradeTimesBought('gen').gt(Decimal.dZero)) {
      getElement('boostsection').style.display = 'flex';
      getElement('bigboosttext').style.display = 'block';
      getElement('veryouterboost').style.display = 'block';

      if (getUpgradeTimesBought('unlocknpboost').eq(Decimal.dOne)) {
         nuclearParticles = onBought(
            ['nuclearbuy', '*', [Decimal.dOne, '+', ['upgradenpboost', '+', Decimal.dOne, '/', D(10)]]]
         )
         getElement('npboostshow').style.display = 'block';
         getElement('npboostunlockbutton').style.display = 'none'
         getElement('divnpboostcost').style.display = 'none'
      }
      else {
         nuclearParticles = getUpgradeTimesBought('nuclearbuy')
         getElement('npboostshow').style.display = 'none';
      }
      if (getUpgradeTimesBought('unlocknapboost').eq(Decimal.dOne)) {
         nuclearAlphaParticles = onBought(
            ['nuclearalphabuy', '*', [Decimal.dOne, '+', ['upgradenapboost', '+', Decimal.dOne, '/', D(10)]]]
         )
         getElement('napboostshow').style.display = 'block';
         getElement('napboostunlockbutton').style.display = 'none'
         getElement('divnapboostcost').style.display = 'none'
      }
      else {
         nuclearAlphaParticles = getUpgradeTimesBought('nuclearalphabuy')
         getElement('napboostshow').style.display = 'none';
      }

      if (getUpgradeTimesBought('gen').eq(Decimal.dZero)) {
         getElement('divgencost').textContent = 'Cost: Free';
      } else {
         UpdateCostVal('divgencost', getUpgradeCost('gen'));
      }

      reactorHandler();

      totalBoostFromNP = nuclearParticles.times(reactor.boost)
      totalBoostFromNP = nuclearParticles.times(NAPfactor)

      getElement('nptext').textContent = `Nuclear particles add a +${formatD(reactor.boost, 2)}x multiplier to generators, generator boost, and manual boost`


      const boostsacmult = D(1.5).pow(getUpgradeTimesBought('boostsacrifice'))

      getElement('boostsactext').textContent = `Reset your Booster Particles, but increase Booster Particle and Alpha Particle gain. Currently ${formatD(boostsacmult, 1)}x.`


      if (player.genBoostTimeLeft.greaterThan(Decimal.dZero)) {
         player.genBoostMult = getUpgradeTimesBought('genboostupmult').times(1.5).plus(Decimal.dTwo);
      } else {
         player.genBoostMult = Decimal.dOne;
      }

      if (getUpgradeTimesBought('unlockgenboost').eq(Decimal.dOne)) {
         getElement('gbshow').style.display = 'block';
         getElement('divgenunlockcost').style.display = 'none';
         getElement('gbunlockbutton').style.display = 'none';
      }

      if (getUpgradeTimesBought('unlockabgb').eq(Decimal.dOne)) {
         getElement('abgbshow').style.display = 'block';
         getElement('divabgbcost').style.display = 'none';
         getElement('abgbunlockbutton').style.display = 'none';
      }

      player.bangTime = Math.ceil(
         300 / Math.pow(2, getUpgradeTimesBought('bangspeed').toNumber())
      );

      const alphaGain = onBought(
         'alphaacc', ['perbang', '+', Decimal.dOne], [totalBoostFromNAP, '+', Decimal.dOne], [Decimal.dTwo, '^', 'alphamachinedouble']
      ).times(boostsacmult);

      player.mergeTime = Math.ceil(
         300 / Math.pow(2, getUpgradeTimesBought('mergespeed').toNumber())
      );

      const betaGain = onBought(
         'betaacc', ['permerge', '+', Decimal.dOne]
      );

      if (player.bangTimeLeft === 0) {
         player.alphaNum = player.alphaNum.plus(alphaGain);
         getElement('bangtimeleft').textContent = '';
      }

      if (player.mergeTimeLeft === 0) {
         player.betaNum = player.betaNum.plus(betaGain);
         getElement('mergetimeleft').textContent = '';
      }

      if (getUpgradeTimesBought('machine').gte(Decimal.dOne)) {
         machineProd = (9 / Math.log10(player.machineWear)) + 1
         player.machineWear += 1
      }

      clickerParticleMult = player.clickerParticles.div(50).plus(Decimal.dOne);

      let abgbBoost = Decimal.dOne

      if (getUpgradeTimesBought('unlockabgb').gt(Decimal.dZero)) {
         abgbBoost = onBoughtInc(
            player.alphaNum.cbrt(), '/', D(100), '*', 'abgbefficiency', '+', Decimal.dOne
         )
      }

      getElement('abgbtext').textContent = `Your alpha-based generator boost is multiplying your generators by ${formatb(abgbBoost)}x (cbrt(alpha)/100*${formatD(getUpgradeTimesBought("abgbefficiency").plus(Decimal.dOne))})`

      const gain: Decimal = onBought(
         ['biggerbatches', '+', Decimal.dOne], '*', 'gen', '*', ['speed', '/', D(10), '+', D(0.1)], '*', player.genBoostMult, '*', [[totalBoostFromNP, '+', Decimal.dOne], '^', Decimal.dTwo], '*',
         [D(3), '^', 'threeboost'], '*', [Decimal.dOne, '+', [[player.boosterParticles, '+', Decimal.dOne], '/', D(100), '*', [['boosteruppercent', '+', Decimal.dOne], '/', D(100)]]], '*', abgbBoost, '*', boostsacmult
      );

      getElement('particlesperclick').textContent =
         'You are getting ' +
         formatb(onBought(['mbup', '+', Decimal.dOne], '*', ['mbmult', '+', Decimal.dOne], '*', [totalBoostFromNP, '+', Decimal.dOne]).times(clickerParticleMult)
         ) +
         ' particles per click';

      getElement('alphapb').textContent =
         'You are getting ' + formatb(alphaGain) + ' Alpha/bang';
      getElement('bangtimeconst').textContent =
         'Currently, bangs take ' + format(player.bangTime / 10) + ' seconds.';
      player.bangTimeLeft -= 1;

      if (player.bangTimeLeft >= 0 && player.bangTimeLeft <= player.bangTime) {
         getElement('bangtimeleft').textContent =
            'Bang time left: ' + format(player.bangTimeLeft / 10);
         getElement('bangbutton').style.display = 'none';
      } else {
         getElement('bangbutton').style.display = 'block';
      }

      getElement('betapb').textContent =
         'You are getting ' + formatb(betaGain) + ' Beta/merge';
      getElement('mergetimeconst').textContent =
         'Currently, merges take ' + format(player.mergeTime / 10) + ' seconds.';
      player.mergeTimeLeft -= 1;

      if (player.mergeTimeLeft >= 0 && player.mergeTimeLeft <= player.mergeTime) {
         getElement('mergetimeleft').textContent =
            'Merge time left: ' + format(player.mergeTimeLeft / 10);
         getElement('mergebutton').style.display = 'none';
      } else {
         getElement('mergebutton').style.display = 'block';
      }

      if (player.genBoostTimeLeft.gt(Decimal.dZero)) {
         player.genBoostTimeLeft = player.genBoostTimeLeft.minus(Decimal.dOne);
      }
      getElement('divgbtl').textContent =
         'Boost Time Left: ' + formatb(player.genBoostTimeLeft.div(Decimal.dTen));

      const bpGain = (player.alphaNum.times(
         getUpgradeTimesBought('boosterup').plus(Decimal.dOne)
      )).times(Decimal.dTwo).div(Decimal.dTen);
      player.boosterParticles = player.boosterParticles.plus(bpGain);
      const percentBoostDisplay =
         player.boosterParticles.times(
            getUpgradeTimesBought('boosteruppercent').plus(Decimal.dOne).div(100)
         );

      if (percentBoostDisplay.lt(100)) {
         getElement('boostersmaintext').textContent =
            `You are currently getting ${formatb(bpGain.times(Decimal.dTen).div(player.alphaNum))} booster particles per alpha particle per second,
               resulting in a +${formatbSpecific(percentBoostDisplay)}% boost to base particle production`;
      }
      else {
         getElement('boostersmaintext').textContent =
            `You are currently getting ${formatb(bpGain.times(Decimal.dTen).div(player.alphaNum))} booster particles per alpha particle per second,
               resulting in a ${formatbSpecific(percentBoostDisplay.div(100).plus(1))}x boost to base particle production`;

      }

      getElement('bpamount').textContent =
         'You have ' + formatb(player.boosterParticles) + ' booster particles';

      const clickerParticleGain = onBought(
         [['machine', '*', [D(1.5), '^', 'speedparticle']], '/', Decimal.dTen]
      ).times(machineProd)
      player.clickerParticles = player.clickerParticles.plus(clickerParticleGain);

      nextFeatureHandler();

      getElement('omegabasecost').textContent =
         'Cost: ' + formatb(player.omegaBaseCost);
      getElement('divobase').textContent = 'You have ' + formatD(player.omegaBase, 1);
      getElement('omegaalphacost').textContent =
         'Cost: ' + formatb(player.omegaAlphaCost);
      getElement('divoalpha').textContent = 'You have ' + formatD(player.omegaAlpha, 1);

      player.num = player.num.plus(gain);

      getElement("particlespersecond").innerHTML =
         "You are getting <span style='color: #ed6464;'>" + formatb(gain.times(10)) + "</span> particles/s";

      if (player.num.gte(1e8)) {
         getElement('nuclearreach').style.display = 'none';
         getElement('nuclearshow').style.display = 'block';
      }

      if (player.alphaNum.gte(1e6)) {
         getElement('nuclearalphareach').style.display = 'none';
         getElement('nuclearalphashow').style.display = 'block';
      }

      if (player.num.gte(1e9)) {
         getElement('bangshow').style.display = 'block';
      }

      if (player.alphaNum.gte(1e9)) {
         getElement('mergeshow').style.display = 'block';

         getElement("oAlphauupre").style.display = 'none';
         getElement("oAlphauupost").style.display = 'block';
      }

      if (player.boosterParticles.gte(1e5) || getUpgradeTimesBought('boostsacrifice').gt(0)) {
         getElement('bpsacshow').style.display = 'block';
      }

      const freeNuclearParticles = nuclearParticles.minus(getUpgradeTimesBought('nuclearbuy'))
      getElement('npboosttext').textContent = 
          `Your Nuclear Particles Boost is giving you 
          ${formatD(freeNuclearParticles, 1)} 
          free Nuclear Particles`;
      const freeNuclearAlphaParticles = nuclearAlphaParticles.minus(
         getUpgradeTimesBought('nuclearalphabuy')
      );
      getElement('napboosttext').textContent = 
          `Your Nuclear Alpha Particles Boost is giving you 
          ${formatD(freeNuclearAlphaParticles, 1)} 
          free Nuclear Alpha Particles`;

      getElement("counter").innerHTML = 
          `<span style="color: #64ed93">
          ${formatb(player.num)}
          </span> particles`;
      getElement('clickercounter').textContent = 
          `You have 
          ${formatb(player.clickerParticles)} 
          Clicker Particles 
          (${formatb(clickerParticleGain.times(Decimal.dTen))}
          /s), which are making Manual Boost 
          ${formatbSpecific(clickerParticleMult)}
          x stronger.`
      getElement('alphacounter').textContent =
         formatb(player.alphaNum) + ' Alpha particles';
      getElement('betacounter').textContent =
         formatb(player.betaNum) + ' Beta particles';

      if (getUpgradeTimesBought('alphaacc').eq(Decimal.dZero)) {
         getElement('bangwarn').style.display = 'block'
      }
      else {
         getElement('bangwarn').style.display = 'none'
      }
   }
}

function pcaTestConst(): void {
   if (getUpgradeTimesBought('unlockpca').eq(Decimal.dOne)) {
      getElement('pcashow').style.display = 'block';
      getElement('divunlockpca').style.display = 'none';
      getElement('divunlockpcabutton').style.display = 'none';

      if (player.pcaToggle === true) {
         if (player.chunkAutobuyerTimeLeft === 0) {
            player.chunkAutobuyerTimeLeft = player.pcaTime;
            makechunk();
         }

         player.chunkAutobuyerTimeLeft--;
         getElement('untilpca').textContent =
            format(player.chunkAutobuyerTimeLeft / 10) + ' left until next autobuy';
      }
   }
}

function baTestConst(): void {
   if (getUpgradeTimesBought('bangautobuyerunlock').eq(Decimal.dOne)) {
      getElement('bashow').style.display = 'block';
      getElement('divbau').style.display = 'none';
      getElement('divbauextra').style.display = 'none';
      getElement('baunlockbutton').style.display = 'none';

      if (player.bangAutobuyerToggle === true) {
         if (player.bangAutobuyerTimeLeft === 0) {
            player.bangAutobuyerTimeLeft = player.bangAutobuyerTime;
            bang();
         }

         player.bangAutobuyerTimeLeft--;
         getElement('untilba').textContent =
            format(player.bangAutobuyerTimeLeft) + ' left until next autobuy';
      }
   }
}

function instantAutobuyers() {  //TODO: make this function not look like absolute garbage
   if (getUpgradeTimesBought('GnBBAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.genAutobuyerToggle) {
         buyUpgrade('gen');
      }
      if (player.instantAutobuyers.bbAutobuyerToggle) {
         buyUpgrade('biggerbatches');
      }
      getElement('divGnBBA').style.display = 'none'
      getElement('divGnBBAhide').style.display = 'block'
   }
   if (getUpgradeTimesBought('GBUAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.genBoostTimeAutobuyerToggle) {
         buyUpgrade('genboostuptime')
      }
      if (player.instantAutobuyers.genBoostMultAutobuyerToggle) {
         buyUpgrade('genboostupmult')
      }
      getElement('divGBUA').style.display = 'none'
      getElement('divGBUAhide').style.display = 'block'
   }
   if (getUpgradeTimesBought('MBUAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.manBoost1perClickAutobuyerToggle) {
         buyUpgrade('mbup')
      }
      if (player.instantAutobuyers.manBoost1xperClickAutobuyerToggle) {
         buyUpgrade('mbmult')
      }
      getElement('divMBUA').style.display = 'none'
      getElement('divMBUAhide').style.display = 'block'
   }
   if (getUpgradeTimesBought('NPAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.nuclearParticlesAutobuyerToggle) {
         buyUpgrade('nuclearbuy')
      }
      if (player.instantAutobuyers.nuclearAlphaParticlesAutobuyerToggle) {
         buyUpgrade('nuclearalphabuy')
      }
      getElement('divNPA').style.display = 'none'
      getElement('divNPAhide').style.display = 'block'
   }
   if (getUpgradeTimesBought('AAccAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.AlphaAccAutobuyerToggle) {
         buyUpgrade('alphaacc')
      }
      getElement('divAAccA').style.display = 'none'
      getElement('divAAccAhide').style.display = 'block'
   }
   if (getUpgradeTimesBought('SAunlock').eq(Decimal.dOne)) {
      if (player.instantAutobuyers.SpeedAutobuyerToggle) {
         buyUpgrade('speed')
      }
      getElement('divSA').style.display = 'none'
      getElement('divSAhide').style.display = 'block'
   }
}

function savinginloop(): void {
   playerSettings.autoSaveDelay--;

   if (playerSettings.autoSaveDelay === 0) {
      playerSettings.autoSaveDelay = playerSettings.autoSaveSet;
      save();
   }
}

//game loop
setInterval(() => {
   passiveUnlockDisplay();
   pcaTestConst();
   baTestConst();
   fgbTestConst();
   instantAutobuyers();
   getElement('stat').textContent = getSaveString()
      .replace(/","/g, '",\n"')
      .replace(/},"/g, '",\n"');
   savinginloop();
}, 100);

function saveReplace(_key: string, value: unknown): unknown {
   if (value instanceof Decimal) {
      return 'D#' + value.toString();
   }
   return value;
}

function saveSettings(): void {
   const settingfile = JSON.stringify(playerSettings);
   localStorage.setItem(location.pathname + "settings", settingfile);
}

window.saveSettings = saveSettings;

function save(): string {
   const savefile = JSON.stringify(player, saveReplace);
   localStorage.setItem(location.pathname, savefile);
   saveSettings();
   return savefile;
}

window.save = save;

window.reset = function (): void {
   saveSettings();
   localStorage.removeItem(location.pathname);

   //make backup save
   const savefile = JSON.stringify(player, saveReplace);
   localStorage.setItem(location.pathname + "backupsave", savefile);

   location.reload();
};